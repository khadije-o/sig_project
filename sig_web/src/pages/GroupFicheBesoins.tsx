import { useEffect, useState, useContext } from 'react';
import Swal from 'sweetalert2';
import FicheTable from '../components/FicheGroup/FicheGroupTable';
import AuthContext from '../context/AuthContext';
import { createInvitation, deleteFiche, downloadFichePdf, getFiches, linkFicheToInvitation, updateFicheStatus } from '../services/ficheGroupService';
import { Fiche } from '../types/ficheGroupType';


const GroupFicheBesoins = () => {
  const [fiches, setFiches] = useState<Fiche[]>([]);
  const [selectedFiches, setSelectedFiches] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { authTokens, user } = useContext(AuthContext);

  useEffect(() => {
    const loadFiches = async () => {
      if (!authTokens || !user) return;
      try {
        const res = await getFiches(authTokens.access);
        const allFiches: Fiche[] = res.data;

        if (user.is_staff) {
          const adminOwn = allFiches.filter(f =>
            f.user.id === user.user_id && f.status === 'En attente'
          );
          const others = allFiches.filter(f =>
            !f.user.is_staff && f.status === 'En attente'
          );
          setFiches([...adminOwn, ...others]);
        } else {
          setFiches(allFiches.filter(f =>
            f.user.id === user.user_id && f.status === 'En attente'
          ));
        }
      } catch {
        setError('Erreur lors du chargement des fiches.');
      }
    };

    loadFiches();
  }, [authTokens, user]);

  const toggleSelectFiche = (ficheId: number) => {
    setSelectedFiches(prev =>
      prev.includes(ficheId)
        ? prev.filter(id => id !== ficheId)
        : [...prev, ficheId]
    );
  };

  const handleDeleteFiche = async (ficheId: number) => {
    const confirm = await Swal.fire({
      title: 'Supprimer cette fiche ?',
      text: 'Cette action est irréversible.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui',
    });

    if (confirm.isConfirmed && authTokens) {
      await deleteFiche(ficheId, authTokens.access);
      Swal.fire('Supprimée', 'La fiche a été supprimée.', 'success');
      window.location.reload();
    }
  };

  const handleDownloadPdf = async (ficheId: number) => {
    if (!authTokens) return;
    const response = await downloadFichePdf(ficheId, authTokens.access);
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `fiche_besoin_${ficheId}.pdf`);
    document.body.appendChild(link);
    link.click();
  };

  const handleShowDetail = (fiche: Fiche) => {
    const besoinsHtml = fiche.besoins.map(b => `
      <tr>
        <td>${b.designation?.nom || ''}</td>
        <td>${b.quantite}</td>
        <td>${b.observation}</td>
      </tr>
    `).join('');

    Swal.fire({
      title: `Fiche ${fiche.numero}`,
      html: `
        <p><strong>Date :</strong> ${fiche.date_fiche}</p>
        <p><strong>Utilisateur :</strong> ${fiche.user.first_name} ${fiche.user.last_name}</p>
        <table border="1" cellpadding="6" style="width:100%;">
          <thead><tr><th>Désignation</th><th>Quantité</th><th>Observation</th></tr></thead>
          <tbody>${besoinsHtml}</tbody>
        </table>
      `,
      width: '700px',
      showCloseButton: true,
      showConfirmButton: false,
    });
  };

  const handleCreateInvitation = async () => {
    if (selectedFiches.length === 0) {
      return Swal.fire('Erreur', 'Aucune fiche sélectionnée', 'error');
    }

    const { value: formValues } = await Swal.fire({
      title: 'Créer une invitation',
      html: `
        <input id="valeur" class="swal2-input" placeholder="Valeur offre">
        <input id="delai" class="swal2-input" placeholder="Délai (jours)">
      `,
      preConfirm: () => {
        const valeur = parseInt((document.getElementById('valeur') as HTMLInputElement).value);
        const delai = parseInt((document.getElementById('delai') as HTMLInputElement).value);
        if (isNaN(valeur) || isNaN(delai)) {
          Swal.showValidationMessage('Champs invalides');
          return;
        }
        return { valeur, delai };
      },
      showCancelButton: true,
    });

    if (formValues && user?.is_staff && authTokens) {
      const res = await createInvitation({
        val_offre: formValues.valeur,
        delai_offre: formValues.delai,
        admin: user.user_id,
      }, authTokens.access);

      const invitationId = res.data.id;

      const updateResults = await Promise.all(
        selectedFiches.map(async ficheId => {
          await linkFicheToInvitation(invitationId, ficheId, authTokens.access);
          return updateFicheStatus(ficheId, 'Acceptée', authTokens.access);
        })
      );

      const allSuccess = updateResults.every(r => r);
      Swal.fire(
        allSuccess ? 'Succès' : 'Avertissement',
        allSuccess ? 'Invitation créée avec succès.' : 'Des fiches n\'ont pas été mises à jour.',
        allSuccess ? 'success' : 'warning'
      );

      setSelectedFiches([]);
      window.location.reload();
    }
  };

  return (
    <div className="fiche-group-page">
      <h2>Ensemble des Fiches de Besoins</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <FicheTable
        fiches={fiches}
        label={user?.is_staff ? '' : 'Mes fiches'}
        isStaff={user?.is_staff || false}
        selectedFiches={selectedFiches}
        onToggleSelect={toggleSelectFiche}
        onDelete={handleDeleteFiche}
        onDownloadPdf={handleDownloadPdf}
        onShowDetail={handleShowDetail}
        onCreateInvitation={handleCreateInvitation}
      />
    </div>
  );
};

export default GroupFicheBesoins;
