import './App.css';
import 'font-awesome/css/font-awesome.min.css';

import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import PrivateRoute from "./utils/PrivateRoute";
import { AuthProvider } from './context/AuthContext';

import Registerpage from './components/RegisterPage';
import Loginpage from './components/LoginPage';
import FicheForm from './components/FicheForm';
import FicheDuJour from './components/FicheJour';
import DownloadPdfButton from './components/DownloadPdfButton';
import AppNavbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Homepage from './components/HomePage';

function AppContent() {
  const location = useLocation();

  // On cache la navbar sur login et register
  const hideNavbar = location.pathname === "/login" || location.pathname === "/register";

  return (
    <>
      {!hideNavbar && <AppNavbar />}

      <Routes>
        {/* Auth Pages */}
        <Route path="/login" element={<Loginpage />} />
        <Route path="/register" element={<Registerpage />} />

        {/* Routes protégées */}
        <Route element={<PrivateRoute />}>
          <Route
            path="/ficheform"
            element={
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
            }
          />
        </Route>

        <Route path="/generatefiles/fichebesoin" element={<FicheForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/homepage" element={<Homepage />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
