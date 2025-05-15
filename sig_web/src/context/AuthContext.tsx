


import { createContext, useState, useEffect, ReactNode } from "react"; 
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

interface AuthTokens {
  access: string;
  refresh: string;
}

interface JwtPayload {
  exp: number;
  [key: string]: any;
}

interface AuthContextType { 
  user: any;
  setUser: (user: any) => void;
  authTokens: AuthTokens | null;
  setAuthTokens: (tokens: AuthTokens | null) => void;
  registerUser: (email: string, first_name: string, last_name: string, password: string, password2: string) => Promise<void>;
  loginUser: (email: string, password: string) => Promise<void>;
  logoutUser: () => void;
}

const defaultContextValue: AuthContextType = {
  user: null,
  setUser: () => {},
  authTokens: null,
  setAuthTokens: () => {},
  registerUser: async () => {},
  loginUser: async () => {},
  logoutUser: () => {},
};

const AuthContext = createContext<AuthContextType>(defaultContextValue);

export default AuthContext;

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [authTokens, setAuthTokens] = useState<AuthTokens | null>(() => {
    const tokens = localStorage.getItem("authTokens");
    return tokens ? JSON.parse(tokens) : null;
  });

  const [user, setUser] = useState<any>(() => {
    const tokens = localStorage.getItem("authTokens");
    return tokens ? jwtDecode<JwtPayload>(JSON.parse(tokens).access) : null;
  });

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fonction pour rafraîchir le token
  const refreshToken = async () => {
    try {
      if (!authTokens?.refresh) {
        logoutUser();
        return;
      }

      const response = await fetch("http://127.0.0.1:8000/users/token/refresh/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ refresh: authTokens.refresh })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }

      const newTokens = {
        access: data.access,
        refresh: data.refresh  // Mets à jour avec le nouveau refresh token
      };

      setAuthTokens(newTokens);
      setUser(jwtDecode<JwtPayload>(newTokens.access));
      localStorage.setItem("authTokens", JSON.stringify(newTokens));
      return true;
    } catch (error) {
      logoutUser();
      return false;
    }
  };

  // Vérifie et rafraîchit le token si nécessaire
  const verifyRefreshToken = async () => {
    if (!authTokens) return;

    // Vérifie si le refresh token est expiré
    const refreshTokenExp = jwtDecode<JwtPayload>(authTokens.refresh).exp * 1000;
    if (refreshTokenExp < Date.now()) {
      logoutUser();
      return false;
    }

    // Vérifie si le access token est expiré ou va bientôt expirer
    const accessTokenExp = jwtDecode<JwtPayload>(authTokens.access).exp * 1000;
    if (accessTokenExp < Date.now() + 1000 * 60 * 5) { // 5 minutes avant expiration
      return await refreshToken();
    }

    return true;
  };

  // Intervalle pour vérifier le token
  useEffect(() => {
    if (loading) return;

    const interval = setInterval(async () => {
      await verifyRefreshToken();
    }, 1000 * 60 * 4); // Toutes les 4 minutes

    return () => clearInterval(interval);
  }, [authTokens, loading]);

  // Vérification initiale au chargement
  useEffect(() => {
    const initializeAuth = async () => {
      if (authTokens) {
        const isValid = await verifyRefreshToken();
        if (!isValid) {
          logoutUser();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const loginUser = async (email: string, password: string) => {
    const response = await fetch("http://127.0.0.1:8000/users/token/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });
  
    const data = await response.json();
  
    if (response.status === 200) {
      const decodedUser = jwtDecode<JwtPayload>(data.access);
  
      setAuthTokens(data);
      setUser(decodedUser);
      localStorage.setItem("authTokens", JSON.stringify(data));
  
      if (decodedUser.is_staff) {
        navigate("/fishebesoinsAdmin");
      } else {
        navigate("/fishebesoinsUser");
      }
      
      Swal.fire({
        title: "Login Successful",
        icon: "success",
        toast: true,
        timer: 3000,
        position: "top-end",
        timerProgressBar: true,
        showConfirmButton: false,
      });
    } else {
      Swal.fire({
        title: "Username or password incorrect",
        icon: "error",
        toast: true,
        timer: 3000,
        position: "top-end",
        timerProgressBar: true,
        showConfirmButton: false,
      });
    }
  };

  const registerUser = async (email: string, first_name: string, last_name: string, password: string, password2: string) => {
    const response = await fetch("http://127.0.0.1:8000/users/register/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, first_name, last_name, password, password2 })
    });

    if (response.status === 201) {
      navigate("/login");
      Swal.fire({
        title: "Registration Successful, Please Login",
        icon: "success",
        toast: true,
        timer: 3000,
        position: "top-end",
        timerProgressBar: true,
        showConfirmButton: false,
      });
    } else {
      Swal.fire({
        title: "Error during registration",
        icon: "error",
        toast: true,
        timer: 3000,
        position: "top-end",
        timerProgressBar: true,
        showConfirmButton: false,
      });
    }
  };

  const logoutUser = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem("authTokens");
    navigate("/login");
    Swal.fire({
      title: "You have been logged out",
      icon: "success",
      toast: true,
      timer: 3000,
      position: "top-end",
      timerProgressBar: true,
      showConfirmButton: false,
    });
  };

  const contextData: AuthContextType = {
    user,
    setUser,
    authTokens,
    setAuthTokens,
    registerUser,
    loginUser,
    logoutUser,
  };

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};

export type { AuthContextType };