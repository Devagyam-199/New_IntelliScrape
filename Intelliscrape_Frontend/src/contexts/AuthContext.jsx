import { useState, useEffect, createContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../utils/axiosApiInterceptor.js";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const publicRoutes = ["/login", "/signup"];
    if (publicRoutes.includes(location.pathname)) {
      setLoading(false);
      setUser(null);
      return;
    }

    const authFetch = async () => {
      try {
        const res = await api.post("/auth/protected");
        setUser(res.data.user);
      } catch (error) {
        console.error("Auth fetch error:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    authFetch();
  }, [location.pathname]);

  const logout = async () => {
    try {
      const logres = await api.post("/auth/logout");
      navigate("/login");
      console.log(logres.data);
    } catch (error) {
      console.error("Logout API error:", error);
    }
    console.log("logout fired");
    document.cookie = "accessToken=; Max-Age=0; path=/";
    document.cookie = "refreshToken=; Max-Age=0; path=/";
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
/* ===========================================================================
   Challenges Faced and Resolutions
   =========================================================================== 
   - Challenge: Communication between frontend and backend due to different method used post-get respectively
     - Resolution: Made sure both frontend and backend use same communication method i.e. put-put, get-get, post-post
   =========================================================================== */
