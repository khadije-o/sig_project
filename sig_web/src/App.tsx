
import './App.css';
import 'font-awesome/css/font-awesome.min.css';

import { Fragment, useContext, useEffect, useState } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate
} from 'react-router-dom';

import AuthContext, { AuthProvider } from './context/AuthContext';

import Registerpage from './pages/RegisterPage';
import Loginpage from './pages/LoginPage';

import Main from './main/Main';
import Virement from './layouts/admin/layouts/Virement';
import SideBarRouter from './components/SideBarRouter';
import FisheBesoinsAdmin from './layouts/admin/layouts/AdminFisheBesoins';
import FisheBesoinsUser from './layouts/user/layouts/UserFisheBesoins';
import Devis from './pages/Devis';
import GroupFicheBesoins from './layouts/admin/layouts/GroupFicheBesoins';
import GestionUsers from './layouts/admin/layouts/GestionUsers';
import MesDevis from './components/Devis/MesDevis';
import MesProfils from './components/MesProfils';
import DesignationPage from './pages/Designation/DesignationPage';
import ConsolidationPage from './pages/ConsolidationPage';
import FournisseurContainer from './components/Fournisseur/FournisseurContainer';
import BonCommandeList from './components/BonDeCommande/BonCommandeList';
import BonCommandeDetail from './components/BonDeCommande/BonCommandeDetail';
import BonCommandeDetailWrapper from './pages/BonCommandeDetailWrapper';


function AppContent() {
  const location = useLocation();
  const [isLeftSidebarCollapsed, setIsLeftSidebarCollapsed] = useState(false);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const authContext = useContext(AuthContext);

  useEffect(() => {
    const updateSize = () => {
      setScreenWidth(window.innerWidth);
      if (window.innerWidth < 768) {
        setIsLeftSidebarCollapsed(true);
      }
    };
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const hideSidebar = location.pathname === '/login' || location.pathname === '/register';

  return (
    <Fragment>
      {!hideSidebar && (
      <SideBarRouter
        isLeftSidebarCollapsed={isLeftSidebarCollapsed}
        setIsLeftSidebarCollapsed={setIsLeftSidebarCollapsed}
      />
    )}


      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Loginpage />} />
        <Route path="/register" element={<Registerpage />} />
        <Route
          element={
            <Main
              screenWidth={screenWidth}
              isLeftSidebarCollapsed={isLeftSidebarCollapsed}
            />
          }
        >
          <Route path="/fishebesoinsAdmin" element={<FisheBesoinsAdmin />} />
          <Route path="/fishebesoinsUser" element={<FisheBesoinsUser />} />
          <Route path="/designation" element={<DesignationPage />} />
          <Route path="/consolidation" element={<ConsolidationPage />} />
          <Route path="/bondecomnd" element={<BonCommandeList />} />
          <Route path="/virement" element={<Virement />} />
          <Route path="/devis" element={<Devis />} />
          <Route path="/groupfichebesoins" element={<GroupFicheBesoins />} />
          <Route path="/gestionusers" element={<GestionUsers />} />
          <Route path="/fournisseur" element={<FournisseurContainer />} />
          <Route path="/mes-devis" element={<MesDevis />} />
          <Route path="/boncommande/:id" element={<BonCommandeDetailWrapper />}/>
          <Route path="/mes-profils" element={<MesProfils />} />
          
        </Route>
      </Routes>
    </Fragment>
  );
}
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;