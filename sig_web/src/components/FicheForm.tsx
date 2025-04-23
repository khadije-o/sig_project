import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';

interface FicheBesoinsForm {
    quantité: number | '';
    designation: string;
    observation: string;
}

const FicheForm: React.FC = () => {
  const [formData, setFormData] = useState<FicheBesoinsForm>({
    quantité: '',
    designation: '',
    observation: ''
  });


  const designations = ['Ordinateur', 'Imprimante', 'Bureau', 'Chaise', 'Scanner'];

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantité' ? parseInt(value) || '' : value
    }));
  };

  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    axios.post('http://localhost:8000/generatefiles/fichebesoin/', formData)
      .then(response => {
        console.log('Ajouté  :', response.data);
        alert('Fiche ajoutée !');
        setFormData({ quantité: '', designation: '', observation: '' });
      })
      .catch(error => {
        console.error('Erreur  :', error);
        alert('Erreur lors de l’ajout !');
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Ajouter une Fiche de Besoin</h2>

      <label>Quantité:</label>
      <input
        type="number"
        name="quantité"
        min="1" 
        value={formData.quantité}
        onChange={handleChange}
        required
      />

      <label>Désignation:</label>
      <select
        name="designation"
        value={formData.designation} 
        onChange={handleChange}
        required
      >
        <option value="">-- Choisir --</option>
        {designations.map((item, index) => (
          <option key={index} value={item}>{item}</option>
        ))}
      </select>

      <label>Observation:</label>
      <input
        type="text"
        name="observation"
        value={formData.observation}
        onChange={handleChange}
        
      />

      <button type="submit">Enregistrer</button>
    </form>
  );
};

export default FicheForm;
