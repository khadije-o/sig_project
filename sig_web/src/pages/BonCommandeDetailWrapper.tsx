import React from "react";
import { useParams } from "react-router-dom";
import BonCommandeDetail from "../components/BonDeCommande/BonCommandeDetail";


const BonCommandeDetailWrapper: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  if (!id) return <p>ID invalide</p>;

  return <BonCommandeDetail bonCommandeId={parseInt(id)} />;
};

export default BonCommandeDetailWrapper;
