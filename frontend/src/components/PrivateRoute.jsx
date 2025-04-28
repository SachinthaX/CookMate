import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { isTokenValid } from "../utils/auth";

const PrivateRoute = ({ children }) => {
  const { token } = useAuth();
  return token && isTokenValid() ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
