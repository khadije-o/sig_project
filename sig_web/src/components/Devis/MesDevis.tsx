


import React, { useEffect, useState } from "react";

import { getDevisList, deleteDevis, updateDevis } from "../../services/devisService";
import { DevisGlobal, DevisLigne } from "../../types/devisTypes";
import DevisDetail from "./DevisDetail";
import DevisTable from "./DevisTable";
import useAuth from "../../hooks/useAuth";
import Swal from "sweetalert2";
import { getDesignations } from "../../services/designationService";

const MesDevis: React.FC = () => {
  const { authTokens } = useAuth();
  const [devisList, setDevisList] = useState<DevisGlobal[]>([]);
  const [selectedDevis, setSelectedDevis] = useState<DevisGlobal | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [designations, setDesignations] = useState<{ id: number; nom: string }[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const filteredDevisList = devisList.filter(devis =>
  devis.numero.toLowerCase().includes(searchTerm.toLowerCase())
);


  useEffect(() => {
    if (authTokens?.access) {
      fetchDevis();
      fetchDesignations();
    }
  }, [authTokens]);

  const fetchDevis = async () => {
    try {
      const response = await getDevisList(authTokens!.access);
      setDevisList(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des devis", error);
    }
  };

  const fetchDesignations = async () => {
    try {
      const response = await getDesignations();
      setDesignations(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des désignations", error);
    }
  };

 
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
          await deleteDevis(id, authTokens!.access);
          setDevisList(prev => prev.filter(devis => devis.id !== id));
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
      // Get the current designation ID whether it's an object or just an ID
      const currentDesignationId = typeof ligne.designation === 'number' 
        ? ligne.designation 
        : ligne.designation.id;

      return `
        <div style="margin-bottom:10px">
          <label>Désignation ${index + 1}:</label>
          <select id="designation-${index}" class="swal2-input">
            ${designations.map(des => `
              <option value="${des.id}" ${des.id === currentDesignationId ? 'selected' : ''}>
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
              designation: designationId // Just store the ID here, or { id: designationId, nom: designation.nom } if you want the full object
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

        const data = {
          total_ht: totalHT,
          tva: devis.tva,
          montant_tva: montantTVA,
          total_ttc: totalTTC,
          lignes_update: lignesMaj.map(l => ({
            id: l.id,
            designation: typeof l.designation === 'number' ? l.designation : l.designation.id,
            quantite: l.quantite,
            prix_unitaire: l.prix_unitaire,
            prix_total: l.prix_total
          }))
        };

        try {
          await updateDevis(devis.id, data, authTokens!.access);
          Swal.fire("Succès", "Le devis a été mis à jour.", "success");
          fetchDevis(); // Met à jour la liste
        } catch (error) {
          console.error("Erreur lors de la mise à jour :", error);
          Swal.fire("Erreur", "Échec de la mise à jour du devis.", "error");
        }
      }
    });
  };






  const handleView = (devis: DevisGlobal) => {
    setSelectedDevis(devis);
    setShowDetail(true);
  };

  const handleDownloadPdf = (devis: DevisGlobal) => {
  if (devis.piece_jointe) {
    window.open(devis.piece_jointe, "_blank");
  } else {
    Swal.fire("Aucune pièce jointe", "Ce devis ne contient pas de fichier joint.", "info");
  }
};



  

return (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-4">Mes Devis</h1>

    {showDetail && selectedDevis ? (
      <DevisDetail devis={selectedDevis} onClose={() => setShowDetail(false)} />
    ) : (
      <>
        {/* Barre de recherche visible uniquement sur la liste */}
        <input
          type="text"
          placeholder="Rechercher un devis par numéro..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4 p-2 border rounded w-full max-w-sm"
        />

        {filteredDevisList.length === 0 ? (
          <p className="text-center text-gray-500 mt-6">Aucun résultat</p>
        ) : (
          <DevisTable
            devisList={filteredDevisList}
            onDelete={handleDelete}
            onEdit={handleUpdateDevisLignes}
            onView={handleView}
            onDownloadPdf={handleDownloadPdf}
          />
        )}
      </>
    )}
  </div>
);

};

export default MesDevis;
