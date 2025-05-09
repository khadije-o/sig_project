
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import Swal from 'sweetalert2'; // Import SweetAlert2

// interface Designation {
//   id: number;
//   nom: string;
// }

// interface User {
//   id: number;
//   first_name: string;
//   last_name: string;
// }

// interface Fiche {
//   id: number;
//   quantité: number;
//   designation: number;
//   observation: string;
//   date_creation: string;
//   user: User; // Ajout de l'utilisateur
//   statut: string; // Ajout du statut
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
//       const tokens = localStorage.getItem("authTokens");
//       const auth = tokens ? JSON.parse(tokens) : null;

//       console.log('Token envoyé:', auth?.access);

//       try {
//         const [ficheRes, designationRes] = await Promise.all([
//           axios.get('http://localhost:8000/fiches_besoin/fiches_besoin/fiche-du-jour/', {
//             headers: {
//               Authorization: `Bearer ${auth?.access}`
//             }
//           }),
//           axios.get('http://localhost:8000/designation/', {
//             headers: {
//               Authorization: `Bearer ${auth?.access}`
//             }
//           })
//         ]);

//         setFiches(ficheRes.data.fiches);
//         setDesignations(designationRes.data);
//         setToday(new Date().toLocaleDateString('fr-FR'));
//       } catch (err) {
//         console.error(err);
//         setError('Erreur lors du chargement des données.');
//       }
//     };

//     fetchData();
//   }, []);

//   const handleDelete = async (id: number) => {
//     const result = await Swal.fire({
//       title: 'Êtes-vous sûr?',
//       text: 'Vous ne pourrez pas récupérer cette fiche après suppression!',
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonText: 'Oui, supprimer!',
//       cancelButtonText: 'Annuler'
//     });

//     if (result.isConfirmed) {
//       try {
//         await axios.delete(`http://localhost:8000/fiches_besoin/fiches_besoin/${id}/`);
//         setFiches(prev => prev.filter(fiche => fiche.id !== id));
//         Swal.fire('Supprimé!', 'La fiche a été supprimée.', 'success');
//       } catch (err) {
//         Swal.fire('Erreur!', 'Erreur lors de la suppression de la fiche.', 'error');
//       }
//     }
//   };

//   const startEditing = (fiche: Fiche) => {
//     setEditingFiche(fiche);
//     setFormData({
//       quantité: fiche.quantité,
//       designation: fiche.designation,
//       observation: fiche.observation,
//       statut: fiche.statut, // Ajout du statut à l'édition
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

//     const tokens = localStorage.getItem("authTokens");
//     const auth = tokens ? JSON.parse(tokens) : null;

//     try {
//       const response = await axios.patch(
//         `http://localhost:8000/fiches_besoin/fiches_besoin/${editingFiche.id}/`,
//         formData,
//         {
//           headers: {
//             Authorization: `Bearer ${auth?.access}`
//           }
//         }
//       );
//       setFiches(fiches.map(f =>
//         f.id === editingFiche.id ? response.data : f
//       ));
//       setEditingFiche(null);
//       Swal.fire('Modifié!', 'La fiche a été mise à jour.', 'success');
//     } catch (err) {
//       Swal.fire('Erreur!', 'Erreur lors de la mise à jour de la fiche.', 'error');
//     }
//   };

//   const getDesignationName = (id: number) => {
//     const item = designations.find(d => d.id === id);
//     return item ? item.nom : 'Inconnu';
//   };

//   const getStatutLabel = (statut: string) => {
//     const statuts: Record<string, string> = {
//       'en_attente': 'En attente',
//       'acceptee': 'Acceptée',
//       'rejetee': 'Rejetée',
//       'historique': 'Historique'
//     };
//     return statuts[statut] || statut;
//   };

//   const showDetail = (fiche: Fiche) => {
//     Swal.fire({
//       title: `Détails de la fiche #${fiche.id}`,
//       html: `
//         <strong>Quantité:</strong> ${fiche.quantité}<br />
//         <strong>Désignation:</strong> ${getDesignationName(fiche.designation)}<br />
//         <strong>Observation:</strong> ${fiche.observation}<br />
//         <strong>Date de création:</strong> ${fiche.date_creation}<br />
//         <strong>Utilisateur:</strong> ${fiche.user.first_name} ${fiche.user.last_name}<br />
//         <strong>Statut:</strong> ${getStatutLabel(fiche.statut)}<br />
//       `,
//       icon: 'info'
//     });
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
//           <div>
//             <label>Statut:</label>
//             <select
//               name="statut"
//               value={formData.statut || ''}
//               onChange={handleInputChange}
//             >
//               <option value="en_attente">En attente</option>
//               <option value="acceptee">Acceptée</option>
//               <option value="rejetee">Rejetée</option>
//               <option value="historique">Historique</option>
//             </select>
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
//             <th>Utilisateur</th>
//             <th>Statut</th> {/* Nouvelle colonne pour le statut */}
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
//                 <td>{fiche.user.first_name} {fiche.user.last_name}</td>
//                 <td>
//                   <span className={`statut-badge statut-${fiche.statut}`}>
//                     {getStatutLabel(fiche.statut)}
//                   </span>
//                 </td>
//                 <td>
//                   <button onClick={() => showDetail(fiche)}>
//                     <i className="fa fa-eye" /> Voir
//                   </button>
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
//             <tr><td colSpan={7}>Aucune fiche pour aujourd'hui.</td></tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default FicheDuJour;
