import axios from 'axios';
import { Fournisseur } from '../types/fournisseurTypes';

export const getAuthHeaders = () => {
  const tokens = JSON.parse(localStorage.getItem('authTokens') || '{}');
  return {
    Authorization: `Bearer ${tokens?.access || ''}`,
  };
};


const API_URL = 'http://localhost:8000/fournisseurs/fournisseurs/';

export const getFournisseurs = async () => {
  const response = await axios.get(API_URL, { headers: getAuthHeaders() });
  return response.data;
};

export const createFournisseur = async (data: Fournisseur) => {
  return await axios.post(API_URL, data, { headers: getAuthHeaders() });
};

export const updateFournisseur = async (id: number, data: Fournisseur) => {
  return await axios.patch(`${API_URL}${id}/`, data, { headers: getAuthHeaders() });
};

export const deleteFournisseur = async (id: number) => {
  return await axios.delete(`${API_URL}${id}/`, { headers: getAuthHeaders() });
};
