import React from "react";
import { useParams } from "react-router-dom";
import BonCommandeDetail from "../components/BonDeCommande/BonCommandeDetail";


const BonCommandeDetailWrapper: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  console.log("BACKGROUND", window.getComputedStyle(document.body).backgroundColor);

    const el = document.getElementById("root");
  if (el) {
    console.log("ROOT BG:", window.getComputedStyle(el).backgroundColor);
  }


  if (!id) return <p>ID invalide</p>;

  return <BonCommandeDetail bonCommandeId={parseInt(id)} />;
};

export default BonCommandeDetailWrapper;
