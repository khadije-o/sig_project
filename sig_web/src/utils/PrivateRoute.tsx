import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

// Empêcher d'accéder aux routes sans être connecté
const PrivateRoute = () => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    // AuthContext est null — normalement, ça ne devrait jamais arriver
    return <Navigate to="/login" replace />;
  }

  const { user } = authContext;

  // Si pas d'utilisateur => Redirection vers login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Sinon, afficher la route protégée
  return <Outlet />;
};

export default PrivateRoute;
