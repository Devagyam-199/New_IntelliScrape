import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import LoadingScreen from "./loadingScreen";

const ProtectRoutes = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  
  if (loading) {
    return <LoadingScreen loading={loading} />;
  }

  return user ? children : <Navigate to="/login" replace />;

};

export default ProtectRoutes;
