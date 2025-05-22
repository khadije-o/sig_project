import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { DevisGlobal } from "../../types/devisTypes";
import useAuth from "../../hooks/useAuth";
import { createBonCommande, fetchDevisById } from "../../services/devisService";
import { useNavigate, useParams } from "react-router-dom";
import '../Devis/DevisDetail.css'

const DevisDetail: React.FC = () => {
  const { authTokens } = useAuth();
  const { id } = useParams<{ id: string }>();
  const [numeroBon, setNumeroBon] = useState("");
  const [devis, setDevis] = useState<DevisGlobal | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      setLoading(true);
      fetchDevisById(parseInt(id), authTokens!.access)
        .then((data) => setDevis(data))
        .catch(() => {
          Swal.fire({
            icon: "error",
            title: "Erreur",
            text: "Impossible de récupérer les détails du devis.",
          });
          navigate(-1);
        })
        .finally(() => setLoading(false));
    }
  }, [id, authTokens, navigate]);

  if (loading) return <div>Chargement...</div>;
  if (!devis) return <div>Devis non trouvé</div>;

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
      setNumeroBon("");
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
            detail ||
            "Une erreur est survenue lors de la création du bon de commande.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

   return (
      <>
      <div className="pageWrapper">
      <button onClick={() => navigate(-1)} className="backButton">
        <i className="fas fa-arrow-left" aria-hidden="true"></i> 
      </button>
      <div className="container">
      <h2 className="title">Détails du devis {devis.numero}</h2>

      <div className="infoGrid">
        <div>
          <span className="sectionTitle">Informations Fournisseur:</span>
          <p><strong>Fournisseur :</strong> {devis.fournisseur.nom_entreprise}</p>
          <p><strong>Email :</strong> {devis.fournisseur.email}</p>
          <p><strong>Téléphone :</strong> {devis.fournisseur.telephone}</p>
          <p><strong>NIF :</strong> {devis.fournisseur.nif}</p>
          <p><strong>RC :</strong> {devis.fournisseur.rc}</p>
          <p><strong>Compte bancaire :</strong> {devis.fournisseur.compte_bancaire}</p>
        </div>
      </div>

      <h3 className="lignesDevisTitle">Lignes de devis</h3>
      <div className="tableContainer">
        <table className="table">
          <thead>
            <tr>
            <th className="table-header">Désignation</th>
            <th className="table-header">Quantité</th>
            <th className="table-header">Prix unitaire</th>
            <th className="table-header">Prix total</th>
          </tr>
          </thead>
          <tbody>
            {devis.lignes.map((ligne) => {
              const designationNom =
                typeof ligne.designation === "object"
                  ? ligne.designation.nom
                  : `ID: ${ligne.designation}`;
              return (
                <tr key={ligne.id}>
                  <td>{designationNom}</td>
                  <td>{ligne.quantite}</td>
                  <td>{ligne.prix_unitaire} DA</td>
                  <td>{ligne.prix_total} DA</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="totals">
        <div className="totalsRow">
          <span>Total HT :</span>
          <span>{devis.total_ht} DA</span>
        </div>
        <div className="totalsRow">
          <span>TVA ({devis.tva}%) :</span>
          <span>{devis.montant_tva} DA</span>
        </div>
        <div className="totalsRow bold">
          <span>Total TTC :</span>
          <span>{devis.total_ttc} DA</span>
        </div>
      </div>

      <div className="inputGroup">
        <label className="inputLabel" htmlFor="numeroBon">
          Numéro du Bon de Commande :
        </label>
        <input
          id="numeroBon"
          type="text"
          value={numeroBon}
          onChange={(e) => setNumeroBon(e.target.value)}
          placeholder="Numéro du Bon de Commande"
          className="textInput"
        />
      </div>

      <div className="buttonGroup">
        <button
          onClick={handleCreateBonCommande}
          disabled={loading || !numeroBon.trim()}
          className="primaryButton"
        >
          {loading ? "Création..." : "Créer Bon de Commande"}
        </button>
      </div>
    </div>
</div>
</>
    
  );
};

export default DevisDetail;