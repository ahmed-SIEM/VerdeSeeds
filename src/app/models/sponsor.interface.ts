export interface Platform {
  id: number;
  nomPlateforme: string;
}

export interface Sponsor {
  idSponsor?: number;
  nomSponsor: string;
  logo: string;
  datepartenariat: string;
  plateformeSponsor: Platform;
}
