export interface Designation {
  id: number;
  nom: string;
}

export interface Besoin {
  id: number;
  quantite: number;
  observation: string;
  designation: Designation;
}

export interface User {
  id: number;
  first_name: string;
  last_name: string;
}

export interface Fiche {
  id: number;
  numero: number;
  date_fiche: string;
  status: string;
  user: User;
  besoins: Besoin[];
}

export interface Invitation {
  id: number;
  val_offre: number;
  delai_offre: number;
  admin: User;
  created_at: string;
}

export interface InvitationFiche {
  id: number;
  invitation: number;
  fiche_besoin: Fiche;
}
