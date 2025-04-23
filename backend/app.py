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
from openai import OpenAI
import json

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Client initializations
client = Groq(api_key=os.getenv("GROQ_API_KEY"))
openrouter_client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENROUTER_API_KEY"),
)

# Prompts
VALIDATION_PROMPT = "You are an intelligent assistant. Analyze the input question carefully. Respond with 'Yes' if the input is agriculture-related, and 'No' otherwise."
RESPONSE_PROMPT = "You are an agriculture expert. Provide a concise and accurate answer to the following agriculture-related question:"
RECOMMEND_PROMPT = "You are an agriculture expert. Based on the following parameters, recommend suitable crops and provide brief cultivation tips:"

AVAILABLE_ICONS = [
    'bi-balloon', 'bi-alarm', 'bi-archive', 'bi-award', 'bi-bag', 'bi-bell',
    'bi-bookmark', 'bi-camera', 'bi-cart', 'bi-chat', 'bi-check', 'bi-clock',
    'bi-cloud', 'bi-code', 'bi-cup', 'bi-emoji-smile', 'bi-envelope', 'bi-flag',
    'bi-gear', 'bi-heart', 'bi-house', 'bi-info-circle', 'bi-key', 'bi-lightning'
]

ELEMENTS_FIELDS = {
    "headerwithicons": ["title", "subtitle", "Ftitle", "Ficon", "Stitle", "Sicon", "Ttitle", "Ticon", "Ptitle", "Picon"],
    "centeredhero": ["title", "subtitle", "imageUrl"],
    "herowithimage": ["title", "subtitle", "imageUrl"],
    "verticallycenteredhero": ["title", "subtitle"],
    "columnswithicons": ["MainTitle", "Ftitle", "Fdescription", "Ficon", "Stitle", "Sdescription", "Sicon", "Ttitle", "Tdescription", "Ticon"],
    "customcards": ["MainTitle", "Ftitle", "Fimage", "Stitle", "Simage", "Ttitle", "Timage"],
    "headings": ["Ftitle", "Fdescription", "Fimage", "Stitle", "Sdescription", "Simage", "Ttitle", "Tdescription", "Timage"],
    "headingleftwithimage": ["title", "subtitle", "imageUrl"],
    "headingrightwithimage": ["title", "subtitle", "imageUrl"],
    "newsletter": ["titleA", "TextB", "TextC", "Image"],
    "plateformeabout": ["title1", "title2", "description", "imageUrl"]
}

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

@app.route('/recommend', methods=['POST'])
def recommend():
    data = request.json
    if not data or 'type' not in data:
        return jsonify({'error': 'Component type is required'}), 400
    
    try:
        component_type = data['type']
        if component_type not in ELEMENTS_FIELDS:
            return jsonify({'error': 'Invalid component type'}), 400

        prompt = f"""Generate ONE SINGLE agricultural e-commerce component with these fields: {ELEMENTS_FIELDS[component_type]}
Rules:
1. Return ONLY ONE item (not multiple)
2. For image fields, use 'https://picsum.photos/200/300'
3. For icon fields, choose from: {AVAILABLE_ICONS}
4. Use agricultural-themed, professional content
5. Return ONLY the JSON object without any markdown formatting
6. Example format for headingrightwithimage:
{{
  "title": "Fresh Harvest",
  "subtitle": "Premium quality produce",
  "imageUrl": "https://picsum.photos/200/300"
}}"""

        response = openrouter_client.chat.completions.create(
            model="google/gemini-2.0-flash-exp:free",
            messages=[{
                "role": "user",
                "content": [{"type": "text", "text": prompt}]
            }]
        )
        
        # Clean the response
        raw_content = response.choices[0].message.content.strip()
        
        # Remove markdown formatting if present
        if raw_content.startswith('```json'):
            raw_content = raw_content[7:-3].strip()
        elif raw_content.startswith('```'):
            raw_content = raw_content[3:-3].strip()
        
        # Parse JSON
        try:
            content_data = json.loads(raw_content)
            
            # If we got an array, take just the first item
            if isinstance(content_data, list):
                content_data = content_data[0]
                
        except json.JSONDecodeError:
            content_data = {"error": "Invalid response format", "raw": raw_content}
        
        # Create the final response
        formatted_response = {
            "name": f"component_{component_type}",
            "type": component_type,
            "content": content_data
        }
        
        return jsonify(formatted_response)

    except Exception as e:
        return jsonify({'error': str(e)}), 500

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