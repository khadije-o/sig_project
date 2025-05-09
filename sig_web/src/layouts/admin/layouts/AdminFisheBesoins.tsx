import DownloadPdfButton from "../../../components/DownloadPdfButton";
import FicheForm from "../../../components/FicheForm";
import FicheDuJour from "../../../components/FicheJour";

const FisheBesoinsAdmin = () => {
  return <div>
          <FicheForm />
          <FicheDuJour />
          <DownloadPdfButton 
            url="http://localhost:8000/fiches_besoin/pdf_fiche/" 
            filename="fiche_besoin_admin.pdf" 
            label="Télécharger la fiche PDF"
          />

  </div>;
};

export default FisheBesoinsAdmin;
