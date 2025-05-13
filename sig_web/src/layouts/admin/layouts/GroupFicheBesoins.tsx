




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

const FicheGroup: React.FC = () => {
  const [fiches, setFiches] = useState<Fiche[]>([]);
  const [selectedFiches, setSelectedFiches] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { user, authTokens } = useContext(AuthContext);

  const getStatutLabel = (status: string) => {
    const statuts: Record<string, string> = {
      en_attente: 'En attente',
      acceptee: 'Acceptée',
      rejetee: 'Rejetée',
      historique: 'Historique',
    };
    return statuts[status] || status;
  };

  useEffect(() => {
    const fetchFiches = async () => {
      if (!authTokens || !user) return;

      try {
        const res = await axios.get('http://localhost:8000/fiches_besoin/fiches_besoin/', {
          headers: {
            Authorization: `Bearer ${authTokens.access}`,
          },
        });

        const allFiches: Fiche[] = res.data;

        if (user.is_staff) {
          // Pour les admins, on montre toutes les fiches en attente
          const pendingFiches = allFiches.filter(fiche => fiche.status === 'En attente');
          setFiches(pendingFiches);
        } else {
          // Pour les non-admins, on montre seulement leurs fiches
          const userFiches = allFiches.filter(fiche => fiche.user.id === user.user_id);
          setFiches(userFiches);
        }
      } catch (err) {
        console.error(err);
        setError('Erreur lors du chargement des fiches.');
      }
    };

    fetchFiches();
  }, [authTokens, user]);

  const toggleSelectFiche = (ficheId: number) => {
    setSelectedFiches((prev) =>
      prev.includes(ficheId) ? prev.filter(id => id !== ficheId) : [...prev, ficheId]
    );
  };

  const updateFicheStatus = async (ficheId: number, newStatus: string) => {
    try {
      await axios.patch(
        `http://localhost:8000/fiches_besoin/fiches_besoin/${ficheId}/`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${authTokens?.access}` },
        }
      );
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const handleCreateInvitation = async () => {
    if (selectedFiches.length === 0) {
      Swal.fire('Erreur', 'Veuillez sélectionner au moins une fiche', 'error');
      return;
    }

    const { value: formValues } = await Swal.fire({
      title: 'Créer une invitation',
      html:
        '<input id="swal-valeur" class="swal2-input" placeholder="Valeur offre (en DA)">' +
        '<input id="swal-delai" class="swal2-input" placeholder="Délai (en jours)">',
      focusConfirm: false,
      preConfirm: () => {
        const valeur = parseInt((document.getElementById('swal-valeur') as HTMLInputElement).value);
        const delai = parseInt((document.getElementById('swal-delai') as HTMLInputElement).value);
        if (isNaN(valeur) || isNaN(delai)) {
          Swal.showValidationMessage('Veuillez entrer des valeurs valides.');
          return;
        }
        return { valeur, delai };
      }
    });

    if (formValues && user?.is_staff) {
      try {
        // Création de l'invitation
        const invitationRes = await axios.post(
          'http://localhost:8000/invitations_offre/invitations_offre/',
          {
            val_offre: formValues.valeur,
            delai_offre: formValues.delai,
            admin: user.user_id,
          },
          {
            headers: { Authorization: `Bearer ${authTokens?.access}` },
          }
        );

        const invitationId = invitationRes.data.id;

        // Lier les fiches à l'invitation et mettre à jour leur statut
        const updatePromises = selectedFiches.map(async (ficheId) => {
          // Lier la fiche à l'invitation
          await axios.post(
            'http://localhost:8000/invitation_fiche_besoin/invitation_fiche_besoin/',
            {
              invitation: invitationId,
              fiche_besoin: ficheId,
            },
            {
              headers: { Authorization: `Bearer ${authTokens?.access}` },
            }
          );
          
          // Mettre à jour le statut de la fiche
          return updateFicheStatus(ficheId, 'Acceptée');
        });

        // Attendre que toutes les mises à jour soient terminées
        const results = await Promise.all(updatePromises);
        const allSuccess = results.every(result => result);

        if (allSuccess) {
          Swal.fire('Succès', 'Invitation créée et fiches mises à jour avec succès.', 'success');
          setSelectedFiches([]);
          // Recharger les fiches
          window.location.reload();
        } else {
          Swal.fire('Avertissement', 'Invitation créée mais certaines fiches n\'ont pas pu être mises à jour.', 'warning');
        }
      } catch (err) {
        console.error(err);
        Swal.fire('Erreur', 'Échec de la création de l\'invitation.', 'error');
      }
    }
  };

  const handleDeleteFiche = async (ficheId: number) => {
    const confirm = await Swal.fire({
      title: 'Supprimer cette fiche ?',
      text: 'Cette action est irréversible.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler',
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`http://localhost:8000/fiches_besoin/fiches_besoin/${ficheId}/`, {
          headers: {
            Authorization: `Bearer ${authTokens?.access}`,
          },
        });

        Swal.fire('Supprimée', 'La fiche a été supprimée.', 'success');
        window.location.reload();
      } catch (error) {
        console.error(error);
        Swal.fire('Erreur', "La suppression a échoué", 'error');
      }
    }
  };

  const downloadPdf = async (ficheId: number) => {
    try {
      const response = await axios.get(`http://localhost:8000/fiches_besoin/fiches_besoin/pdf_fiche/${ficheId}/`, {
        headers: {
          Authorization: `Bearer ${authTokens?.access}`,
        },
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `fiche_besoin_${ficheId}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      Swal.fire('Erreur', 'Impossible de télécharger le PDF', 'error');
    }
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

  const renderFicheTable = (fiches: Fiche[], label: string) => (
    <>
      <h3>{label}</h3>
      {fiches.length > 0 ? (
        <>
          <table border={1} cellPadding={10} style={{ marginBottom: '20px' }}>
            <thead>
              <tr>
                
                <th>Numéro</th>
                <th>Date</th>
                <th>Utilisateur</th>
                <th>Status</th>
                <th>Actions</th>
                {user?.is_staff && <th>Sélection</th>}
              </tr>
            </thead>
            <tbody>
              {fiches.map((fiche) => (
                <tr key={fiche.id}>
                  
                  <td>{fiche.numero}</td>
                  <td>{fiche.date_fiche}</td>
                  <td>{fiche.user.first_name} {fiche.user.last_name}</td>
                  <td>{getStatutLabel(fiche.status)}</td>
                  <td>
                  <div className="action-buttons">
                    <button className="action-btn view-btn" onClick={() => showDetail(fiche)} title="Détails">
                      <i className="fas fa-eye"></i>
                    </button>
                    <button className="action-btn pdf-btn" onClick={() => downloadPdf(fiche.id)} title="Télécharger PDF">
                      <i className="fas fa-file-pdf"></i>
                    </button>
                    {user?.is_staff && (
                      <button className="action-btn delete-btn" onClick={() => handleDeleteFiche(fiche.id)} title="Supprimer fiche">
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    )}
                  </div>
                  
                </td>
                {user?.is_staff && (
                    <td>
                      <input 
                        type="checkbox" 
                        checked={selectedFiches.includes(fiche.id)}
                        onChange={() => toggleSelectFiche(fiche.id)}
                      />
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          {user?.is_staff && selectedFiches.length > 0 && (
           <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
  <button
    style={{ 
      marginTop: '10px', 
      padding: '10px 20px',
      backgroundColor: '#0B60B0',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer'
    }}
    onClick={handleCreateInvitation}
  >
    Créer une invitation
  </button>
</div>
          )}
        </>
      ) : (
        <p>Aucune fiche trouvée.</p>
      )}
    </>
  );

  return (
    <div>
      <h2>Ensemble des Fiches de Besoins</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {renderFicheTable(fiches, user?.is_staff ? '' : 'Mes fiches')}
    </div>
  );
};

export default FicheGroup;