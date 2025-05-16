import { useEffect, useState, FormEvent, useContext } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import AuthContext from '../../../context/AuthContext';
import '../../../css/devis.css'; 

interface Fournisseur {
  id?: number;
  nom_entreprise: string;
  telephone: string;
  email: string;
  nif: string;
  rc: string;
  compte_bancaire: string;
}

interface Designation {
  id: number;
  nom: string;
}



const FournisseurContainer = () => {
  const { authTokens } = useContext(AuthContext);
  const [fournisseurs, setFournisseurs] = useState<Fournisseur[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [filteredFournisseurs, setFilteredFournisseurs] = useState<Fournisseur[]>([]);
  const [searchTerm, setSearchTerm] = useState(''); 
  const [formData, setFormData] = useState<Fournisseur>({
    nom_entreprise: '',
    telephone: '',
    email: '',
    nif: '',
    rc: '',
    compte_bancaire: '',
  });


  const fetchFournisseurs = async () => {
    try {
      const response = await axios.get('http://localhost:8000/fournisseurs/fournisseurs/', {
        headers: {
          Authorization: `Bearer ${authTokens?.access}`,
        },
      });
      setFournisseurs(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des fournisseurs', error);
    }
  };
  

  const fetchDesignations = async (): Promise<Designation[]> => {
  try {
    const response = await axios.get('http://localhost:8000/designation/designation/', {
      headers: {
        Authorization: `Bearer ${authTokens?.access}`,
      },
    });
    return response.data; // Assurez-vous que la réponse est une liste de designations typées
  } catch (error) {
    console.error('Erreur lors du chargement des désignations', error);
    return [];
  }
};

  const handleCreateDevis = async (fournisseur: Fournisseur) => {
  const designations = await fetchDesignations();

  const createLigneHtml = (index: number) => {
    const designationOptions = designations.map(d =>
      `<option value="${d.id}">${d.nom}</option>`
    ).join('');

    return `
      <div class="ligne-devis" style="margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 10px;">
        <select id="swal-designation-${index}" class="swal2-input" required>
          <option value="">Sélectionner une désignation</option>
          ${designationOptions}
        </select>
        <input id="swal-quantite-${index}" class="swal2-input" type="number" min="1" placeholder="Quantité" required>
        <input id="swal-prix-${index}" class="swal2-input" type="number" step="0.01" min="0" placeholder="Prix unitaire" required>
        <button type="button" class="remove-ligne-btn swal2-cancel swal2-styled" data-index="${index}" 
                style="margin-top: 5px; padding: 0.375em 0.75em;">
          Supprimer
        </button>
      </div>
    `;
  };

  let html = `
    <input id="swal-numero" class="swal2-input" placeholder="Numéro devis" required>
    <input type="file" id="swal-piece-jointe" class="swal2-file" accept=".jpg,.jpeg,.png,.pdf" />
    <div id="lignes-container">
      ${createLigneHtml(0)}
    </div>
    <button type="button" id="add-ligne-btn" class="swal2-confirm swal2-styled" 
            style="margin-top: 10px; width: 100%;">
      Ajouter une ligne
    </button>
  `;

  const { value: formValues } = await Swal.fire({
    title: 'Créer un devis',
    html,
    focusConfirm: false,
    showCancelButton: true,
    width: '700px',
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
          const ligneToRemove = document.getElementById(`swal-designation-${index}`)?.parentElement;
          if (ligneToRemove) {
            ligneToRemove.remove();
          }
        }
      });
    },
    preConfirm: () => {
      const numero = (document.getElementById('swal-numero') as HTMLInputElement)?.value.trim();
      const piece_jointe_file = (document.getElementById('swal-piece-jointe') as HTMLInputElement)?.files?.[0];
      const container = document.getElementById('lignes-container');
      const devislignes = [];

      if (!numero) {
        Swal.showValidationMessage('Le numéro du devis est requis');
        return;
      }

      if (container) {
        for (let i = 0; i < container.children.length; i++) {
          const designationEl = document.getElementById(`swal-designation-${i}`) as HTMLSelectElement | null;
          const quantiteEl = document.getElementById(`swal-quantite-${i}`) as HTMLInputElement | null;
          const prixEl = document.getElementById(`swal-prix-${i}`) as HTMLInputElement | null;

          if (!designationEl || !quantiteEl || !prixEl) {
            Swal.showValidationMessage('Une erreur est survenue avec les lignes');
            return;
          }

          const designation = designationEl.value;
          const quantite = parseFloat(quantiteEl.value);
          const prix_unitaire = parseFloat(prixEl.value);

          if (!designation || isNaN(quantite) || quantite < 1 || isNaN(prix_unitaire) || prix_unitaire < 0) {
            Swal.showValidationMessage('Veuillez remplir correctement tous les champs pour chaque ligne');
            return;
          }

          devislignes.push({
            designation: parseInt(designation, 10),
            quantite,
            prix_unitaire,
          });
        }
      }

      if (devislignes.length === 0) {
        Swal.showValidationMessage('Au moins une ligne est requise');
        return;
      }

      return {
        numero,
        fournisseur: fournisseur.id,
        piece_jointe: piece_jointe_file,
        lignes: devislignes,
      };
    }
  });

  
  if (formValues) {
  const requestData = {
    numero: formValues.numero,
    fournisseur: formValues.fournisseur,
    lignes: formValues.lignes,
    piece_jointe: formValues.piece_jointe ? await fileToBase64(formValues.piece_jointe) : null
  };

  try {
    await axios.post(
      'http://127.0.0.1:8000/devisglobal/devis-globals/',
      requestData,
      {
        headers: {
          'Authorization': `Bearer ${authTokens?.access}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Message de succès après création
    Swal.fire({
      icon: 'success',
      title: 'Succès',
      text: 'Le devis a été créé avec succès !',
      timer: 2000,
      showConfirmButton: false,
    });

  } catch (error) {
    console.error('Erreur création devis:', error);
    let errorMessage = "Erreur lors de la création du devis";
    if (axios.isAxiosError(error) && error.response?.data) {
      errorMessage += `: ${JSON.stringify(error.response.data)}`;
    }
    Swal.fire('Erreur', errorMessage, 'error');
  }
}

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
}


};


  // Filtrer les fournisseurs quand searchTerm ou fournisseurs changent
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredFournisseurs(fournisseurs);
    } else {
      const filtered = fournisseurs.filter(f =>
        f.nom_entreprise.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredFournisseurs(filtered);
    }
  }, [searchTerm, fournisseurs]);

    // Chargement initial
  useEffect(() => {
    fetchFournisseurs();
  }, []);
  

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/fournisseurs/fournisseurs/', formData, {
        headers: {
          Authorization: `Bearer ${authTokens?.access}`,
        },
      });
      Swal.fire('Succès', 'Fournisseur bien créé !', 'success');
      setShowForm(false);
      setFormData({
        nom_entreprise: '',
        telephone: '',
        email: '',
        nif: '',
        rc: '',
        compte_bancaire: '',
      });
      fetchFournisseurs();
    } catch (error) {
      Swal.fire('Erreur', "Erreur lors de la création du fournisseur.", 'error');
      console.error(error);
    }
  };

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
    focusConfirm: false,
    showCancelButton: true,
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

  if (formValues) {
    try {
      await axios.patch(`http://localhost:8000/fournisseurs/fournisseurs/${fournisseur.id}/`, formValues, {
        headers: {
          Authorization: `Bearer ${authTokens?.access}`,
        },
      });
      Swal.fire('Succès', 'Fournisseur modifié avec succès', 'success');
      fetchFournisseurs();
    } catch (error) {
      Swal.fire('Erreur', "Échec de la mise à jour.", 'error');
      console.error(error);
    }
  }
};


  const handleDelete = async (id?: number) => {
    const result = await Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: "Cette action est irréversible !",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer !',
      cancelButtonText: 'Annuler'
    });

    if (result.isConfirmed && id) {
      try {
        await axios.delete(`http://localhost:8000/fournisseurs/fournisseurs/${id}/`, {
          headers: {
            Authorization: `Bearer ${authTokens?.access}`,
          },
        });
        Swal.fire('Supprimé !', 'Le fournisseur a été supprimé.', 'success');
        fetchFournisseurs();
      } catch (error) {
        Swal.fire('Erreur', "Une erreur est survenue lors de la suppression.", 'error');
        console.error(error);
      }
    }
  };

  return (
    <div className="gestion-users-container">
      <h2>Gestion des fournisseurs</h2>
                {/* Champ recherche en dehors du formulaire */}
      <input
        type="text"
        placeholder="Rechercher par entreprise..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        style={{ marginBottom: '20px', padding: '8px', width: '300px' }}
      />
      <button onClick={() => setShowForm(!showForm)}>Créer un fournisseur</button>

      {showForm && (
        <form onSubmit={handleSubmit} className="register-form">


          <input type="text" placeholder="Entreprise" required value={formData.nom_entreprise} onChange={(e) => setFormData({ ...formData, nom_entreprise: e.target.value })} />
          <input type="text" placeholder="Téléphone" required value={formData.telephone} onChange={(e) => setFormData({ ...formData, telephone: e.target.value })} />
          <input type="email" placeholder="Email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
          <input type="text" placeholder="NIF" value={formData.nif} onChange={(e) => setFormData({ ...formData, nif: e.target.value })} />
          <input type="text" placeholder="RC" value={formData.rc} onChange={(e) => setFormData({ ...formData, rc: e.target.value })} />
          <input type="text" placeholder="Compte bancaire" value={formData.compte_bancaire} onChange={(e) => setFormData({ ...formData, compte_bancaire: e.target.value })} />
          <button type="submit">Enregistrer</button>
        </form>
      )}

      <table className="user-table">
        <thead>
  <tr>
    <th>Entreprise</th>
    <th>Téléphone</th>
    <th>Email</th>
    <th>NIF</th>
    <th>RC</th>
    <th>Compte bancaire</th>
    <th>Actions</th>
  </tr>
</thead>
<tbody>
  {filteredFournisseurs.map(fournisseur => (
    <tr key={fournisseur.id}>
      <td>{fournisseur.nom_entreprise}</td>
      <td>{fournisseur.telephone}</td>
      <td>{fournisseur.email}</td>
      <td>{fournisseur.nif}</td>
      <td>{fournisseur.rc}</td>
      <td>{fournisseur.compte_bancaire}</td>
      <td>
        <i className="fal fa-edit" onClick={() => handleEdit(fournisseur)} style={{ cursor: 'pointer', marginRight: '10px' }}></i>
        <i className="fal fa-trash-alt" onClick={() => handleDelete(fournisseur.id)} style={{ cursor: 'pointer', marginRight: '10px' }}></i>
        <i className="fal fa-plus" onClick={() => handleCreateDevis(fournisseur)} style={{ cursor: 'pointer' }}></i>
      </td>
    </tr>
  ))}
</tbody>

      </table>
    </div>
  );
};

export default FournisseurContainer;

