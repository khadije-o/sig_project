import { useEffect, useState, useContext } from 'react';
import Swal from 'sweetalert2';
import { Fournisseur } from '../../types/fournisseurTypes';
import {
  getFournisseurs,
  deleteFournisseur,
  updateFournisseur
} from '../../services/fournisseurService';
import { fileToBase64 } from '../../utils/fileUtils';
import AuthContext from '../../context/AuthContext';
import FournisseurForm from './FournisseurForm';
import FournisseurTable from './FournisseurTable';
import { getDesignations } from '../../services/designationService';
import { createDevis } from '../../services/devisService';
import "../../assets/styles/css/devis.css"
import { useNavigate } from 'react-router-dom';

const FournisseurContainer = () => {
  const { authTokens } = useContext(AuthContext);
  const [fournisseurs, setFournisseurs] = useState<Fournisseur[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);

  const fetchFournisseurs = async () => {
    try {
      const data = await getFournisseurs();
      setFournisseurs(data);
    } catch (err) {
      console.error('Erreur chargement fournisseurs', err);
    }
  };

  
if (!authTokens) {
  return <div>Authentification requise.</div>; // ou redirect vers login
}

  const handleEdit = async (fournisseur: Fournisseur) => {
    const { value: formValues } = await Swal.fire({
      title: 'Modifier fournisseur',
      html:
        `<input id="swal-nom" class="swal2-input" placeholder="Entreprise" value="${fournisseur.nom_entreprise}">` +
        `<input id="swal-telephone" class="swal2-input" placeholder="Téléphone" value="${fournisseur.telephone}">` +
        `<input id="swal-email" class="swal2-input" placeholder="Email" value="${fournisseur.email}">` +
        `<input id="swal-nif" class="swal2-input" placeholder="NIF" value="${fournisseur.nif}">` +
        `<input id="swal-rc" class="swal2-input" placeholder="RC" value="${fournisseur.rc}">` +
        `<input id="swal-compte" class="swal2-input" placeholder="Compte bancaire" value="${fournisseur.compte_bancaire}">`,
      showCancelButton: true,
      focusConfirm: false,
      preConfirm: () => {
        const nom_entreprise = (document.getElementById('swal-nom') as HTMLInputElement).value;
        const telephone = (document.getElementById('swal-telephone') as HTMLInputElement).value;
        const email = (document.getElementById('swal-email') as HTMLInputElement).value;
        const nif = (document.getElementById('swal-nif') as HTMLInputElement).value;
        const rc = (document.getElementById('swal-rc') as HTMLInputElement).value;
        const compte_bancaire = (document.getElementById('swal-compte') as HTMLInputElement).value;

        if (!nom_entreprise || !telephone || !email) {
          Swal.showValidationMessage("Les champs entreprise, téléphone et email sont obligatoires");
          return;
        }

        return { nom_entreprise, telephone, email, nif, rc, compte_bancaire };
      }
    });

    if (formValues && fournisseur.id) {
      try {
        await updateFournisseur(fournisseur.id, formValues);
        Swal.fire('Succès', 'Fournisseur modifié', 'success');
        fetchFournisseurs();
      } catch (error) {
        Swal.fire('Erreur', 'Échec de la mise à jour', 'error');
        console.error(error);
      }
    }
  };

  const handleDelete = async (id?: number) => {
    const result = await Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Cette action est irréversible !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer !',
      cancelButtonText: 'Annuler',
    });

    if (result.isConfirmed && id) {
      try {
        await deleteFournisseur(id);
        Swal.fire('Supprimé !', 'Le fournisseur a été supprimé.', 'success');
        fetchFournisseurs();
      } catch (error) {
        Swal.fire('Erreur', "Erreur lors de la suppression.", 'error');
        console.error(error);
      }
    }
  };

  const handleCreateDevis = async (fournisseur: Fournisseur) => {
    const res = await getDesignations();
    const designations = res.data;

    const createLigneHtml = (index: number) => {
      const options = designations
        .map((d: any) => `<option value="${d.id}">${d.nom}</option>`)
        .join('');
      return `
        <div class="ligne-devis" style="margin-bottom: 15px; border-bottom: 1px solid #eee;">
          <select id="swal-designation-${index}" class="swal2-input">
            <option value="">Sélectionner une désignation</option>
            ${options}
          </select>
          <input id="swal-quantite-${index}" class="swal2-input" type="number" min="1" placeholder="Quantité" />
          <input id="swal-prix-${index}" class="swal2-input" type="number" min="0" step="0.01" placeholder="Prix unitaire" />
          <button type="button" class="remove-ligne-btn swal2-cancel swal2-styled" data-index="${index}">Supprimer</button>
        </div>
      `;
    };

    let html = `
      <input id="swal-numero" class="swal2-input" placeholder="Numéro devis" />
      <input type="file" id="swal-piece-jointe" class="swal2-file" accept=".pdf,.jpg,.png" />
      <div id="lignes-container">${createLigneHtml(0)}</div>
      <button type="button" id="add-ligne-btn" class="swal2-confirm swal2-styled" style="margin-top: 10px;">Ajouter une ligne</button>
    `;

    const { value: formValues } = await Swal.fire({
      title: 'Créer un devis',
      html,
      width: '700px',
      showCancelButton: true,
      focusConfirm: false,
      didOpen: () => {
        document.getElementById('add-ligne-btn')?.addEventListener('click', () => {
          const container = document.getElementById('lignes-container');
          if (container) {
            const newIndex = container.children.length;
            container.insertAdjacentHTML('beforeend', createLigneHtml(newIndex));
          }
        });

        document.addEventListener('click', (e) => {
          const target = e.target as HTMLElement;
          if (target.classList.contains('remove-ligne-btn')) {
            const index = target.getAttribute('data-index');
            const ligne = document.getElementById(`swal-designation-${index}`)?.parentElement;
            ligne?.remove();
          }
        });
      },
      preConfirm: () => {
        const numero = (document.getElementById('swal-numero') as HTMLInputElement).value.trim();
        const piece_jointe_file = (document.getElementById('swal-piece-jointe') as HTMLInputElement).files?.[0];
        const container = document.getElementById('lignes-container');
        const lignes = [];

        if (!numero) {
          Swal.showValidationMessage("Le numéro est requis");
          return;
        }

        if (container) {
          for (let i = 0; i < container.children.length; i++) {
            const designationEl = document.getElementById(`swal-designation-${i}`) as HTMLSelectElement;
            const quantiteEl = document.getElementById(`swal-quantite-${i}`) as HTMLInputElement;
            const prixEl = document.getElementById(`swal-prix-${i}`) as HTMLInputElement;

            const designation = parseInt(designationEl?.value);
            const quantite = parseFloat(quantiteEl?.value);
            const prix_unitaire = parseFloat(prixEl?.value);

            if (!designation || isNaN(quantite) || quantite < 1 || isNaN(prix_unitaire)) {
              Swal.showValidationMessage("Champs invalides dans une ligne");
              return;
            }

            lignes.push({ designation, quantite, prix_unitaire });
          }
        }

        return {
          numero,
          fournisseur: fournisseur.id,
          lignes,
          piece_jointe: piece_jointe_file,
        };
      }
    });

    if (formValues) {
      try {
        const dataToSend = {
          numero: formValues.numero,
          fournisseur: formValues.fournisseur,
          lignes: formValues.lignes,
          piece_jointe: formValues.piece_jointe
            ? await fileToBase64(formValues.piece_jointe)
            : null,
        };
        await createDevis(dataToSend, authTokens.access);
        Swal.fire('Succès', 'Devis créé avec succès !', 'success');
      } catch (error) {
        console.error('Erreur création devis', error);
        Swal.fire('Erreur', "Échec de création du devis", 'error');
      }
    }
  };

  useEffect(() => {
    fetchFournisseurs();
  }, []);

  const filteredFournisseurs = fournisseurs.filter(f =>
    f.nom_entreprise.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const navigate = useNavigate();


  return (
    <div className="user-container">
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Gestion de devis</h1>


      <div className="search-bar">
  <div className="search-input-wrapper">
    <input
      type="text"
      placeholder="Rechercher..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
     {searchTerm && (
    <i
      className="fas fa-times clear-input-icon" 
      onClick={() => setSearchTerm('')}
      role="button"
      aria-label="Effacer la recherche"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && setSearchTerm('')}
      style={{ cursor: 'pointer' }}
    />
  )}
  </div>
    {!showForm && (
    <button onClick={() => setShowForm(true)} className="add-btn">
      Ajouter Fournisseur
    </button>
  )}

</div>


      {showForm && (
  <FournisseurForm
    onSuccess={() => {
      fetchFournisseurs();
      setShowForm(false);
    }}
    onCancel={() => setShowForm(false)}
  />
)}

       <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "10px" ,
          }}>
      <button onClick={() => navigate("/mes-devis")} className="add-btn">
        <i style={{ marginRight: "5px" }}></i> Liste des devis
      </button>
    </div>
      <FournisseurTable
      
        fournisseurs={filteredFournisseurs}
        onDelete={handleDelete}
        onRefresh={fetchFournisseurs}
        onEdit={handleEdit}
        onCreateDevis={handleCreateDevis}
      />



    </div>
  );
};

export default FournisseurContainer;
