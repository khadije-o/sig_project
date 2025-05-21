export interface Fournisseur {
  id?: number;
  nom_entreprise: string;
  telephone: string;
  email: string;
  nif: string;
  rc: string;
  compte_bancaire: string;
}

export interface Designation {
  id: number;
  nom: string;
}
