export interface Fournisseur {
  id: number;
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

export interface DevisLigne {
  id: number;
  designation: Designation | number;
  quantite: number;
  prix_unitaire: number;
  prix_total: number;
}

export interface DevisGlobal {
  id: number;
  numero: string;
  fournisseur: Fournisseur;
  date: string;
  total_ht: number;
  tva: number;
  montant_tva: number;
  total_ttc: number;
  lignes: DevisLigne[];
  piece_jointe: string;
}


export interface BonCommande {
  id: number;
  numero_bon: string;
  date_bon: string;
  devis: DevisGlobal;
}