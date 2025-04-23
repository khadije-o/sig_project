import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Fiche {
    id: number;
    quantité: number;
    designation: string;
    observation: string;
    date_creation: string;
}

const FicheDuJour: React.FC = () => {
    const [fiches, setFiches] = useState<Fiche[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [today, setToday] = useState<string>('');
    const [editingFiche, setEditingFiche] = useState<Fiche | null>(null);
    const [formData, setFormData] = useState<Partial<Fiche>>({});

    useEffect(() => {
        const fetchFiches = async () => {
            try {
                const response = await axios.get('http://localhost:8000/generatefiles/fiche-du-jour/');
                setFiches(response.data.fiches);
                setToday(new Date().toLocaleDateString('fr-FR'));
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("Une erreur inconnue est survenue.");
                }
            }
        };

        fetchFiches();
    }, []);

    const handleDelete = (id: number) => {
        const confirmDelete = window.confirm("Voulez-vous vraiment supprimer cette fiche ?");
        if (!confirmDelete) return;
      
        axios.delete(`http://localhost:8000/generatefiles/fichebesoin/${id}/`)
          .then(() => {
            alert("Fiche supprimée !");
            // Recharger les données après suppression
            setFiches(prev => prev.filter(fiche => fiche.id !== id));
          })
          .catch(err => {
            console.error("Erreur suppression :", err);
            alert("Erreur lors de la suppression.");
          });
      };
      

    const startEditing = (fiche: Fiche) => {
        setEditingFiche(fiche);
        setFormData({
            quantité: fiche.quantité,
            designation: fiche.designation,
            observation: fiche.observation
        });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdate = async () => {
        if (!editingFiche) return;
        
        try {
            const response = await axios.patch(
                `http://localhost:8000/generatefiles/fichebesoin/${editingFiche.id}/`,
                formData
            );
            setFiches(fiches.map(fiche => 
                fiche.id === editingFiche.id ? response.data : fiche
            ));
            setEditingFiche(null);
        } catch (err) {
            console.error("Erreur lors de la mise à jour :", err);
        }
    };

    if (error) {
        return <div>Erreur: {error}</div>;
    }

    return (
        <div>
            <h2>Fiches de Besoin du {today}</h2>
            
            {editingFiche && (
                <div className="edit-form">
                    <h3>Modifier la fiche</h3>
                    <div>
                        <label>Quantité:</label>
                        <input
                            type="number"
                            name="quantité"
                            value={formData.quantité || ''}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label>Désignation:</label>
                        <input
                            type="text"
                            name="designation"
                            value={formData.designation || ''}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label>Observation:</label>
                        <input
                            type="text"
                            name="observation"
                            value={formData.observation || ''}
                            onChange={handleInputChange}
                        />
                    </div>
                    <button onClick={handleUpdate}>Enregistrer</button>
                    <button onClick={() => setEditingFiche(null)}>Annuler</button>
                </div>
            )}

            <table>
                <thead>
                    <tr>
                        <th>Quantité</th>
                        <th>Désignation</th>
                        <th>Observation</th>
                        <th>Date de Création</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {fiches.length > 0 ? (
                        fiches.map((fiche) => (
                            <tr key={fiche.id}>
                                <td>{fiche.quantité}</td>
                                <td>{fiche.designation}</td>
                                <td>{fiche.observation}</td>
                                <td>{fiche.date_creation}</td>
                                <td>
                                    <button onClick={() => startEditing(fiche)}>
                                        <i className="fa fa-pencil" aria-hidden="true"></i>
                                    </button>
                                    <button onClick={() => handleDelete(fiche.id)}>
                                        <i className="fa fa-trash" aria-hidden="true"></i>
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={5}>Aucune fiche pour aujourd'hui.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default FicheDuJour;