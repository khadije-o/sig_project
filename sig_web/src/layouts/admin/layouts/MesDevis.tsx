import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import '../../../css/devis.css';

interface Fournisseur {
  id: number;
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


interface DevisLigne {
  id: number;
  designation: Designation;
  quantite: number;
  prix_unitaire: number;
  prix_total: number;
}

interface DevisGlobal {
  id: number;
  numero: string;
  fournisseur: Fournisseur;
  date: string;
  total_ht: number;
  tva: number;
  montant_tva: number;
  total_ttc: number;
  lignes: DevisLigne[];
  piece_jointe: string; 
}

const MesDevis: React.FC = () => {
  const navigate = useNavigate();

  const handleRetour = () => {
    navigate(-1); // revenir à la page précédente
  };

  const [devisList, setDevisList] = useState<DevisGlobal[]>([]);
  const [search, setSearch] = useState<string>("");
  const [filteredDevis, setFilteredDevis] = useState<DevisGlobal[]>([]);
  const [selectedDevis, setSelectedDevis] = useState<DevisGlobal | null>(null);
  const [designations, setDesignations] = useState<{ id: number; nom: string }[]>([]);

  // Charger la liste des devis depuis l’API
useEffect(() => {
  axios.get<DevisGlobal[]>("http://127.0.0.1:8000/devisglobal/devis-globals/")
    .then(response => {
      const data = response.data.map(devis => ({
        ...devis,
        total_ht: Number(devis.total_ht),
        tva: Number(devis.tva),
        montant_tva: Number(devis.montant_tva),
        total_ttc: Number(devis.total_ttc),
        lignes: Array.isArray(devis.lignes)
          ? devis.lignes.map(ligne => ({
              ...ligne,
              prix_unitaire: Number(ligne.prix_unitaire),
              prix_total: Number(ligne.prix_total),
            }))
          : [], 
      }));

      setDevisList(data);
      setFilteredDevis(data);
    })
    .catch(error => {
      console.error("Erreur lors du chargement des devis:", error);
    });
}, []);



useEffect(() => {
  axios.get("http://localhost:8000/designation/designation/").then(response => {
    setDesignations(response.data);
  });
}, []);

const getDesignationName = (id: number): string => {
  const designation = designations.find(d => d.id === id);
  return designation ? designation.nom : `ID ${id}`;
};



  // Filtrer les devis selon la recherche
  useEffect(() => {
    const lowerSearch = search.toLowerCase();
    setFilteredDevis(
      devisList.filter(d =>
        d.numero.toLowerCase().includes(lowerSearch) ||
        d.fournisseur.nom_entreprise.toLowerCase().includes(lowerSearch)
      )
    );
  }, [search, devisList]);


const handleDelete = (id: number) => {
  Swal.fire({
    title: 'Êtes-vous sûr ?',
    text: "Cette action est irréversible !",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Oui, supprimer',
    cancelButtonText: 'Annuler',
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await axios.delete(`http://127.0.0.1:8000/devisglobal/devis-globals/${id}/`);
        setDevisList(prev => prev.filter(devis => devis.id !== id));
        setFilteredDevis(prev => prev.filter(devis => devis.id !== id));
        if (selectedDevis?.id === id) setSelectedDevis(null);

        Swal.fire("Supprimé !", "Le devis a été supprimé.", "success");
      } catch (error) {
        console.error("Erreur lors de la suppression :", error);
        Swal.fire("Erreur", "La suppression a échoué.", "error");
      }
    }
  });
};




