import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { BonCommande } from "../../types/devisTypes";
import { downloadBonCommandePdf, getBonCommandes } from "../../services/bonCommandeService";
const BonCommandeList: React.FC = () => {
  const [bonCommandes, setBonCommandes] = useState<BonCommande[]>([]);
  const { authTokens } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const data = await getBonCommandes(authTokens!.access);
      setBonCommandes(data);
    };
    fetchData();
  }, [authTokens]);

  const handleDownloadPdf = async (id: number) => {
    try {
      await downloadBonCommandePdf(id, authTokens!.access);
    } catch (error) {
      alert("Erreur lors du téléchargement du PDF");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Liste des Bons de Commande</h1>
      <table className="min-w-full border rounded text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 border">Numéro</th>
            <th className="px-4 py-2 border">Date</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {bonCommandes.map((bon) => (
            <tr key={bon.id} className="border-t">
              <td className="px-4 py-2 border">{bon.numero_bon}</td>
              <td className="px-4 py-2 border">{bon.date_bon}</td>
              <td className="px-4 py-2 border space-x-2">
                <button
                  onClick={() => navigate(`/boncommande/${bon.id}`)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                >
                  Voir détails
                </button>
                <button
                  onClick={() => handleDownloadPdf(bon.id)}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                >
                  Exporter PDF
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BonCommandeList;
