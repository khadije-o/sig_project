



import React, { useState } from "react";
import Swal from "sweetalert2";
import { DevisGlobal } from "../../types/devisTypes";
import useAuth from "../../hooks/useAuth";
import { createBonCommande } from "../../services/devisService";

interface DevisDetailProps {
  devis: DevisGlobal;
  onClose: () => void;
}

const DevisDetail: React.FC<DevisDetailProps> = ({ devis, onClose }) => {
  const { authTokens } = useAuth();
  const [numeroBon, setNumeroBon] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateBonCommande = async () => {
    if (!numeroBon.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Champ requis",
        text: "Veuillez saisir le numéro du bon de commande.",
      });
      return;
    }

    setLoading(true);

    const today = new Date().toISOString().split("T")[0];

    try {
      await createBonCommande(
        {
          numero_bon: numeroBon,
          date_bon: today,
          devis_id: devis.id,
        },
        authTokens!.access
      );

      Swal.fire({
        icon: "success",
        title: "Succès",
        text: "Bon de commande créé avec succès !",
      });
    } catch (error: any) {
  const detail = error.response?.data?.detail;

  if (detail?.includes("existe déjà pour ce devis")) {
    Swal.fire({
      icon: "warning",
      title: "Bon de commande existant",
      text: "Un bon de commande a déjà été créé pour ce devis.",
    });
  } else {
    Swal.fire({
      icon: "error",
      title: "Erreur",
      text:
        detail || "Une erreur est survenue lors de la création du bon de commande.",
    });
  }
}

  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Détails du devis #{devis.numero}
      </h2>

      {/* Infos Fournisseur */}
      <div className="mb-6 text-sm text-gray-700">
        <h3 className="font-semibold mb-2">Informations Fournisseur</h3>
        <div className="grid grid-cols-2 gap-4">
          <div><span className="font-semibold">Fournisseur :</span> {devis.fournisseur.nom_entreprise}</div>
          <div><span className="font-semibold">Email :</span> {devis.fournisseur.email}</div>
          <div><span className="font-semibold">Téléphone :</span> {devis.fournisseur.telephone}</div>
          <div><span className="font-semibold">NIF :</span> {devis.fournisseur.nif}</div>
          <div><span className="font-semibold">RC :</span> {devis.fournisseur.rc}</div>
          <div><span className="font-semibold">Compte bancaire :</span> {devis.fournisseur.compte_bancaire}</div>
        </div>
      </div>

      {/* Lignes de devis */}
      <h3 className="text-lg font-semibold mb-2">Lignes de devis</h3>
      <div className="overflow-x-auto mb-6">
        <table className="min-w-full text-sm text-gray-700 border border-gray-300 rounded-md">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="px-4 py-2 border-b">Désignation</th>
              <th className="px-4 py-2 border-b">Quantité</th>
              <th className="px-4 py-2 border-b">Prix unitaire</th>
              <th className="px-4 py-2 border-b">Prix total</th>
            </tr>
          </thead>
          <tbody>
            {devis.lignes.map((ligne) => {
              const designationNom =
                typeof ligne.designation === "object"
                  ? ligne.designation.nom
                  : `ID: ${ligne.designation}`;
              return (
                <tr key={ligne.id} className="border-t">
                  <td className="px-4 py-2">{designationNom}</td>
                  <td className="px-4 py-2">{ligne.quantite}</td>
                  <td className="px-4 py-2">{ligne.prix_unitaire}</td>
                  <td className="px-4 py-2">{ligne.prix_total}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Totaux */}
      <div className="text-sm text-gray-700 max-w-md ml-auto border border-gray-300 rounded p-4">
        <div className="flex justify-between mb-2">
          <span className="font-semibold">Total HT :</span>
          <span>{devis.total_ht} DA</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="font-semibold">TVA ({devis.tva}%) :</span>
          <span>{devis.montant_tva} DA</span>
        </div>
        <div className="flex justify-between font-bold text-gray-900 text-lg">
          <span>Total TTC :</span>
          <span>{devis.total_ttc} DA</span>
        </div>
      </div>

      {/* Saisie Numéro Bon */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Numéro du Bon de Commande :
        </label>
        <input
          type="text"
          value={numeroBon}
          onChange={(e) => setNumeroBon(e.target.value)}
          placeholder="Ex: BC-2025-001"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring focus:border-blue-500"
        />
      </div>

      {/* Boutons */}
      <div className="mt-6 flex justify-between">
        <button
          onClick={onClose}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-xl transition"
        >
          Fermer
        </button>
        <button
          onClick={handleCreateBonCommande}
          disabled={loading || !numeroBon.trim()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition"
        >
          {loading ? "Création..." : "Créer Bon de Commande"}
        </button>
      </div>
    </div>
  );
};

export default DevisDetail;