const handleUpdateDevisLignes = (devis: DevisGlobal) => {
  const lignesHtml = devis.lignes.map((ligne, index) => {
    return `
      <div style="margin-bottom:10px">
        <label>Désignation ${index + 1}:</label>
        <select id="designation-${index}" class="swal2-input">
          ${designations.map(des => `
            <option value="${des.id}" ${des.id === ligne.designation.id ? 'selected' : ''}>
              ${des.nom}
            </option>`).join('')}
        </select>
        <input type="number" id="quantite-${index}" class="swal2-input" placeholder="Quantité" value="${ligne.quantite}">
        <input type="number" id="prix-${index}" class="swal2-input" placeholder="Prix unitaire" value="${ligne.prix_unitaire}">
      </div>
    `;
  }).join('');

  Swal.fire({
    title: `Modifier le devis ${devis.numero}`,
    html: `<form id="form-devis">${lignesHtml}</form>`,
    width: '60%',
    showCancelButton: true,
    confirmButtonText: 'Enregistrer',
    preConfirm: () => {
      try {
        const updatedLignes: DevisLigne[] = devis.lignes.map((ligne, index) => {
          const quantite = parseFloat((document.getElementById(`quantite-${index}`) as HTMLInputElement).value);
          const prix_unitaire = parseFloat((document.getElementById(`prix-${index}`) as HTMLInputElement).value);
          const designationId = parseInt((document.getElementById(`designation-${index}`) as HTMLSelectElement).value);
          const designation = designations.find(d => d.id === designationId);

          if (!designation || isNaN(quantite) || isNaN(prix_unitaire)) {
            throw new Error("Champs invalides.");
          }

          return {
            ...ligne,
            quantite,
            prix_unitaire,
            prix_total: quantite * prix_unitaire,
            designation: { id: designation.id, nom: designation.nom }
          };
        });

        return updatedLignes;
      } catch (e) {
        Swal.showValidationMessage("Veuillez remplir tous les champs correctement.");
        return;
      }
    }
  }).then(async result => {
    if (result.isConfirmed && result.value) {
      const lignesMaj = result.value as DevisLigne[];
      const totalHT = lignesMaj.reduce((acc, l) => acc + l.prix_total, 0);
      const montantTVA = totalHT * (devis.tva / 100);
      const totalTTC = totalHT + montantTVA;

      const updatedDevis: DevisGlobal = {
        ...devis,
        lignes: lignesMaj,
        total_ht: totalHT,
        montant_tva: montantTVA,
        total_ttc: totalTTC
      };

      try {
        await axios.patch(`http://127.0.0.1:8000/devisglobal/devis-globals/${devis.id}/`, {
  total_ht: totalHT,
  tva: updatedDevis.tva,
  montant_tva: montantTVA,
  total_ttc: totalTTC,
  lignes: lignesMaj.map(l => ({
    id: l.id,
    designation: l.designation.id,
    quantite: l.quantite,
    prix_unitaire: l.prix_unitaire,
    prix_total: l.prix_total
  }))


        });

        setDevisList(prev => prev.map(d => d.id === devis.id ? updatedDevis : d));
        setFilteredDevis(prev => prev.map(d => d.id === devis.id ? updatedDevis : d));

        Swal.fire("Succès", "Le devis a été mis à jour dans la base de données.", "success");
      } catch (error) {
        console.error("Erreur lors de la mise à jour :", error);
        Swal.fire("Erreur", "Échec de la mise à jour du devis.", "error");
      }
    }
  });
};





  return (
    <div className="p-4">
      <button onClick={handleRetour} style={{ marginBottom: "20px" }}>
        ← 
      </button>
      <h2 className="text-xl font-bold mb-4">Mes Devis</h2>

      <input
        type="text"
        placeholder="Rechercher par numéro ou nom d'entreprise"
        className="border rounded p-2 w-full mb-4"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Numéro</th>
            <th className="border p-2">Fournisseur</th>
            <th className="border p-2">Date</th>
            <th className="border p-2">Total TTC</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredDevis.map(devis => (
            <tr key={devis.id} className="border">
              <td className="border p-2">{devis.numero}</td>
              <td className="border p-2">{devis.fournisseur.nom_entreprise}</td>
              <td className="border p-2">{devis.date}</td>
              <td className="border p-2">{devis.total_ttc.toFixed(2)} MRU</td>
              <td className="border p-2 space-x-2">
  <button
    className="text-blue-500 hover:text-blue-700"
    onClick={() => setSelectedDevis(devis)}
    title="Voir les détails"
  >
    <i className="fas fa-eye"></i>
  </button>

  <button
    className="text-green-500 hover:text-green-700"
    onClick={() => handleUpdateDevisLignes(devis)}
    title="Modifier"
  >
    <i className="fal fa-pen-to-square"></i>
  </button>

  <button
    className="text-red-500 hover:text-red-700"
    onClick={() => handleDelete(devis.id)}
    title="Supprimer"
  >
    <i className="fal fa-trash-alt"></i>
  </button>

  <button
    className="text-purple-500 hover:text-purple-700"
    onClick={() => {
      if (devis.piece_jointe) {
        window.open(devis.piece_jointe, "_blank");
      } else {
        Swal.fire("Aucune pièce jointe", "Ce devis ne contient pas de fichier joint.", "info");
      }
    }}
    title="Voir la pièce jointe"
  >
    <i className="fas fa-file-pdf"></i>
  </button>
</td>

            </tr>
          ))}
        </tbody>
      </table>

      {selectedDevis && (
        <div className="mt-6 border-t pt-4">
          <h3 className="text-lg font-semibold mb-2">
            Détails du devis {selectedDevis.numero}
          </h3>
          <p><strong>Fournisseur :</strong> {selectedDevis.fournisseur.nom_entreprise}</p>
          <p><strong>Téléphone :</strong> {selectedDevis.fournisseur.telephone}</p>
          <p><strong>Email :</strong> {selectedDevis.fournisseur.email}</p>
          <p><strong>NIF :</strong> {selectedDevis.fournisseur.nif}</p>
          <p><strong>RC :</strong> {selectedDevis.fournisseur.rc}</p>
          <p><strong>Compte bancaire :</strong> {selectedDevis.fournisseur.compte_bancaire}</p>

          <table className="w-full border-collapse mt-4 border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Désignation</th>
                <th className="border p-2">Quantité</th>
                <th className="border p-2">Prix Unitaire</th>
                <th className="border p-2">Prix Total</th>
              </tr>
            </thead>
            <tbody>
              {selectedDevis.lignes.map(ligne => (
                <tr key={ligne.id}>
                 <td className="border p-2">
  {typeof ligne.designation === 'object'
    ? ligne.designation.nom
    : getDesignationName(ligne.designation)}
</td>
                  <td className="border p-2">{ligne.quantite}</td>
                  <td className="border p-2">{ligne.prix_unitaire.toFixed(2)} MRU</td>
                  <td className="border p-2">{ligne.prix_total.toFixed(2)} MRU</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4">
            <p><strong>Total HT :</strong> {selectedDevis.total_ht.toFixed(2)} MRU</p>
            <p><strong>TVA ({selectedDevis.tva}%) :</strong> {selectedDevis.montant_tva.toFixed(2)} MRU</p>
            <p><strong>Total TTC :</strong> {selectedDevis.total_ttc.toFixed(2)} MRU</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MesDevis;
