// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import Swal from 'sweetalert2';

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
//   user: User;
//   statut: string;
// }

// const FicheDuJour: React.FC = () => {
//   const [fiches, setFiches] = useState<Fiche[]>([]);
//   const [error, setError] = useState<string | null>(null);
//   const [today, setToday] = useState<string>('');

//   useEffect(() => {
//     const fetchData = async () => {
//       const tokens = localStorage.getItem("authTokens");
//       const auth = tokens ? JSON.parse(tokens) : null;

//       try {
//         const ficheRes = await axios.get('http://localhost:8000/fiches_besoin/fiches_besoin/', {
//           headers: {
//             Authorization: `Bearer ${auth?.access}`
//           }
//         });

//         setFiches(ficheRes.data);
//         setToday(new Date().toLocaleDateString('fr-FR'));
//       } catch (err) {
//         console.error(err);
//         setError('Erreur lors du chargement des fiches.');
//       }
//     };

//     fetchData();
//   }, []);

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
//         <strong>Désignation ID:</strong> ${fiche.designation}<br />
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

//       {error && <p style={{ color: 'red' }}>{error}</p>}

//       <table>
//         <thead>
//           <tr>
//             <th>Numéro de Fiche</th>
//             <th>Date de Création</th>
//             <th>Statut</th>
//             <th>Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           {fiches.length > 0 ? (
//             fiches.map(fiche => (
//               <tr key={fiche.id}>
//                 <td>{fiche.id}</td>
//                 <td>{fiche.date_creation}</td>
//                 <td>{getStatutLabel(fiche.statut)}</td>
//                 <td>
//                   <button onClick={() => showDetail(fiche)}>
//                     Voir fiche besoin n°{fiche.id}
//                   </button>
//                 </td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan={4}>Aucune fiche pour aujourd'hui.</td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default FicheDuJour;



// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import Swal from 'sweetalert2';

// interface Designation {
//   id: number;
//   nom: string;
// }

// interface Besoin {
//   id: number;
//   quantité: number;
//   observation: string;
//   designation: Designation;
// }

// interface User {
//   id: number;
//   first_name: string;
//   last_name: string;
// }

// interface Fiche {
//   id: number;
//   numero: number;
//   date_fiche: string;
//   status: string;
//   user: User;
//   besoin: Besoin;
// }

// const FicheDuJour: React.FC = () => {
//   const [fiches, setFiches] = useState<Fiche[]>([]);
//   const [error, setError] = useState<string | null>(null);
//   const [today, setToday] = useState<string>('');

//   useEffect(() => {
//     const fetchData = async () => {
//       const tokens = localStorage.getItem("authTokens");
//       const auth = tokens ? JSON.parse(tokens) : null;

//       try {
//         const res = await axios.get('http://localhost:8000/fiches_besoin/fiches_besoin/', {
//           headers: {
//             Authorization: `Bearer ${auth?.access}`
//           }
//         });

//         setFiches(res.data);
//         setToday(new Date().toLocaleDateString('fr-FR'));
//       } catch (err) {
//         console.error(err);
//         setError('Erreur lors du chargement des fiches.');
//       }
//     };

//     fetchData();
//   }, []);

//   const getStatutLabel = (status: string) => {
//     const statuts: Record<string, string> = {
//       'en_attente': 'En attente',
//       'acceptee': 'Acceptée',
//       'rejetee': 'Rejetée',
//       'historique': 'Historique'
//     };
//     return statuts[status] || status;
//   };

//   const showDetail = (fiche: Fiche) => {
//     Swal.fire({
//       title: `Détails de la fiche #${fiche.id}`,
//       html: `
//         <strong>Quantité:</strong> ${fiche.besoin.quantité}<br />
//         <strong>Désignation:</strong> ${fiche.besoin.designation.nom}<br />
//         <strong>Observation:</strong> ${fiche.besoin.observation}<br />
//         <strong>Date de création:</strong> ${fiche.date_fiche}<br />
//         <strong>Utilisateur:</strong> ${fiche.user.first_name} ${fiche.user.last_name}<br />
//         <strong>Statut:</strong> ${getStatutLabel(fiche.status)}<br />
//       `,
//       icon: 'info'
//     });
//   };

//   return (
//     <div>
//       <h2>Fiches de Besoin du {today}</h2>

//       {error && <p style={{ color: 'red' }}>{error}</p>}

