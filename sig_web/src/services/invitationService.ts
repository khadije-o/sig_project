import axios from 'axios';

export const getInvitationsByAdmin = (token: string) =>
  axios.get(`http://localhost:8000/invitations_offre/invitations_offre/`, {
    headers: { Authorization: `Bearer ${token}` }
  });

export const getInvitationFicheAssociations = (token: string) =>
  axios.get(`http://localhost:8000/invitation_fiche_besoin/invitation_fiche_besoin/`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getFicheDetails = (token: string, ficheId: number) =>
  axios.get(`http://localhost:8000/fiches_besoin/fiches_besoin/${ficheId}/`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const downloadInvitationPDF = (token: string, invitationId: number) =>
  axios.get(`http://localhost:8000/invitation_fiche_besoin/invitation_fiche_besoin/pdf_invitation/${invitationId}/`, {
    headers: { Authorization: `Bearer ${token}` },
    responseType: 'blob',
  });
