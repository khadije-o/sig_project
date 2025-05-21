

import axios from 'axios';

const API_URL = 'http://localhost:8000/designation/designation/';

export const getDesignations = () => axios.get(API_URL);
export const createDesignation = (data: { nom: string }) => axios.post(API_URL, data);
export const updateDesignation = (id: number, data: { nom: string }) => axios.put(`${API_URL}${id}/`, data);
export const deleteDesignation = (id: number) => axios.delete(`${API_URL}${id}/`);
