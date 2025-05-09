// import React, { useState, useEffect, ChangeEvent, FormEvent, useContext } from 'react';
// import axios from 'axios';
// import Swal from 'sweetalert2';  // Import SweetAlert
// import AuthContext from '../context/AuthContext';

// interface FicheBesoinsForm {
//   quantité: number | '';
//   designation: number | '';
//   observation: string;
// }

// interface Designation {
//   id: number;
//   nom: string;
// }

// const FicheForm: React.FC = () => {
//   const [formData, setFormData] = useState<FicheBesoinsForm>({
//     quantité: '',
//     designation: '',
//     observation: ''
//   });

//   const [designations, setDesignations] = useState<Designation[]>([]);

//   const { user } = useContext(AuthContext);

//   useEffect(() => {
//     axios.get('http://localhost:8000/designation/designation/')
//       .then(res => setDesignations(res.data))
//       .catch(err => console.error('Erreur de chargement des désignations :', err));
//   }, []);

//   const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: name === 'quantité' || name === 'designation' ? parseInt(value) || '' : value
//     }));
//   };

//   const handleSubmit = (e: FormEvent) => {
//     e.preventDefault();

//     if (!user) {
//       alert("Vous devez être connecté pour soumettre une fiche.");
//       return;
//     }

//     const dataToSend = {
//       ...formData,
//       user_id: user.user_id  // ou `user.id` selon le nom réel dans le token JWT
//     };

//     axios.post('http://localhost:8000/fiches_besoin/fiches_besoin/', dataToSend)
//       .then(response => {
//         Swal.fire({
//           title: 'Succès!',
//           text: 'Fiche ajoutée avec succès!',
//           icon: 'success',
//           confirmButtonText: 'OK'
//         }).then(() => {
//           // Refresh the page after the alert
//           setFormData({ quantité: '', designation: '', observation: '' });
//           window.location.reload();
//         });
//       })
//       .catch(error => {
//         console.error('Erreur lors de l’envoi :', error);
//         Swal.fire({
//           title: 'Erreur!',
//           text: 'Erreur lors de l’ajout de la fiche.',
//           icon: 'error',
//           confirmButtonText: 'OK'
//         });
//       });
//   };

//   return (
//     <div className="form-container">
//       <h2>Ajouter un besoin</h2>
//       <form onSubmit={handleSubmit}>
//         <div className="form-group">
//           <label>Quantité:</label>
//           <input
//             type="number"
//             name="quantité"
//             min="1"
//             value={formData.quantité}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div className="form-group">
//           <label>Désignation:</label>
//           <select
//             name="designation"
//             value={formData.designation}
//             onChange={handleChange}
//             required
//           >
//             <option value="">-- Choisir --</option>
//             {designations.map((item) => (
//               <option key={item.id} value={item.id}>
//                 {item.nom}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div className="form-group">
//           <label>Observation:</label>
//           <input
//             type="text"
//             name="observation"
//             value={formData.observation}
//             onChange={handleChange}
//           />
//         </div>

//         <button type="submit">Enregistrer</button>
//       </form>
//     </div>
//   );
// };

// export default FicheForm;

// import React, { useState, useEffect, useContext, ChangeEvent, FormEvent } from 'react';
// import axios from 'axios';
// import Swal from 'sweetalert2';
// import AuthContext from '../context/AuthContext';

// interface FicheBesoinsForm {
//   quantité: number;
//   designation: number;
//   observation: string;
// }

// interface Designation {
//   id: number;
//   nom: string;
// }

// const FicheForm: React.FC = () => {
//   const [besoins, setBesoins] = useState<FicheBesoinsForm[]>([
//     { quantité: 1, designation: 0, observation: '' }
//   ]);
//   const [designations, setDesignations] = useState<Designation[]>([]);
//   const { user } = useContext(AuthContext);

//   useEffect(() => {
//     axios.get('http://localhost:8000/designation/designation/')
//       .then(res => setDesignations(res.data))
//       .catch(err => console.error('Erreur de chargement des désignations :', err));
//   }, []);

//   const handleChange = (index: number, e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     const updatedBesoins = [...besoins];
//     const key = name as keyof FicheBesoinsForm;

//     if (key === 'quantité' || key === 'designation') {
//       updatedBesoins[index][key] = value === '' ? 0 : parseInt(value);
//     } else {
//       updatedBesoins[index][key] = value;
//     }

//     setBesoins(updatedBesoins);
//   };

//   const handleAddBesoin = () => {
//     setBesoins([...besoins, { quantité: 1, designation: 0, observation: '' }]);
//   };

//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault();

//     if (!user) {
//       Swal.fire('Erreur', 'Vous devez être connecté.', 'error');
//       return;
//     }

//     const data = {
//       user_id: user.user_id,
//       besoins: besoins.map(besoin => ({
//         quantité: besoin.quantité,
//         designation: besoin.designation,
//         observation: besoin.observation
//       }))
//     };

//     try {
//       await axios.post('http://localhost:8000/fiches_besoin/fiches_besoin/', data);

//       Swal.fire('Succès', 'Fiche et besoins ajoutés avec succès!', 'success').then(() => {
//         setBesoins([{ quantité: 1, designation: 0, observation: '' }]);
//         window.location.reload();
//       });
//     } catch (error: any) {
//       console.error('Erreur:', error.response?.data || error);
//       Swal.fire('Erreur', 'Échec de l’enregistrement.', 'error');
//     }
//   };

//   return (
//     <div className="form-container" style={{ padding: '20px', position: 'relative' }}>
//       <h2>Ajouter un besoin</h2>

