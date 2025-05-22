import axios from "axios";
import { Fiche, InvitationPayload } from "../types/ficheGroupType";

const API_BASE = "http://localhost:8000";

// Récupérer toutes les fiches
export const getFiches = async (
  token: string
): Promise<{ data: Fiche[] }> => {
  return await axios.get(`${API_BASE}/fiches_besoin/fiches_besoin/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

//  Mettre à jour le statut d'une fiche
export const updateFicheStatus = async (
  ficheId: number,
  newStatus: string,
  token: string
): Promise<{ data: any }> => {
  return await axios.patch(
    `${API_BASE}/fiches_besoin/fiches_besoin/${ficheId}/`,
    { status: newStatus },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

//  Supprimer une fiche
export const deleteFiche = async (
  ficheId: number,
  token: string
): Promise<{ data: any }> => {
  return await axios.delete(
    `${API_BASE}/fiches_besoin/fiches_besoin/${ficheId}/`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

// Télécharger PDF d'une fiche
export const downloadFichePdf = async (
  ficheId: number,
  token: string
): Promise<{ data: Blob }> => {
  return await axios.get(
    `${API_BASE}/fiches_besoin/fiches_besoin/pdf_fiche/${ficheId}/`,
    {
      headers: { Authorization: `Bearer ${token}` },
      responseType: "blob",
    }
  );
};

//  Créer une invitation
export const createInvitation = async (
  data: InvitationPayload, // typé ci-dessous
  token: string
): Promise<{ data: { id: number } }> => {
  return await axios.post(
    `${API_BASE}/invitations_offre/invitations_offre/`,
    data,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

//  Lier une fiche à une invitation
export const linkFicheToInvitation = async (
  invitationId: number,
  ficheId: number,
  token: string
): Promise<{ data: any }> => {
  return await axios.post(
    `${API_BASE}/invitation_fiche_besoin/invitation_fiche_besoin/`,
    {
      invitation: invitationId,
      fiche_besoin: ficheId,
    },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};
