import { createContext, useState, useEffect, ReactNode } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import LeftSidebar from "../left-sidebar/UserLeftSidebar";

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

const AuthContext = createContext<AuthContextType | null>(null);

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

  useEffect(() => {
    if (authTokens) {
      setUser(jwtDecode<JwtPayload>(authTokens.access));
    }
    setLoading(false);
  }, [authTokens]);



  return (
    <AuthContext.Provider value={contextData}>
      {loading ? null : children}
      
      
    </AuthContext.Provider>
    
  );
};

export type { AuthContextType };
