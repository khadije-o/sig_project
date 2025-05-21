import React, { useEffect, useState } from "react";
import { getBonCommandeById } from "../../services/bonCommandeService";
import { BonCommande, DevisLigne } from "../../types/devisTypes";
import useAuth from "../../hooks/useAuth";

interface BonCommandeDetailProps {
  bonCommandeId: number;
}

const BonCommandeDetail: React.FC<BonCommandeDetailProps> = ({ bonCommandeId }) => {
  const [bonCommande, setBonCommande] = useState<BonCommande | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
   const { authTokens } = useAuth();

  useEffect(() => {
    const fetchBonCommande = async () => {
      try {
        setLoading(true);
        const data = await  getBonCommandeById(bonCommandeId, authTokens!.access);
        setBonCommande(data);
      } catch (err) {
        setError("Erreur lors du chargement du bon de commande.");
      } finally {
        setLoading(false);
      }
    };

    fetchBonCommande();
  }, [bonCommandeId]);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!bonCommande) return <p>Bon de commande introuvable.</p>;

  const { numero_bon, date_bon, devis } = bonCommande;
  const { fournisseur, lignes, total_ht, tva, montant_tva, total_ttc } = devis;

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-4">BON DE COMMANDE</h1>
      <div className="flex justify-between mb-6 text-lg font-semibold">
        <span>N° : {numero_bon}</span>
        <span>Date : {new Date(date_bon).toLocaleDateString("fr-FR")}</span>
      </div>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Coordonnées du fournisseur :</h2>
        <p><strong>Nom de l’entreprise :</strong> {fournisseur.nom_entreprise}</p>
        <p><strong>NIF :</strong> {fournisseur.nif}</p>
        <p><strong>RC :</strong> {fournisseur.rc}</p>
        <p><strong>Compte bancaire :</strong> {fournisseur.compte_bancaire}</p>
        <p><strong>Téléphone :</strong> {fournisseur.telephone}</p>
        <p><strong>Email :</strong> {fournisseur.email}</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Détails de la commande :</h2>
        <table className="w-full border-collapse border border-gray-300 mb-6 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-2 py-1 text-left">Items</th>
              <th className="border border-gray-300 px-2 py-1 text-left">Désignation</th>
              <th className="border border-gray-300 px-2 py-1 text-right">Qté</th>
              <th className="border border-gray-300 px-2 py-1 text-right">Prix unitaire</th>
              <th className="border border-gray-300 px-2 py-1 text-right">Total HT</th>
            </tr>
          </thead>
          <tbody>
            {lignes.map((ligne: DevisLigne, index: number) => {
              const designation =
                typeof ligne.designation === "object"
                  ? ligne.designation.nom
                  : `ID: ${ligne.designation}`;

              return (
                <tr key={ligne.id} className="border-t border-gray-300">
                  <td className="border border-gray-300 px-2 py-1">{index + 1}</td>
                  <td className="border border-gray-300 px-2 py-1">{designation}</td>
                  <td className="border border-gray-300 px-2 py-1 text-right">{ligne.quantite}</td>
                  <td className="border border-gray-300 px-2 py-1 text-right">
                    {ligne.prix_unitaire.toLocaleString()} DA
                  </td>
                  <td className="border border-gray-300 px-2 py-1 text-right">
                    {ligne.prix_total.toLocaleString()} DA
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="text-right max-w-xs ml-auto space-y-1 text-gray-800 font-semibold">
          <p>Sous-total HT : {total_ht.toLocaleString()} DA</p>
          <p>TVA ({tva}%) : {montant_tva.toLocaleString()} DA</p>
          <p className="text-lg font-bold">Total TTC : {total_ttc.toLocaleString()} DA</p>
        </div>
      </section>
    </div>
  );
};

export default BonCommandeDetail;
