


// import React, { useState, ChangeEvent, FormEvent, useContext } from 'react';
// import axios from 'axios';
// import AuthContext from '../context/AuthContext';

// interface FicheBesoinsForm {
//   quantité: number | '';
//   designation: string;
//   observation: string;
// }

// const FicheForm: React.FC = () => {
//   const [formData, setFormData] = useState<FicheBesoinsForm>({
//     quantité: '',
//     designation: '',
//     observation: ''
//   });

//   const { user } = useContext(AuthContext); // Utilisation du AuthContext pour obtenir l'utilisateur connecté

//   const designations = ['Ordinateur', 'Imprimante', 'Bureau', 'Chaise', 'Scanner'];

//   const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: name === 'quantité' ? parseInt(value) || '' : value
//     }));
//   };

//   const handleSubmit = (e: FormEvent) => {
//     e.preventDefault();

//     if (!user) {
//       alert("Vous devez être connecté pour soumettre une fiche.");
//       return;
//     }

//     // Ajouter l'ID de l'utilisateur connecté aux données envoyées
//     const dataToSend = {
//       ...formData,
//       user: user.user_id  // ou user.id selon le token 
//     };

//     axios.post('http://localhost:8000/generatefiles/fichebesoin/', dataToSend)
//       .then(response => {
//         console.log('Ajouté  :', response.data);
//         alert('Fiche ajoutée !');
//         setFormData({ quantité: '', designation: '', observation: '' });
//       })
//       .catch(error => {
//         console.error('Erreur  :', error);
//         alert('Erreur lors de l’ajout !');
//       });
//   };

//   return (
//     <div className="form-container">
//       <h2>Ajouter une Fiche de Besoin</h2>
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
//             {designations.map((item, index) => (
//               <option key={index} value={item}>{item}</option>
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



import React, { useState, useEffect, ChangeEvent, FormEvent, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

interface FicheBesoinsForm {
  quantité: number | '';
  designation: string; // ID de la désignation
  observation: string;
}

interface Designation {
  id: number;
  nom: string;
}

const FicheForm: React.FC = () => {
  const [formData, setFormData] = useState<FicheBesoinsForm>({
    quantité: '',
    designation: '',
    observation: ''
  });

  const [designations, setDesignations] = useState<Designation[]>([]);

  const { user } = useContext(AuthContext);

  useEffect(() => {
    axios.get('http://localhost:8000/designation/')
      .then(res => setDesignations(res.data))
      .catch(err => console.error('Erreur de chargement des désignations :', err));
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantité' ? parseInt(value) || '' : value
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert("Vous devez être connecté pour soumettre une fiche.");
      return;
    }

    const dataToSend = {
      ...formData,
      user: user.user_id  // ou user.id selon ton token
    };

    axios.post('http://localhost:8000/generatefiles/fichebesoin/', dataToSend)
      .then(response => {
        alert('Fiche ajoutée !');
        setFormData({ quantité: '', designation: '', observation: '' });
      })
      .catch(error => {
        console.error('Erreur lors de l’envoi :', error);
        alert('Erreur lors de l’ajout !');
      });
  };

  return (
    <div className="form-container">
      <h2>Ajouter une Fiche de Besoin</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Quantité:</label>
          <input
            type="number"
            name="quantité"
            min="1"
            value={formData.quantité}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Désignation:</label>
          <select
            name="designation"
            value={formData.designation}
            onChange={handleChange}
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
            value={formData.observation}
            onChange={handleChange}
          />
        </div>

        <button type="submit">Enregistrer</button>
      </form>
    </div>
  );
};

export default FicheForm;
