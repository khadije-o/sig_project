import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import {
  getDesignations,
  createDesignation,
  updateDesignation,
  deleteDesignation,
} from '../../services/designationService';
import '../Designation/Designation.css';

interface Designation {
  id: number;
  nom: string;
}

const DesignationPage: React.FC = () => {
  const [designations, setDesignations] = useState<Designation[]>([]);
  const [nom, setNom] = useState<string>('');
  const [editMode, setEditMode] = useState<boolean>(false);
  const [editingDesignation, setEditingDesignation] = useState<Designation | null>(null);

  useEffect(() => {
    fetchDesignations();
  }, []);

  const fetchDesignations = async () => {
    try {
      const response = await getDesignations();
      setDesignations(response.data);
    } catch {
      Swal.fire('Erreur!', 'Impossible de récupérer les désignations.', 'error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nom.trim()) {
      Swal.fire('Erreur!', 'Le nom est requis.', 'error');
      return;
    }

    try {
      if (editMode && editingDesignation) {
        await updateDesignation(editingDesignation.id, { nom });
        setDesignations(prev =>
          prev.map(d => (d.id === editingDesignation.id ? { ...d, nom } : d))
        );
        Swal.fire('Succès!', 'Désignation mise à jour.', 'success');
      } else {
        const response = await createDesignation({ nom });
        setDesignations(prev => [...prev, response.data]);
        Swal.fire('Succès!', 'Désignation ajoutée.', 'success');
      }

      resetForm();
    } catch {
      Swal.fire('Erreur!', 'Erreur lors de la sauvegarde.', 'error');
    }
  };

  const handleEdit = (designation: Designation) => {
    setNom(designation.nom);
    setEditingDesignation(designation);
    setEditMode(true);
  };

  const handleDelete = async (id: number) => {
    const confirm = await Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Cette action est irréversible.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer',
    });

    if (confirm.isConfirmed) {
      try {
        await deleteDesignation(id);
        setDesignations(prev => prev.filter(d => d.id !== id));
        Swal.fire('Supprimé!', 'La désignation a été supprimée.', 'success');
      } catch {
        Swal.fire('Erreur!', 'Suppression échouée.', 'error');
      }
    }
  };

  const resetForm = () => {
    setNom('');
    setEditMode(false);
    setEditingDesignation(null);
  };

  return (
    <div className="designation-wrapper">
      <div className="form-container">
        <h2>{editMode ? 'Modifier' : 'Ajouter'} une Désignation</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nom:</label>
            <input
              type="text"
              value={nom}
              onChange={e => setNom(e.target.value)}
              placeholder="Nom de la désignation"
            />
          </div>
          <div className="form-buttons">
            <button type="submit">{editMode ? 'Mettre à jour' : 'Ajouter'}</button>
            {editMode && (
              <button type="button" className="cancel-btn" onClick={resetForm}>
                Annuler
              </button>
            )}
          </div>
        </form>
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
