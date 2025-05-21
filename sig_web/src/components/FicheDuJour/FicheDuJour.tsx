import React, { useContext, useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import AuthContext from '../../context/AuthContext';
import { getFichesByUser, deleteFicheById, downloadFichePdf, updateBesoin, deleteBesoin } from '../../services/ficheBesoinsService';
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
  const { user, authTokens } = useContext(AuthContext);

  useEffect(() => {
    const fetchFiches = async () => {
      if (!authTokens || !user) return;
      try {
        const allFiches = await getFichesByUser(authTokens.access, user.user_id);
        setFiches(allFiches);
      } catch {
        setError('Erreur lors du chargement des fiches.');
      }
    };
    fetchFiches();
  }, [authTokens, user]);

  const getStatutLabel = (status: string) => {
    const labels: Record<string, string> = {
      en_attente: 'En attente',
      acceptee: 'Acceptée',
      rejetee: 'Rejetée',
      historique: 'Historique',
    };
    return labels[status] || status;
  };

  const handleModifyBesoin = async (besoinId: number) => {
    const besoin = fiches.flatMap(f => f.besoins).find(b => b.id === besoinId);
    if (!besoin) return;

    const { value: formValues } = await Swal.fire({
      title: 'Modifier le besoin',
      html: `
        <input id="swal-quantite" class="swal2-input" placeholder="Quantité" value="${besoin.quantite}">
        <input id="swal-observation" class="swal2-input" placeholder="Observation" value="${besoin.observation}">
      `,
      focusConfirm: false,
      preConfirm: () => ({
        quantite: Number((document.getElementById('swal-quantite') as HTMLInputElement).value),
        observation: (document.getElementById('swal-observation') as HTMLInputElement).value,
      }),
    });

    if (formValues) {
      try {
        const updatedBesoin = { ...formValues, designation_id: besoin.designation.id };
        await updateBesoin(besoinId, updatedBesoin, authTokens?.access);
        Swal.fire('Modifié', 'Le besoin a été mis à jour.', 'success');

        setFiches(prev =>
          prev.map(f => ({
            ...f,
            besoins: f.besoins.map(b => (b.id === besoinId ? { ...b, ...formValues } : b)),
          }))
        );
      } catch {
        Swal.fire('Erreur', "La modification a échoué", 'error');
      }
    }
  };

  const handleDeleteBesoin = async (besoinId: number) => {
    const confirm = await Swal.fire({
      title: 'Supprimer ce besoin ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Annuler',
    });
    if (confirm.isConfirmed) {
      try {
        await deleteBesoin(besoinId, authTokens?.access);
        setFiches(prev =>
          prev.map(f => ({
            ...f,
            besoins: f.besoins.filter(b => b.id !== besoinId),
          }))
        );
        Swal.fire('Supprimé', 'Le besoin a été supprimé.', 'success');
      } catch {
        Swal.fire('Erreur', "La suppression a échoué", 'error');
      }
    }
  };

  const handleDeleteFiche = async (ficheId: number) => {
    const confirm = await Swal.fire({
      title: 'Supprimer cette fiche ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Annuler',
    });
    if (confirm.isConfirmed) {
      try {
        await deleteFicheById(ficheId, authTokens?.access);
        Swal.fire('Supprimée', 'La fiche a été supprimée.', 'success');
        setFiches(fiches.filter(f => f.id !== ficheId));
      } catch {
        Swal.fire('Erreur', "La suppression a échoué", 'error');
      }
    }
  };

  const showDetail = (fiche: Fiche) => {
    const html = fiche.besoins.map(b => `
      <tr>
        <td>${b.designation?.nom}</td>
        <td>${b.quantite}</td>
        <td>${b.observation}</td>
        <td>
          <button id="modify-${b.id}" class="action-btn"><i class="fas fa-pen-to-square"></i></button>
          <button id="delete-${b.id}" class="action-btn delete-btn"><i class="fas fa-trash-alt"></i></button>
        </td>
      </tr>
    `).join('');

    Swal.fire({
      title: `Fiche ${fiche.numero} - ${getStatutLabel(fiche.status)}`,
      html: `
        <p><strong>Date :</strong> ${fiche.date_fiche}</p>
        <p><strong>Utilisateur :</strong> ${fiche.user.first_name} ${fiche.user.last_name}</p>
        <table style="width:100%;"><thead>
        <tr><th>Désignation</th><th>Quantité</th><th>Observation</th><th>Actions</th></tr>
        </thead><tbody>${html}</tbody></table>
      `,
      width: '800px',
      showCloseButton: true,
      showConfirmButton: false,
      didOpen: () => {
        fiche.besoins.forEach(b => {
          document.getElementById(`modify-${b.id}`)?.addEventListener('click', () => handleModifyBesoin(b.id));
          document.getElementById(`delete-${b.id}`)?.addEventListener('click', () => handleDeleteBesoin(b.id));
        });
      }
    });
  };

  return (
    <div>
      <h2>Fiches de Besoins</h2>
      {error && <p className="error">{error}</p>}
      <table className="fiche-table">
        <thead>
          <tr>
            <th>Numéro</th>
            <th>Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {fiches.length ? fiches.map(fiche => (
            <tr key={fiche.id}>
              <td>{fiche.numero}</td>
              <td>{fiche.date_fiche}</td>
              <td>{getStatutLabel(fiche.status)}</td>
              <td>
                <div className="action-buttons">
                  <button onClick={() => showDetail(fiche)} className="action-btn view-btn"><i className="fas fa-eye"></i></button>
                  <button onClick={() => downloadFichePdf(fiche.id, authTokens?.access)} className="action-btn pdf-btn"><i className="fas fa-file-pdf"></i></button>
                  {user?.is_staff && (
                    <button onClick={() => handleDeleteFiche(fiche.id)} className="action-btn delete-btn"><i className="fas fa-trash-alt"></i></button>
                  )}
                </div>
              </td>
            </tr>
          )) : <tr><td colSpan={4}>Aucune fiche pour aujourd’hui.</td></tr>}
        </tbody>
      </table>
    </div>
  );
};

export default FicheDuJour;
