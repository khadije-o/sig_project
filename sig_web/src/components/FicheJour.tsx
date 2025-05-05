// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// interface Designation {
//   id: number;
//   nom: string;
// }

// interface Fiche {
//   id: number;
//   quantité: number;
//   designation: number; // ID de la désignation
//   observation: string;
//   date_creation: string;
// }

// const FicheDuJour: React.FC = () => {
//   const [fiches, setFiches] = useState<Fiche[]>([]);
//   const [designations, setDesignations] = useState<Designation[]>([]);
//   const [error, setError] = useState<string | null>(null);
//   const [today, setToday] = useState<string>('');
//   const [editingFiche, setEditingFiche] = useState<Fiche | null>(null);
//   const [formData, setFormData] = useState<Partial<Fiche>>({});

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [ficheRes, designationRes] = await Promise.all([
//           axios.get('http://localhost:8000/generatefiles/fiche-du-jour/'),
//           axios.get('http://localhost:8000/designation/'),
//         ]);

//         setFiches(ficheRes.data.fiches);
//         setDesignations(designationRes.data);
//         setToday(new Date().toLocaleDateString('fr-FR'));
//       } catch (err) {
//         setError("Erreur lors du chargement des données.");
//       }
//     };

//     fetchData();
//   }, []);

//   const handleDelete = async (id: number) => {
//     if (!window.confirm("Confirmez-vous la suppression de cet enregistrement ?")) return;

//     try {
//       await axios.delete(`http://localhost:8000/generatefiles/fichebesoin/${id}/`);
//       setFiches(prev => prev.filter(fiche => fiche.id !== id));
//     } catch (err) {
//       alert("Erreur lors de la suppression.");
//     }
//   };

//   const startEditing = (fiche: Fiche) => {
//     setEditingFiche(fiche);
//     setFormData({
//       quantité: fiche.quantité,
//       designation: fiche.designation,
//       observation: fiche.observation,
//     });
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: name === 'quantité' || name === 'designation' ? parseInt(value) || '' : value,
//     }));
//   };

//   const handleUpdate = async () => {
//     if (!editingFiche) return;

//     try {
//       const response = await axios.patch(
//         `http://localhost:8000/generatefiles/fichebesoin/${editingFiche.id}/`,
//         formData
//       );
//       setFiches(fiches.map(f =>
//         f.id === editingFiche.id ? response.data : f
//       ));
//       setEditingFiche(null);
//     } catch (err) {
//       alert("Erreur lors de la mise à jour.");
//     }
//   };

//   const getDesignationName = (id: number) => {
//     const item = designations.find(d => d.id === id);
//     return item ? item.nom : 'Inconnu';
//   };

//   return (
//     <div>
//       <h2>Fiches de Besoin du {today}</h2>

//       {editingFiche && (
//         <div className="edit-form">
//           <h3>Modifier la fiche</h3>
//           <div>
//             <label>Quantité:</label>
//             <input
//               type="number"
//               name="quantité"
//               value={formData.quantité || ''}
//               onChange={handleInputChange}
//             />
//           </div>
//           <div>
//             <label>Désignation:</label>
//             <select
//               name="designation"
//               value={formData.designation || ''}
//               onChange={handleInputChange}
//             >
//               <option value="">-- Choisir --</option>
//               {designations.map(d => (
//                 <option key={d.id} value={d.id}>{d.nom}</option>
//               ))}
//             </select>
//           </div>
//           <div>
//             <label>Observation:</label>
//             <input
//               type="text"
//               name="observation"
//               value={formData.observation || ''}
//               onChange={handleInputChange}
//             />
//           </div>
//           <button onClick={handleUpdate}>Enregistrer</button>
//           <button onClick={() => setEditingFiche(null)}>Annuler</button>
//         </div>
//       )}

//       <table>
//         <thead>
//           <tr>
//             <th>Quantité</th>
//             <th>Désignation</th>
//             <th>Observation</th>
//             <th>Date de Création</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {fiches.length > 0 ? (
//             fiches.map(fiche => (
//               <tr key={fiche.id}>
//                 <td>{fiche.quantité}</td>
//                 <td>{getDesignationName(fiche.designation)}</td>
//                 <td>{fiche.observation}</td>
//                 <td>{fiche.date_creation}</td>
//                 <td>
//                   <button onClick={() => startEditing(fiche)}>
//                     <i className="fa fa-pencil" />
//                   </button>
//                   <button onClick={() => handleDelete(fiche.id)}>
//                     <i className="fa fa-trash" />
//                   </button>
//                 </td>
//               </tr>
//             ))
//           ) : (
//             <tr><td colSpan={5}>Aucune fiche pour aujourd'hui.</td></tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default FicheDuJour;



import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Designation {
  id: number;
  nom: string;
}

interface User {
  id: number;
  first_name: string;
  last_name: string;
}

interface Fiche {
  id: number;
  quantité: number;
  designation: number;
  observation: string;
  date_creation: string;
  user: User; // Ajout de l'utilisateur
}

const FicheDuJour: React.FC = () => {
  const [fiches, setFiches] = useState<Fiche[]>([]);
  const [designations, setDesignations] = useState<Designation[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [today, setToday] = useState<string>('');
  const [editingFiche, setEditingFiche] = useState<Fiche | null>(null);
  const [formData, setFormData] = useState<Partial<Fiche>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ficheRes, designationRes] = await Promise.all([
          axios.get('http://localhost:8000/generatefiles/fiche-du-jour/'),
          axios.get('http://localhost:8000/designation/'),
        ]);

        setFiches(ficheRes.data.fiches);
        setDesignations(designationRes.data);
        setToday(new Date().toLocaleDateString('fr-FR'));
      } catch (err) {
        setError('Erreur lors du chargement des données.');
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Confirmez-vous la suppression de cet enregistrement ?')) return;

    try {
      await axios.delete(`http://localhost:8000/generatefiles/fichebesoin/${id}/`);
      setFiches(prev => prev.filter(fiche => fiche.id !== id));
    } catch (err) {
      alert('Erreur lors de la suppression.');
    }
  };

  const startEditing = (fiche: Fiche) => {
    setEditingFiche(fiche);
    setFormData({
      quantité: fiche.quantité,
      designation: fiche.designation,
      observation: fiche.observation,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantité' || name === 'designation' ? parseInt(value) || '' : value,
    }));
  };

  const handleUpdate = async () => {
    if (!editingFiche) return;

    try {
      const response = await axios.patch(
        `http://localhost:8000/generatefiles/fichebesoin/${editingFiche.id}/`,
        formData
      );
      setFiches(fiches.map(f =>
        f.id === editingFiche.id ? response.data : f
      ));
      setEditingFiche(null);
    } catch (err) {
      alert('Erreur lors de la mise à jour.');
    }
  };

  const getDesignationName = (id: number) => {
    const item = designations.find(d => d.id === id);
    return item ? item.nom : 'Inconnu';
  };

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
            <select
              name="designation"
              value={formData.designation || ''}
              onChange={handleInputChange}
            >
              <option value="">-- Choisir --</option>
              {designations.map(d => (
                <option key={d.id} value={d.id}>{d.nom}</option>
              ))}
            </select>
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
            <th>Utilisateur</th>  {/* Nouvelle colonne */}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {fiches.length > 0 ? (
            fiches.map(fiche => (
              <tr key={fiche.id}>
                <td>{fiche.quantité}</td>
                <td>{getDesignationName(fiche.designation)}</td>
                <td>{fiche.observation}</td>
                <td>{fiche.date_creation}</td>
                <td>{fiche.user.first_name} {fiche.user.last_name}</td>  
                <td>
                  <button onClick={() => startEditing(fiche)}>
                    <i className="fa fa-pencil" />
                  </button>
                  <button onClick={() => handleDelete(fiche.id)}>
                    <i className="fa fa-trash" />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan={6}>Aucune fiche pour aujourd'hui.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default FicheDuJour;
