import React, { useState, useContext, FormEvent } from 'react';
import Swal from 'sweetalert2';
import AuthContext from '../../context/AuthContext';
import { postFicheBesoins } from '../../services/ficheBesoinsService';
import { useDesignations } from '../../hooks/useDesignations';
import BesoinField from './BesoinField';
import './FicheForm.css';
import Button from '../button/button';

interface FicheBesoinsForm {
  quantité: number;
  designation: number;
  observation: string;
}

const FicheForm: React.FC = () => {
  const [besoins, setBesoins] = useState<FicheBesoinsForm[]>([
    { quantité: 1, designation: 0, observation: '' }
  ]);
  const designations = useDesignations();
  const { user } = useContext(AuthContext);

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const updated = [...besoins];
    const key = name as keyof FicheBesoinsForm;

    if (key === 'quantité' || key === 'designation') {
      updated[index][key] = value === '' ? 0 : parseInt(value);
    } else {
      updated[index][key] = value;
    }

    setBesoins(updated);
  };

  const handleAddBesoin = () => {
    setBesoins([...besoins, { quantité: 1, designation: 0, observation: '' }]);
  };

  const handleRemoveBesoin = (index: number) => {
    if (besoins.length > 1) {
      const updated = [...besoins];
      updated.splice(index, 1);
      setBesoins(updated);
    } else {
      Swal.fire('Erreur', 'Vous devez avoir au moins un besoin.', 'error');
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!user) {
      Swal.fire('Erreur', 'Vous devez être connecté.', 'error');
      return;
    }

    try {
      await postFicheBesoins({
        user_id: user.user_id,
        besoins
      });

      Swal.fire('Succès', 'Fiche enregistrée!', 'success').then(() => {
        setBesoins([{ quantité: 1, designation: 0, observation: '' }]);
        window.location.reload();
      });
    } catch (error: any) {
      console.error(error);
      Swal.fire('Erreur', 'Échec de l’enregistrement.', 'error');
    }
  };

  return (
    <div className="form-container">
      <h2>Ajouter un Fiche de besoins</h2>
      <form onSubmit={handleSubmit}>
        {besoins.map((besoin, index) => (
          <BesoinField
            key={index}
            index={index}
            besoin={besoin}
            designations={designations}
            onChange={handleChange}
            onRemove={handleRemoveBesoin}
            showRemove={besoins.length > 1}
          />
        ))}

        <div className="form-buttons">
          <Button type="button" variant="secondary" onClick={handleAddBesoin} className="add-btn">
            <i className="fas fa-plus"></i>
          </Button>
          <Button type="submit" variant="secondary">Enregistrer</Button>
        </div>
      </form>
    </div>
  );
};

export default FicheForm;
