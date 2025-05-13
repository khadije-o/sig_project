
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

import Registerpage from './components/RegisterPage';
import Loginpage from './components/LoginPage';

import Main from './main/Main';
import Products from './layoutsA/Products';
import Homepage from './components/HomePage';
import Designation from './layouts/admin/layouts/Designation';
import BonDeComnd from './layouts/admin/layouts/BonDeComnd';
import Virement from './layouts/admin/layouts/Virement';
import SideBarRouter from './components/SideBarRouter';
import FisheBesoinsAdmin from './layouts/admin/layouts/AdminFisheBesoins';
import FisheBesoinsUser from './layouts/user/layouts/UserFisheBesoins';
import Devis from './layouts/admin/layouts/Devis';
import Consolidation from './layouts/admin/layouts/Consolidation';
import GroupFicheBesoins from './layouts/admin/layouts/GroupFicheBesoins';
import GestionUsers from './layouts/admin/layouts/GestionUsers';
import FournisseurContainer from './layouts/admin/layouts/FournisseurContainer';


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
          <Route path="/designation" element={<Designation />} />
          <Route path="/consolidation" element={<Consolidation />} />
          <Route path="/bondecomnd" element={<BonDeComnd />} />
          <Route path="/virement" element={<Virement />} />
          <Route path="/devis" element={<Devis />} />
          <Route path="/groupfichebesoins" element={<GroupFicheBesoins />} />
          <Route path="/gestionusers" element={<GestionUsers />} />
          <Route path="/products" element={<Products />} />
          <Route path="/homepage" element={<Homepage />} />
          <Route path="/fournisseur" element={<FournisseurContainer />} />
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