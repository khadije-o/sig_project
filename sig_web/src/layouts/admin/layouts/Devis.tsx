import { useNavigate } from "react-router-dom";
import FournisseurContainer from "./FournisseurContainer";

const Devis = () => {
  const navigate = useNavigate();

  const handleVoirDevis = () => {
    navigate("/mes-devis");
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "20px" }}>
        <button onClick={handleVoirDevis}>
          <i className="fas fa-file"></i> Liste devis
        </button>
      </div>
      <FournisseurContainer />
    </div>
  );
};

export default Devis;
