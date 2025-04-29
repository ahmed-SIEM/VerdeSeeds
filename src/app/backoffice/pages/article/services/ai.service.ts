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
          content: "Vous êtes un expert en matériel agricole. Votre rôle est de décrire uniquement des équipements et produits agricoles. Si le sujet n'est pas lié à l'agriculture, refusez de générer une description."
        },
        {
          role: "user",
          content: `Générez une description technique et professionnelle pour ce produit agricole: "${title}".
          Important: Si le titre ne correspond pas à un produit agricole, répondez "ERREUR: Produit non agricole".
          Sinon, décrivez:
          1. L'utilité principale dans l'agriculture
          2. Les caractéristiques techniques essentielles
          3. Les avantages pour l'exploitation agricole
          Format: Un paragraphe concis et professionnel.`
        }
      ],
      max_tokens: 150,
      temperature: 0.5,
      presence_penalty: 0.1
    };

    return this.http.post(this.apiUrl, body, { headers });
  }

  validateImageAndTitle(imageUrl: string, title: string): Observable<any> {
    if (!this.validateContent(title)) {
      return new Observable(observer => {
        observer.next({ choices: [{ message: { content: 'false' } }] });
      });
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json'
    });

    const body = {
      model: "mistralai/mixtral-8x7b-instruct",
      messages: [
        {
          role: "system",
          content: "Vous êtes un expert en validation de contenu agricole. Votre tâche est de vérifier strictement la cohérence entre les images et les titres de produits agricoles."
        },
        {
          role: "user",
          content: `Vérifiez si l'image et le titre sont cohérents et appartiennent au domaine agricole:
          Titre: "${title}"
          Image URL: "${imageUrl}"
          
          Répondez uniquement par:
          - "true" si c'est un produit agricole ET si l'image correspond au titre
          - "false" dans tous les autres cas`
        }
      ],
      max_tokens: 10,
      temperature: 0.1
    };

    return this.http.post(this.apiUrl, body, { headers });
  }
}
