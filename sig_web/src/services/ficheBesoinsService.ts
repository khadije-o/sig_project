import axios from 'axios';

const BASE_URL = 'http://localhost:8000/fiches_besoin/fiches_besoin/';

export const postFicheBesoins = (data: any) => {
  return axios.post(BASE_URL, data);
};

export const getFichesByUser = async (token: string, userId: number) => {
  const res = await axios.get(BASE_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.filter((fiche: any) => fiche.user.id === userId);
};

export const downloadFichePdf = async (ficheId: number, token?: string) => {
  const res = await axios.get(`${BASE_URL}pdf_fiche/${ficheId}/`, {
    headers: { Authorization: `Bearer ${token}` },
    responseType: 'blob',
  });
  const url = window.URL.createObjectURL(new Blob([res.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `fiche_besoin_${ficheId}.pdf`);
  document.body.appendChild(link);
  link.click();
};

export const deleteFicheById = async (ficheId: number, token?: string) => {
  await axios.delete(`${BASE_URL}${ficheId}/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const updateBesoin = async (besoinId: number, data: any, token?: string) => {
  await axios.put(`${BASE_URL}besoins/${besoinId}/`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const deleteBesoin = async (besoinId: number, token?: string) => {
  await axios.delete(`${BASE_URL}besoins/${besoinId}/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
