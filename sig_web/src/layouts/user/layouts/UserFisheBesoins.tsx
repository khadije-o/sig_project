
import { useContext } from "react";
import FicheForm from "../../../components/FicheForm";
import FicheDuJour from "../../../components/FicheJour";
import AuthContext from "../../../context/AuthContext";
const FisheBesoinsUser = () => {
  const { user } = useContext(AuthContext);

  return (
    <div>
      <div style={{
        backgroundColor: '#f8f9fa',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '30px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ color: '#2c3e50', marginBottom: '10px' }}>
          Bonjour <span style={{ color: '#098163' }}>{user?.first_name}</span> !
        </h2>
      </div>
      
          <FicheForm />
          {/* <FicheJourUser/> */}
          <FicheDuJour/>

  </div>
  );
};
export default FisheBesoinsUser;