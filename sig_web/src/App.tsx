import './App.css'
import 'font-awesome/css/font-awesome.min.css';
import FicheForm from './components/FicheForm'
import FicheDuJour from './components/FicheJour'
import DownloadPdfButton from './components/DownloadPdfButton';

function App() {

  return (
    <>
    <div className="sig-container">
    <h3>SIG_MPN</h3>
 
    <div className="ficheform">
      <FicheForm />
    </div>
    <div>
            <FicheDuJour />
        </div>

        <DownloadPdfButton 
                url="http://localhost:8000/generatefiles/pdf_fiche/"
                filename={`fiches_${new Date().toISOString().split('T')[0]}.pdf`}
                label="Exporter en PDF"
                className="btn-pdf"
            />

    </div>
    </>
  )
}

export default App
