// import React, { useContext, useEffect, useState } from 'react';
// import axios from 'axios';
// import Swal from 'sweetalert2';
// import AuthContext from '../../../context/AuthContext';
// import "../../../css/FicheGroup.css";

// interface Designation {
//   id: number;
//   nom: string;
// }

// interface Besoin {
//   id: number;
//   quantite: number;
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
//   besoins: Besoin[];
// }

// interface Invitation {
//   id: number;
//   val_offre: number;
//   delai_offre: number;
//   admin: User;
//   created_at: string;
//   fiches: Fiche[];
// }

// const Consolidation: React.FC = () => {
//   const [invitations, setInvitations] = useState<Invitation[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const { user, authTokens } = useContext(AuthContext);

//   useEffect(() => {
//     const fetchInvitations = async () => {
//       if (!authTokens || !user || !user.is_staff) return;

//       try {
//         // Récupérer les invitations créées par l'admin connecté
//         const invitationsRes = await axios.get('http://localhost:8000/invitations_offre/invitations_offre/', {
//           headers: {
//             Authorization: `Bearer ${authTokens.access}`,
//           },
//           params: {
//             admin: user.user_id
//           }
//         });

//         // Pour chaque invitation, récupérer les fiches associées
//         const invitationsWithFiches = await Promise.all(
//           invitationsRes.data.map(async (invitation: any) => {
//             const fichesRes = await axios.get(`http://localhost:8000/invitation_fiche_besoin/invitation_fiche_besoin/?invitation=${invitation.id}`, {
//               headers: {
//                 Authorization: `Bearer ${authTokens.access}`,
//               },
//             });

//             // Récupérer les détails complets des fiches
//             const fiches = await Promise.all(
//               fichesRes.data.map(async (item: any) => {
//                 const ficheRes = await axios.get(`http://localhost:8000/fiches_besoin/fiches_besoin/${item.fiche_besoin}/`, {
//                   headers: {
//                     Authorization: `Bearer ${authTokens.access}`,
//                   },
//                 });
//                 return ficheRes.data;
//               })
//             );

//             return {
//               ...invitation,
//               fiches: fiches
//             };
//           })
//         );

//         setInvitations(invitationsWithFiches);
//       } catch (err) {
//         console.error(err);
//         setError('Erreur lors du chargement des invitations.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchInvitations();
//   }, [authTokens, user]);

//   const getStatutLabel = (status: string) => {
//     const statuts: Record<string, string> = {
//       en_attente: 'En attente',
//       acceptee: 'Acceptée',
//       rejetee: 'Rejetée',
//       historique: 'Historique',
//     };
//     return statuts[status] || status;
//   };

//   const showDetail = (fiche: Fiche) => {
//     const besoinsHtml = fiche.besoins
//       .map((besoin) => `
//         <tr>
//           <td>${besoin.designation?.nom || 'N/A'}</td>
//           <td>${besoin.quantite || 'N/A'}</td> 
//           <td>${besoin.observation || 'Aucune observation'}</td>
//         </tr>
//       `)
//       .join('');

//     Swal.fire({
//       title: `Fiche #${fiche.numero} - ${getStatutLabel(fiche.status)}`,
//       html: `
//         <p><strong>Date de création :</strong> ${fiche.date_fiche}</p>
//         <p><strong>Utilisateur :</strong> ${fiche.user.first_name} ${fiche.user.last_name}</p>
//         <table border="1" cellpadding="6" cellspacing="0" style="width:100%; text-align:left;">
//           <thead>
//             <tr>
//               <th>Désignation</th>
//               <th>Quantité</th>
//               <th>Observation</th>
//             </tr>
//           </thead>
//           <tbody>${besoinsHtml}</tbody>
//         </table>
//       `,
//       width: '800px',
//       showCloseButton: true,
//       showConfirmButton: false,
//     });
//   };

//   const downloadPdf = async (ficheId: number) => {
//     try {
//       const response = await axios.get(`http://localhost:8000/fiches_besoin/fiches_besoin/pdf_fiche/${ficheId}/`, {
//         headers: {
//           Authorization: `Bearer ${authTokens?.access}`,
//         },
//         responseType: 'blob',
//       });

//       const url = window.URL.createObjectURL(new Blob([response.data]));
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute('download', `fiche_besoin_${ficheId}.pdf`);
//       document.body.appendChild(link);
//       link.click();
//     } catch (err) {
//       Swal.fire('Erreur', 'Impossible de télécharger le PDF', 'error');
//     }
//   };

