import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import "../../../css/Designation.css";

// Définir le type pour une Désignation
interface Designation {
  id: number;
  nom: string;
}

const DesignationPage: React.FC = () => {
  // États pour gérer la liste des désignations, la désignation en cours d'édition, etc.
  const [designations, setDesignations] = useState<Designation[]>([]);
  const [nom, setNom] = useState<string>(''); 
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [editingDesignation, setEditingDesignation] = useState<Designation | null>(null);

  // Utilisation du useEffect pour charger la liste des désignations lors du premier rendu
  useEffect(() => {
    const fetchDesignations = async () => {
      try {
        const response = await axios.get('http://localhost:8000/designation/designation/');
        setDesignations(response.data);
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Erreur!',
          text: 'Impossible de récupérer les désignations.',
        });
      }
    };

    fetchDesignations();
  }, []);

  // Fonction pour gérer les changements dans le champ de texte pour le nom
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNom(e.target.value);
  };

  // Fonction pour gérer la soumission du formulaire (ajout ou modification)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nom) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur!',
        text: 'Le nom de la désignation est requis.',
      });
      return;
    }

    if (editMode && editingDesignation) {
      try {
        await axios.put(`http://localhost:8000/designation/designation/${editingDesignation.id}/`, { nom });
        
        setDesignations(
          designations.map(d => (d.id === editingDesignation.id ? { ...d, nom } : d))
        );
        setNom('');
        setEditMode(false);
        setEditingDesignation(null);

        Swal.fire({
          icon: 'success',
          title: 'Mis à jour!',
          text: 'La désignation a été mise à jour.',
        });
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Erreur!',
          text: 'Erreur lors de la mise à jour de la désignation.',
        });
      }
    } else {
      try {
        await axios.post('http://localhost:8000/designation/designation/', { nom });
        setDesignations([...designations, { id: Math.random(), nom }]);
        setNom('');
        Swal.fire({
          icon: 'success',
          title: 'Ajouté!',
          text: 'La désignation a été ajoutée.',
        });
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Erreur!',
          text: 'Erreur lors de l\'ajout de la désignation.',
        });
      }
    }
  };

  // Fonction pour gérer l'édition d'une désignation
  const handleEdit = (designation: Designation) => {
    setNom(designation.nom);
    setEditMode(true);
    setEditingDesignation(designation);
  };

  // Fonction pour gérer la suppression d'une désignation
  const handleDelete = async (id: number) => {
    const confirm = await Swal.fire({
      title: 'Êtes-vous sûr?',
      text: 'Vous ne pourrez pas revenir en arrière!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer!',
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`http://localhost:8000/designation/designation/${id}/`);
        setDesignations(designations.filter(d => d.id !== id));

        Swal.fire(
          'Supprimé!',
          'La désignation a été supprimée.',
          'success'
        );
      } catch (err) {
        Swal.fire(
          'Erreur!',
          'Impossible de supprimer la désignation.',
          'error'
        );
      }
    }
  };

 
return (
  <div className="designation-wrapper">
    <div className="form-container">
      <h2>{editMode ? 'Modifier' : 'Ajouter'} une Désignation</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nom de la Désignation:</label>
          <input
            type="text"
            value={nom}
            onChange={handleInputChange}
            placeholder="Nom de la désignation"
          />
        </div>

        <div className="form-buttons">
          <button type="submit">
            {editMode ? 'Mettre à jour' : 'Ajouter'}
          </button>
          {editMode && (
            <button
              type="button"
              className="cancel-btn"
              onClick={() => {
                setEditMode(false);
                setEditingDesignation(null);
                setNom('');
              }}
            >
             Annuler
            </button>
          )}
        </div>
      </form>

      {error && <div className="error-message">{error}</div>}
    </div>

    <div className="table-container">
      <h2>Liste des Désignations</h2>
      <table>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {designations.map(designation => (
            <tr key={designation.id}>
              <td>{designation.nom}</td>
              <td className="action-buttons">
                <button onClick={() => handleEdit(designation)} title="Modifier">
                  <i className="fal fa-pen-to-square"></i>
                </button>
                <button onClick={() => handleDelete(designation.id)} title="Supprimer">
                  <i className="fal fa-trash-alt"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
};

export default DesignationPage;
