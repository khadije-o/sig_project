import React, { useContext, useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { downloadInvitationPDF, getFicheDetails, getInvitationFicheAssociations, getInvitationsByAdmin } from '../../services/invitationService';
import AuthContext from '../../context/AuthContext';
import { Fiche, Invitation, InvitationFiche } from '../../types/ficheTypes';


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
        const invitationsRes = await getInvitationsByAdmin(authTokens.access);
        setInvitations(invitationsRes.data);

        const invitationFichesRes = await getInvitationFicheAssociations(authTokens.access);

        const fichesDetails = await Promise.all(
          invitationFichesRes.data.map(async (item: any) => {
            const ficheRes = await getFicheDetails(authTokens.access, item.fiche_besoin);
            return {
              ...item,
              fiche_besoin: ficheRes.data,
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
          <td>${besoin.observation || ''}</td>
        </tr>
      `)
      .join('');

    Swal.fire({
      title: `Fiche ${fiche.numero} - ${getStatutLabel(fiche.status)}`,
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

  const handleDownloadPdf = async (invitationId: number) => {
    try {
      const response = await downloadInvitationPDF(authTokens!.access, invitationId);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invitation_${invitationId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
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
          position: 'relative',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '15px',
          }}>
            <h3 style={{ color: '#2c3e50', borderBottom: '2px solid #3498db', paddingBottom: '10px' }}>
              Invitation {invitation.id}
            </h3>
            <button
              onClick={() => handleDownloadPdf(invitation.id)}
              style={{
                padding: '8px 15px',
                backgroundColor: '#e74c3c',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <i className="fas fa-file-pdf"></i>
              Exporter PDF
            </button>
          </div>

          <div style={{ display: 'flex', gap: '20px', marginBottom: '15px' }}>
            <div><strong>Délai:</strong> {invitation.delai_offre} Jour(s) ouvrable(s)</div>
            <div><strong>Valeur de l'offre:</strong> {invitation.val_offre}</div>
            <div><strong>Créée le:</strong> {new Date(invitation.created_at).toLocaleDateString()}</div>
          </div>

          {fiches.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
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
                            cursor: 'pointer',
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
      <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>Consolidation des Fiches de besoins</h2>
      {renderInvitationTables()}
    </div>
  );
};

export default Consolidation;
