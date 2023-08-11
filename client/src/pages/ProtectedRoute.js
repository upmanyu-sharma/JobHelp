import { useAppContext } from "../context/appContext";
import { Navigate } from "react-router-dom";
const ProtectedRoute = ({ children }) => {
  const { user } = useAppContext();

  if (!user) {
    return <Navigate to="/landing" />;
  }
  return children;
  //children means jo jo components es comp ke tag ke ander hai, eg jaise ek shared layout hmne likha hai ese
};
export default ProtectedRoute;
