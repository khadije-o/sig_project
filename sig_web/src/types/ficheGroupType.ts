import { Designation } from "./ficheTypes";

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
  is_staff: boolean;
}

export interface Fiche {
  id: number;
  numero: number;
  date_fiche: string;
  status: string;
  user: User;
  besoins: Besoin[];
}

export interface InvitationPayload {
  val_offre: number;
  delai_offre: number;
  admin: number;
}