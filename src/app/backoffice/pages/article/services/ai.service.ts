import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AIService {
  private apiUrl = 'https://openrouter.ai/api/v1/chat/completions';
  private apiKey = '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';
  private readonly AGRICULTURAL_KEYWORDS = [
    'tracteur', 'moissonneuse', 'semoir', 'charrue', 'cultivateur',
    'irrigation', 'engrais', 'pesticide', 'serre', 'récolte',
    'agriculture', 'ferme', 'culture', 'champ', 'sol'
  ];

  constructor(private http: HttpClient) {}

  validateContent(title: string): boolean {
    return this.AGRICULTURAL_KEYWORDS.some(keyword => 
      title.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  generateDescription(title: string): Observable<any> {
    if (!this.validateContent(title)) {
      return new Observable(observer => {
        observer.error('Le titre doit être lié à un produit agricole');
      });
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://verdeseeds.com',
      'X-Title': 'VerdeSeeds Agricultural Platform'
    });

    const body = {
      model: "mistralai/mixtral-8x7b-instruct",
      messages: [
        {
          role: "system",
          content: "Vous êtes un expert agricole. Rédigez des descriptions concises et complètes. Assurez-vous que chaque phrase est terminée correctement."
        },
        {
          role: "user",
          content: `Décrivez le produit agricole suivant en un court paragraphe complet : "${title}"

          Si ce n'est pas un produit agricole, répondez uniquement "ERREUR: Produit non agricole".
          
          En maximum 300 caractères, présentez ses caractéristiques techniques essentielles, son utilisation et son principal avantage pour l'agriculteur. Le texte doit être fluide et chaque phrase doit être complète.
          
          Important: Terminez toujours par une phrase complète.`
        }
      ],
      max_tokens: 300,
      temperature: 0.5,
      presence_penalty: 0.2,
      frequency_penalty: 0.5    };

    return this.http.post(this.apiUrl, body, { headers });
  }
}