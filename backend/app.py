from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
from sklearn.cluster import KMeans
from PIL import Image
import io
import warnings
from groq import Groq
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Groq initialization
client = Groq(api_key=os.getenv("GROQ_API_KEY"))
VALIDATION_PROMPT = "You are an intelligent assistant. Analyze the input question carefully. Respond with 'Yes' if the input is agriculture-related, and 'No' otherwise."
RESPONSE_PROMPT = "You are an agriculture expert. Provide a concise and accurate answer to the following agriculture-related question:"

def validate_input(input_text):
    try:
        validation_response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": VALIDATION_PROMPT},
                {"role": "user", "content": input_text},
            ],
            temperature=0,
            max_completion_tokens=1,
        )
        return validation_response.choices[0].message.content.strip()
    except Exception as e:
        return f"Error: {e}"

def get_agriculture_response(input_text):
    try:
        detailed_response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": RESPONSE_PROMPT},
                {"role": "user", "content": input_text},
            ],
            temperature=0.5,
            max_completion_tokens=700,
        )
        return detailed_response.choices[0].message.content.strip()
    except Exception as e:
        return f"Error: {e}"

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    if not data or 'message' not in data:
        return jsonify({'error': 'No message provided'}), 400
    
    input_text = data['message']
    validation_result = validate_input(input_text)
    
    if validation_result.lower() == "yes":
        response = get_agriculture_response(input_text)
    elif validation_result.lower() == "no":
        response = "❌ This is not an agriculture-related question."
    else:
        response = f"⚠️ Unexpected response: {validation_result}"
    
    return jsonify({'response': response})

def extract_dominant_colors(image_data, num_colors=5):
    """Extract dominant colors from image data and return as hex codes"""
    try:
        # Load image using PIL
        image = Image.open(io.BytesIO(image_data))
        image = image.convert('RGB')
        
        # Convert to numpy array and resize for faster processing
        image_array = np.array(image)
        small_image = Image.fromarray(image_array).resize((100, 100))
        pixels = np.array(small_image).reshape(-1, 3)
        
        # Perform K-means clustering
        with warnings.catch_warnings():
            warnings.simplefilter("ignore")
            kmeans = KMeans(n_clusters=num_colors, n_init=10)
            kmeans.fit(pixels)
        
        # Get cluster centers and convert to hex
        colors = kmeans.cluster_centers_.astype(int)
        hex_colors = [rgb_to_hex(color) for color in colors]
        
        return hex_colors
        
    except Exception as e:
        raise Exception(f"Error processing image: {str(e)}")

def rgb_to_hex(rgb):
    """Convert RGB tuple to HEX string"""
    return "#{:02x}{:02x}{:02x}".format(*rgb)

@app.route('/analyze-colors', methods=['POST'])
def analyze_colors():
    """API endpoint for color analysis that returns hex codes"""
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    try:
        # Read image data
        image_data = file.read()
        
        # Extract dominant colors as hex codes
        dominant_colors = extract_dominant_colors(image_data)
        
        return jsonify({
            'dominant_colors': dominant_colors
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)