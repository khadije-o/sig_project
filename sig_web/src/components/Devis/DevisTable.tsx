import React from "react";
import { DevisGlobal } from "../../types/devisTypes";

interface DevisTableProps {
  devisList: DevisGlobal[];
  onDelete: (id: number) => void;
  onEdit: (devis: DevisGlobal) => void;
  onView: (devis: DevisGlobal) => void;
  onDownloadPdf: (devis: DevisGlobal) => void;
}

const DevisTable: React.FC<DevisTableProps> = ({
  devisList,
  onDelete,
  onEdit,
  onView,
  onDownloadPdf,
}) => {
  return (
    <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
      <thead>
        <tr>
          <th className="px-4 py-2">Numéro</th>
          <th className="px-4 py-2">Fournisseur</th>
          <th className="px-4 py-2">Date</th>
          <th className="px-4 py-2">Total TTC</th>
          <th className="px-4 py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {devisList.map((devis) => (
          <tr key={devis.id} className="border-t">
            <td className="px-4 py-2">{devis.numero}</td>
            <td className="px-4 py-2">{devis.fournisseur.nom_entreprise}</td>
            <td className="px-4 py-2">{devis.date}</td>
            <td className="px-4 py-2">{devis.total_ttc} DA</td>
            <td className="px-4 py-2 space-x-2">
              <button
                onClick={() => onView(devis)}
                className="bg-blue-500 text-white px-2 py-1 rounded"
              >
                Voir
              </button>
              <button
                onClick={() => onEdit(devis)}
                className="bg-yellow-500 text-white px-2 py-1 rounded"
              >
                Modifier
              </button>
              <button
                onClick={() => onDelete(devis.id)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Supprimer
              </button>
              <button
                onClick={() => onDownloadPdf(devis)}
                    title="Télécharger le PDF"
                    className="text-blue-600 hover:underline"
              >
                PDF
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DevisTable;
