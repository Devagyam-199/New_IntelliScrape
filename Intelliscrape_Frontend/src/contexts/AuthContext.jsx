import { useState, useEffect, createContext } from "react";
import api from "../utils/axiosApiInterceptor.js";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const authFetch = async () => {
      try {
        const res = await api.post("/auth/protected");
        setUser(res.data.user);
        console.log(user)
      } catch (error) {
        setUser(null);
        console.log(error)
      } finally {
        setLoading(false);
      }
    };
    authFetch();
  }, []);

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout API error:", error);
    }
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