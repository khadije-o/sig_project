import { useEffect, useState } from 'react';
import { getDesignations } from '../services/designationService';

export interface Designation {
  id: number;
  nom: string;
}

export function useDesignations() {
  const [designations, setDesignations] = useState<Designation[]>([]);

  useEffect(() => {
    getDesignations()
      .then(res => setDesignations(res.data))
      .catch(err => console.error('Erreur de chargement des désignations :', err));
  }, []);

  return designations;
}