//   const renderInvitationTables = () => {
//     if (loading) return <p>Chargement en cours...</p>;
//     if (error) return <p style={{ color: 'red' }}>{error}</p>;
//     if (invitations.length === 0) return <p>Aucune invitation trouvée.</p>;

//     return invitations.map((invitation) => (
//       <div key={invitation.id} style={{ marginBottom: '40px', border: '1px solid #ddd', padding: '20px', borderRadius: '5px' }}>
//         <h3>Invitation #{invitation.id}</h3>
//         <p><strong>Valeur de l'offre:</strong> {invitation.val_offre} DA</p>
//         <p><strong>Délai de l'offre:</strong> {invitation.delai_offre} jours</p>
//         <p><strong>Créée le:</strong> {new Date(invitation.created_at).toLocaleString()}</p>
//         <p><strong>Créée par:</strong> {invitation.admin.first_name} {invitation.admin.last_name}</p>

//         <h4>Fiches associées ({invitation.fiches.length})</h4>
//         {invitation.fiches.length > 0 ? (
//           <table border={1} cellPadding={10} style={{ width: '100%', marginTop: '15px' }}>
//             <thead>
//               <tr>
//                 <th>Numéro</th>
//                 <th>Date</th>
//                 <th>Utilisateur</th>
//                 <th>Status</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {invitation.fiches.map((fiche) => (
//                 <tr key={fiche.id}>
//                   <td>{fiche.numero}</td>
//                   <td>{fiche.date_fiche}</td>
//                   <td>{fiche.user.first_name} {fiche.user.last_name}</td>
//                   <td>{getStatutLabel(fiche.status)}</td>
//                   <td>
//                     <button onClick={() => showDetail(fiche)} title="Détails">
//                       <i className="fas fa-eye"></i>
//                     </button>
//                     <button onClick={() => downloadPdf(fiche.id)} title="Télécharger PDF">
//                       <i className="fas fa-file-pdf" style={{ color: 'white' }}></i>
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         ) : (
//           <p>Aucune fiche associée à cette invitation.</p>
//         )}
//       </div>
//     ));
//   };

//   return (
//     <div>
//       <h2>Consolidation des Invitations</h2>
//       <p>Liste des invitations créées avec leurs fiches associées</p>
//       {renderInvitationTables()}
//     </div>
//   );
// };

// export default Consolidation;




import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import AuthContext from '../../../context/AuthContext';
import "../../../css/FicheGroup.css";

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

interface Invitation {
  id: number;
  val_offre: number;
  delai_offre: number;
  admin: User;
  created_at: string;
}

interface InvitationFiche {
  id: number;
  invitation: number;
  fiche_besoin: Fiche;
}

const Consolidation: React.FC = () => {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [invitationFiches, setInvitationFiches] = useState<InvitationFiche[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user, authTokens } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      if (!authTokens || !user || !user.is_staff) return;

      try {
        // 1. Récupérer les invitations de l'admin
        const invitationsRes = await axios.get('http://localhost:8000/invitations_offre/invitations_offre/', {
          headers: { Authorization: `Bearer ${authTokens.access}` },
          params: { admin: user.user_id }
        });

        setInvitations(invitationsRes.data);

        // 2. Récupérer toutes les associations invitation-fiche
        const invitationFichesRes = await axios.get('http://localhost:8000/invitation_fiche_besoin/invitation_fiche_besoin/', {
          headers: { Authorization: `Bearer ${authTokens.access}` },
        });

        // 3. Pour chaque association, récupérer les détails complets de la fiche
        const fichesDetails = await Promise.all(
          invitationFichesRes.data.map(async (item: any) => {
            const ficheRes = await axios.get(`http://localhost:8000/fiches_besoin/fiches_besoin/${item.fiche_besoin}/`, {
              headers: { Authorization: `Bearer ${authTokens.access}` },
            });
            return {
              ...item,
              fiche_besoin: ficheRes.data
            };
          })
        );

        setInvitationFiches(fichesDetails);
      } catch (err) {
        console.error(err);
        setError('Erreur lors du chargement des données.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [authTokens, user]);

  const getStatutLabel = (status: string) => {
    const statuts: Record<string, string> = {
      en_attente: 'En attente',
      acceptee: 'Acceptée',
      rejetee: 'Rejetée',
      historique: 'Historique',
    };
    return statuts[status] || status;
  };

  const getFichesForInvitation = (invitationId: number) => {
    return invitationFiches
      .filter(item => item.invitation === invitationId)
      .map(item => item.fiche_besoin);
  };

  const showDetail = (fiche: Fiche) => {
    const besoinsHtml = fiche.besoins
      .map((besoin) => `
        <tr>
          <td>${besoin.designation?.nom || 'N/A'}</td>
          <td>${besoin.quantite || 'N/A'}</td> 
          <td>${besoin.observation || 'Aucune observation'}</td>
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
            </tr>
          </thead>
          <tbody>${besoinsHtml}</tbody>
        </table>
      `,
      width: '800px',
      showCloseButton: true,
      showConfirmButton: false,
    });
  };

  const downloadInvitationPdf = async (invitationId: number) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/invitation_fiche_besoin/invitation_fiche_besoin/pdf_invitation/${invitationId}/`,
        {
          headers: { Authorization: `Bearer ${authTokens?.access}` },
          responseType: 'blob',
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invitation_${invitationId}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      console.error(err);
      Swal.fire('Erreur', 'Impossible de télécharger le PDF de l\'invitation', 'error');
    }
  };

  const renderInvitationTables = () => {
    if (loading) return <p>Chargement en cours...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    if (invitations.length === 0) return <p>Aucune invitation trouvée.</p>;

    return invitations.map((invitation) => {
      const fiches = getFichesForInvitation(invitation.id);
      
      return (
        <div key={invitation.id} style={{ 
          marginBottom: '40px', 
          border: '1px solid #ddd', 
          padding: '20px', 
          borderRadius: '5px',
          backgroundColor: '#f9f9f9',
          position: 'relative' // Ajouté pour positionner le bouton
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '15px'
          }}>
            <h3 style={{ color: '#2c3e50', borderBottom: '2px solid #3498db', paddingBottom: '10px' }}>
              Invitation #{invitation.id}
            </h3>
            <button 
              onClick={() => downloadInvitationPdf(invitation.id)}
              style={{
                padding: '8px 15px',
                backgroundColor: '#e74c3c',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <i className="fas fa-file-pdf"></i>
              Exporter PDF
            </button>
          </div>

          <div style={{ display: 'flex', gap: '20px', marginBottom: '15px' }}>
             <div>
              <strong>Délai:</strong> {invitation.delai_offre} Jour ouvrable
            </div>
            <div>
              <strong>Valeur de l'offre:</strong> {invitation.val_offre} Jours
            </div>
           
            <div>
              <strong>Créée le:</strong> {new Date(invitation.created_at).toLocaleDateString()}

            </div>
          </div>

          <h4 style={{ margin: '20px 0 10px 0' }}>
            Fiches associées ({fiches.length})
          </h4>
          
          {fiches.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ 
                width: '100%', 
                borderCollapse: 'collapse',
                marginTop: '10px'
              }}>
                <thead>
                  <tr style={{ backgroundColor: '#3498db', color: 'white' }}>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Numéro</th>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Date</th>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Utilisateur</th>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Statut</th>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {fiches.map((fiche) => (
                    <tr key={fiche.id} style={{ borderBottom: '1px solid #ddd' }}>
                      <td style={{ padding: '10px' }}>{fiche.numero}</td>
                      <td style={{ padding: '10px' }}>{fiche.date_fiche}</td>
                      <td style={{ padding: '10px' }}>{fiche.user.first_name} {fiche.user.last_name}</td>
                      <td style={{ padding: '10px' }}>{getStatutLabel(fiche.status)}</td>
                      <td style={{ padding: '10px' }}>
                        <button 
                          onClick={() => showDetail(fiche)} 
                          style={{ 
                            marginRight: '5px',
                            padding: '5px 10px',
                            backgroundColor: '#3498db',
                            color: 'white',
                            border: 'none',
                            borderRadius: '3px',
                            cursor: 'pointer'
                          }}
                        >
                          Détails
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p style={{ color: '#7f8c8d', fontStyle: 'italic' }}>
              Aucune fiche associée à cette invitation.
            </p>
          )}
        </div>
      );
    });
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>Consolidation des Invitations</h2>
      <p style={{ marginBottom: '30px' }}>Liste des invitations créées avec leurs fiches associées</p>
      {renderInvitationTables()}
    </div>
  );
};

export default Consolidation;