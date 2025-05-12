






import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import AuthContext from '../context/AuthContext'; 

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

  const { user, authTokens } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      if (!authTokens || !user) return;

      try {
        const res = await axios.get('http://localhost:8000/fiches_besoin/fiches_besoin/', {
          headers: {
            Authorization: `Bearer ${authTokens.access}`,
          },
        });

        const allFiches: Fiche[] = res.data;
        const userFiches = allFiches.filter((fiche) => fiche.user.id === user.user_id); // user_id du JWT

        setFiches(userFiches);
        setToday(new Date().toLocaleDateString('fr-FR'));
      } catch (err) {
        console.error(err);
        setError('Erreur lors du chargement des fiches.');
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

    const downloadPdf = async (ficheId: number) => {
    const token = localStorage.getItem('authTokens');
    const auth = token ? JSON.parse(token) : null;

    try {
      const response = await axios.get(`http://localhost:8000/fiches_besoin/fiches_besoin/pdf_fiche/${ficheId}/`, {
        headers: {
          Authorization: `Bearer ${auth?.access}`,
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



  const handleModifyBesoin = async (besoinId: number) => {
  const besoin = fiches.flatMap(f => f.besoins).find(b => b.id === besoinId);
  if (!besoin) return;

  const { value: formValues } = await Swal.fire({
    title: 'Modifier le besoin',
    html:
      `<input id="swal-quantite" class="swal2-input" placeholder="Quantité" value="${besoin.quantite}">` +
      `<input id="swal-observation" class="swal2-input" placeholder="Observation" value="${besoin.observation}">`,
    focusConfirm: false,
    preConfirm: () => {
      return {
        quantite: Number((document.getElementById('swal-quantite') as HTMLInputElement).value),
        observation: (document.getElementById('swal-observation') as HTMLInputElement).value,
      };
    }
  });

  if (formValues) {
    try {
      // 🔁 Ajoute les champs requis attendus par le backend
      const updatedBesoin = {
        ...formValues,
        designation_id: besoin.designation.id,  // ID ou objet attendu par le serializer
      };

      await axios.put(
        `http://localhost:8000/fiches_besoin/fiches_besoin/besoins/${besoinId}/`,
        updatedBesoin,
        {
          headers: {
            Authorization: `Bearer ${authTokens?.access}`,
          },
        }
      );

      Swal.fire('Modifié', 'Le besoin a été mis à jour.', 'success');

      setFiches((prevFiches) =>
        prevFiches.map((fiche) => ({
          ...fiche,
          besoins: fiche.besoins.map((b) =>
            b.id === besoinId ? { ...b, ...formValues } : b
          ),
        }))
      );
    } catch (err) {
      console.error(err);
      Swal.fire('Erreur', "La modification a échoué", 'error');
    }
  }
};



  const handleDeleteBesoin = async (besoinId: number) => {
  const confirm = await Swal.fire({
    title: 'Supprimer ce besoin ?',
    text: 'Cette action est irréversible.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Oui, supprimer',
    cancelButtonText: 'Annuler',
  });

  if (confirm.isConfirmed) {
    try {
      await axios.delete(`http://localhost:8000/fiches_besoin/fiches_besoin/besoins/${besoinId}/`, {
        headers: {
          Authorization: `Bearer ${authTokens?.access}`,
        },
      });

      Swal.fire('Supprimé', 'Le besoin a été supprimé.', 'success');

      // Rafraîchir les fiches après suppression
      setFiches((prevFiches) =>
        prevFiches.map((fiche) => ({
          ...fiche,
          besoins: fiche.besoins.filter((b) => b.id !== besoinId),
        }))
      );
    } catch (error) {
      Swal.fire('Erreur', "La suppression a échoué", 'error');
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


  const showDetail = (fiche: Fiche) => {
    const besoinsHtml = fiche.besoins
      .map((besoin) => `
        <tr>
          <td>${besoin.designation?.nom || 'N/A'}</td>
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
      <h2>Fiches de Besoins </h2>

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
                    <button onClick={() => showDetail(fiche)} title="Détails">
                      <i className="fas fa-eye"></i>
                    </button>
                    
                    <button onClick={() => downloadPdf(fiche.id)} title="Télécharger PDF">
                      <i className="fas fa-file-pdf" style={{ color: 'white' }}></i>
                    </button>
                     {user?.is_staff && (
                      <button onClick={() => handleDeleteFiche(fiche.id)} title="Supprimer fiche">
                        <i className="fas fa-trash-alt" style={{ color: 'darkred' }}></i>
                      </button>
                    )}
                  </td>
                  

                {/* <td>
                  <button onClick={() => showDetail(fiche)}>Details de fiche {fiche.id}</button>
                </td>
                <td>
                  <button onClick={() => downloadPdf(fiche.id)}>Télécharger PDF</button>
                </td> */}
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
