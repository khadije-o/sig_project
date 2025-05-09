import DownloadPdfButton from "../../../components/DownloadPdfButton";
import FicheForm from "../../../components/FicheForm";
import FicheDuJour from "../../../components/FicheJour";
const FisheBesoinsUser = () => {
  return <div>
    {/* <h2>Fiche de Besoin - Utilisateur</h2> */}
          <FicheForm />
          {/* <FicheJourUser/> */}
          <FicheDuJour/>
          <DownloadPdfButton 
            url="http://localhost:8000/fiches_besoin/pdf_fiche/" 
            filename="fiche_besoin_admin.pdf" 
            label="Télécharger la fiche PDF"
          />

  </div>;
};

export default FisheBesoinsUser;