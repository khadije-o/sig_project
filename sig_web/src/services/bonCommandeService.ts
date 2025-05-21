import axios from "axios";
import { BonCommande } from "../types/devisTypes";

const API_URL = "http://localhost:8000/boncommande"; 

export const getBonCommandes = async (token: string): Promise<BonCommande[]> => {
  const res = await axios.get(`${API_URL}/boncommande/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const downloadBonCommandePdf = async (id: number, token: string) => {
  const response = await fetch(`http://localhost:8000/boncommande/boncommande/${id}/pdf/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error('Erreur lors du téléchargement du PDF');

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `boncommande_${id}.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
};



export const getBonCommandeById = async (id: number, token: string): Promise<BonCommande> => {
  const response = await axios.get<BonCommande>(`http://localhost:8000/boncommande/boncommande/${id}/`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};