//       <button
//         type="button"
//         onClick={handleAddBesoin}
//         style={{
//           position: 'absolute',
//           top: 10,
//           right: 10,
//           fontSize: '20px',
//           padding: '5px 10px',
//           cursor: 'pointer'
//         }}
//         title="Ajouter un besoin"
//       >
//         ➕
//       </button>

//       <form onSubmit={handleSubmit}>
//         {besoins.map((besoin, index) => (
//           <div key={index} className="besoin-group" style={{ marginBottom: '20px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
//             <div className="form-group">
//               <label>Quantité:</label>
//               <input
//                 type="number"
//                 name="quantité"
//                 min="1"
//                 value={besoin.quantité}
//                 onChange={(e) => handleChange(index, e)}
//                 required
//               />
//             </div>

//             <div className="form-group">
//               <label>Désignation:</label>
//               <select
//                 name="designation"
//                 value={besoin.designation}
//                 onChange={(e) => handleChange(index, e)}
//                 required
//               >
//                 <option value="">-- Choisir --</option>
//                 {designations.map((item) => (
//                   <option key={item.id} value={item.id}>
//                     {item.nom}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div className="form-group">
//               <label>Observation:</label>
//               <input
//                 type="text"
//                 name="observation"
//                 value={besoin.observation}
//                 onChange={(e) => handleChange(index, e)}
//               />
//             </div>
//           </div>
//         ))}

//         <button type="submit">Enregistrer</button>
//       </form>
//     </div>
//   );
// };

// export default FicheForm;


import React, { useState, useEffect, useContext, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import AuthContext from '../context/AuthContext';

interface FicheBesoinsForm {
  quantité: number;
  designation: number;
  observation: string;
}

interface Designation {
  id: number;
  nom: string;
}

const FicheForm: React.FC = () => {
  const [besoins, setBesoins] = useState<FicheBesoinsForm[]>([
    { quantité: 1, designation: 0, observation: '' }
  ]);
  const [designations, setDesignations] = useState<Designation[]>([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    axios.get('http://localhost:8000/designation/designation/')
      .then(res => setDesignations(res.data))
      .catch(err => console.error('Erreur de chargement des désignations :', err));
  }, []);

  const handleChange = (index: number, e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const updatedBesoins = [...besoins];
    const key = name as keyof FicheBesoinsForm;

    if (key === 'quantité' || key === 'designation') {
      updatedBesoins[index][key] = value === '' ? 0 : parseInt(value);
    } else {
      updatedBesoins[index][key] = value;
    }

    setBesoins(updatedBesoins);
  };

  const handleAddBesoin = () => {
    setBesoins([...besoins, { quantité: 1, designation: 0, observation: '' }]);
  };

  const handleRemoveBesoin = (index: number) => {
    const newBesoins = [...besoins];
    newBesoins.splice(index, 1);
    setBesoins(newBesoins);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!user) {
      Swal.fire('Erreur', 'Vous devez être connecté.', 'error');
      return;
    }

    const data = {
      user_id: user.user_id,
      besoins: besoins.map(besoin => ({
        quantité: besoin.quantité,
        designation: besoin.designation,
        observation: besoin.observation
      }))
    };

    try {
      await axios.post('http://localhost:8000/fiches_besoin/fiches_besoin/', data);

      Swal.fire('Succès', 'Fiche et besoins ajoutés avec succès!', 'success').then(() => {
        setBesoins([{ quantité: 1, designation: 0, observation: '' }]);
        window.location.reload();
      });
    } catch (error: any) {
      console.error('Erreur:', error.response?.data || error);
      Swal.fire('Erreur', 'Échec de l’enregistrement.', 'error');
    }
  };

  return (
    <div className="form-container" style={{ padding: '20px', position: 'relative' }}>
      <h2>Ajouter un besoin</h2>

      <button
        type="button"
        onClick={handleAddBesoin}
        style={{
          position: 'absolute',
          top: 10,
          right: 10,
          fontSize: '20px',
          padding: '5px 10px',
          cursor: 'pointer'
        }}
        title="Ajouter un besoin"
      >
        ➕
      </button>

      <form onSubmit={handleSubmit}>
        {besoins.map((besoin, index) => (
          <div key={index} className="besoin-group">
            <div className="form-group">
              <label>Quantité:</label>
              <input
                type="number"
                name="quantité"
                min="1"
                value={besoin.quantité}
                onChange={(e) => handleChange(index, e)}
                required
              />
            </div>

            <div className="form-group">
              <label>Désignation:</label>
              <select
                name="designation"
                value={besoin.designation}
                onChange={(e) => handleChange(index, e)}
                required
              >
                <option value="">-- Choisir --</option>
                {designations.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.nom}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Observation:</label>
              <input
                type="text"
                name="observation"
                value={besoin.observation}
                onChange={(e) => handleChange(index, e)}
              />
            </div>

            <button
              type="button"
              className="remove-btn"
              onClick={() => handleRemoveBesoin(index)}
              title="Supprimer ce besoin"
            >
              ❌
            </button>
          </div>
        ))}

        <button type="submit">Enregistrer</button>
      </form>

      {/* Styles CSS inline ou à déplacer dans un fichier CSS */}
      <style>{`
        .besoin-group {
          display: flex;
          align-items: flex-end;
          gap: 15px;
          margin-bottom: 15px;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 8px;
          position: relative;
          background: #f9f9f9;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .remove-btn {
          background: none;
          border: none;
          font-size: 20px;
          color: red;
          cursor: pointer;
          position: absolute;
          top: 8px;
          right: 8px;
        }

        form button[type="submit"] {
          margin-top: 20px;
          padding: 10px 20px;
          font-size: 16px;
        }
      `}</style>
    </div>
  );
};

export default FicheForm;
