
import { useContext } from "react";
import AuthContext from "../../../context/AuthContext";
import FicheForm from "../../../components/FicheForm/FicheForm";
import FicheDuJour from "../../../components/FicheDuJour/FicheDuJour";
import { useNavigate } from "react-router-dom";

const FisheBesoinsUser = () => {
  // const { user } = useContext(AuthContext);

  // return (
  //   <div>
  //     <div style={{
  //       backgroundColor: '#f8f9fa',
  //       padding: '20px',
  //       borderRadius: '8px',
  //       marginBottom: '30px',
  //       boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  //     }}>
  //       <h2 style={{ color: '#2c3e50', marginBottom: '10px' }}>
  //         Bonjour <span style={{ color: '#098163' }}>{user?.first_name}</span> !
  //       </h2>
  //     </div>
      
  //         <FicheForm />
  //         <FicheDuJour/>

  // </div>
  // );


   const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const handleVoirDevis = () => {
    navigate("/mes-profils");
  };

  return (
    <div>
      {/* En-tête avec Bonjour à gauche et bouton Profils à droite */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#f8f9fa',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '30px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}
      >
        {/* Bonjour à gauche */}
        <h2 style={{ color: '#2c3e50', margin: 0 }}>
          Bonjour <span style={{ color: '#098163' }}>{user?.first_name}</span> !
        </h2>

        {/* Bouton Profils à droite */}
        <button
          onClick={handleVoirDevis}
          style={{
            backgroundColor: "#098163",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          <i className="fas fa-user-shield" style={{ marginRight: "8px" }}></i> Profil
        </button>
      </div>

      {/* Contenu principal */}
      <FicheForm />
      <FicheDuJour />
    </div>
  );
};
export default FisheBesoinsUser;