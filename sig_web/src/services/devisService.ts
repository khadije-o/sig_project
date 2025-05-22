import axios from "axios";
import { BonCommande, DevisGlobal } from "../types/devisTypes";

const API_URL = "http://127.0.0.1:8000";

export const createDevis = async (devisData: any, token: string): Promise<DevisGlobal> => {
  const response = await axios.post(`${API_URL}/devisglobal/devis-globals/`, devisData, {
    headers: { 
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  return response.data;
};

export const getDevisList = (token: string) =>
  axios.get<DevisGlobal[]>(`${API_URL}/devisglobal/devis-globals/`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const deleteDevis = (id: number, token: string) =>
  axios.delete(`${API_URL}/devisglobal/devis-globals/${id}/`, {
    headers: { Authorization: `Bearer ${token}` },
  });



  
export const updateDevis = async (id: number, data: Partial<DevisGlobal>, token: string) => {
  try {
    const response = await axios.patch(`${API_URL}/devisglobal/devis-globals/${id}/`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Détails de l\'erreur:', error.response?.data);
    }
    throw error;
  }
};


export const createBonCommande = async (
  bonData: { numero_bon: string; date_bon: string; devis_id: number },
  token: string
): Promise<BonCommande> => {
  const response = await axios.post(`${API_URL}/boncommande/boncommande/`, bonData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};



export const fetchDevisById = async (id: number, token: string): Promise<DevisGlobal> => {
  const response = await axios.get(`${API_URL}/devisglobal/devis-globals/${id}/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
