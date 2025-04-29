import axios from "axios";
import { jwtDecode } from "jwt-decode";
import dayjs from "dayjs";
import { useContext } from "react";
import AuthContext, { AuthContextType } from "../context/AuthContext";


const baseURL = "http://127.0.0.1:8000/users";

// Gérer automatiquement le rafraîchissement des tokens JWT expirés.
const useAxios = () => {
  const { authTokens, setUser, setAuthTokens } = useContext(AuthContext) as AuthContextType;

  const axiosInstance = axios.create({
    baseURL,
    headers: { Authorization: `Bearer ${authTokens?.access}` },
  });

  axiosInstance.interceptors.request.use(async (req) => {
    if (!authTokens) {
      return req;
    }

    interface JwtPayload {
      exp: number;
      [key: string]: any;
    }

    const user = jwtDecode<JwtPayload>(authTokens.access);
    const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;

    if (!isExpired) return req;

    try {
      const response = await axios.post(`${baseURL}/token/refresh/`, {
        refresh: authTokens.refresh,
      });

      localStorage.setItem("authTokens", JSON.stringify(response.data));
      setAuthTokens(response.data);
      setUser(jwtDecode(response.data.access));

      req.headers.Authorization = `Bearer ${response.data.access}`;
      return req;
    } catch (error) {
      console.error("Token refresh failed:", error);
      return Promise.reject(error);
    }
  });

  return axiosInstance;
};

export default useAxios;