//       <table border={1} cellPadding={10}>
//         <thead>
//           <tr>
//             <th>Numéro de Fiche</th>
//             <th>Date de Création</th>
//             <th>Status</th>
//             <th>Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           {fiches.length > 0 ? (
//             fiches.map(fiche => (
//               <tr key={fiche.id}>
//                 <td>{fiche.numero}</td>
//                 <td>{fiche.date_fiche}</td>
//                 <td>{getStatutLabel(fiche.status)}</td>
//                 <td>
//                   <button onClick={() => showDetail(fiche)}>
//                     Voir besoin {fiche.id}
//                   </button>
//                 </td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan={4}>Aucune fiche pour aujourd'hui.</td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default FicheDuJour;



import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

interface Designation {
  id: number;
  nom: string;
}

interface Besoin {
  id: number;
  quantite: number;
  observation: string;
  designation: Designation;
}

interface User {
  id: number;
  first_name: string;
  last_name: string;
}

interface Fiche {
  id: number;
  numero: number;
  date_fiche: string;
  status: string;
  user: User;
  besoins: Besoin[]; 
}

const FicheDuJour: React.FC = () => {
  const [fiches, setFiches] = useState<Fiche[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [today, setToday] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      const tokens = localStorage.getItem('authTokens');
      const auth = tokens ? JSON.parse(tokens) : null;
    
      try {
        const res = await axios.get('http://localhost:8000/fiches_besoin/fiches_besoin/', {
          headers: {
            Authorization: `Bearer ${auth?.access}`,
          },
        });
    
        console.log(res.data); // Vérifiez ce qui est retourné par l'API
        setFiches(res.data);
        console.log(fiches);
        setToday(new Date().toLocaleDateString('fr-FR'));
      } catch (err) {
        console.error(err);
        setError('Erreur lors du chargement des fiches.');
      }
    };
    

    fetchData();
  }, []);

  const getStatutLabel = (status: string) => {
    const statuts: Record<string, string> = {
      en_attente: 'En attente',
      acceptee: 'Acceptée',
      rejetee: 'Rejetée',
      historique: 'Historique',
    };
    return statuts[status] || status;
  };

  const handleModifyBesoin = (besoinId: number) => {
    alert(`Modifier le besoin ID ${besoinId}`);
    // Logique pour modifier le besoin
  };

  const handleDeleteBesoin = (besoinId: number) => {
    alert(`Supprimer le besoin ID ${besoinId}`);
    // Logique pour supprimer le besoin
  };

  const showDetail = (fiche: Fiche) => {
    const besoinsHtml = fiche.besoins
      .map((besoin) => `
        <tr>
          <td>${besoin.designation|| 'N/A'}</td>
          <td>${besoin.quantite || 'N/A'}</td> 
          <td>${besoin.observation || 'Aucune observation'}</td>
          <td>
            <button id="modify-${besoin.id}">✏️</button>
            <button id="delete-${besoin.id}">🗑️</button>
          </td>
        </tr>
      `)
      .join('');
  
    Swal.fire({
      title: `Fiche #${fiche.numero} - ${getStatutLabel(fiche.status)}`,
      html: `
        <p><strong>Date de création :</strong> ${fiche.date_fiche}</p>
        <p><strong>Utilisateur :</strong> ${fiche.user.first_name} ${fiche.user.last_name}</p>
        <table border="1" cellpadding="6" cellspacing="0" style="width:100%; text-align:left;">
          <thead>
            <tr>
              <th>Désignation</th>
              <th>Quantité</th>
              <th>Observation</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${besoinsHtml}
          </tbody>
        </table>
      `,
      width: '800px',
      showCloseButton: true,
      showConfirmButton: false,
    });
  
    // Attacher des événements
    fiche.besoins.forEach((besoin) => {
      document.getElementById(`modify-${besoin.id}`)?.addEventListener('click', () => handleModifyBesoin(besoin.id));
      document.getElementById(`delete-${besoin.id}`)?.addEventListener('click', () => handleDeleteBesoin(besoin.id));
    });
  };

  return (
    <div>
      <h2>Fiches de Besoin du {today}</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <table border={1} cellPadding={10}>
        <thead>
          <tr>
            <th>Numéro de Fiche</th>
            <th>Date de Création</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {fiches.length > 0 ? (
            fiches.map((fiche) => (
              <tr key={fiche.id}>
                <td>{fiche.numero}</td>
                <td>{fiche.date_fiche}</td>
                <td>{getStatutLabel(fiche.status)}</td>
                <td>
                  <button onClick={() => showDetail(fiche)}>Voir besoin {fiche.id}</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4}>Aucune fiche pour aujourd'hui.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default FicheDuJour;
