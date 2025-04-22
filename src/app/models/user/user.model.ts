export interface User {
  idUser: number;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  adresse?: string;
  role: string;
  dateInscription?: string;
  produits?: any[]; 
  participations?: any[];
}
