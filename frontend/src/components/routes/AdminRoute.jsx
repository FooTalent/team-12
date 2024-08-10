import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth"; // Ajusta la ruta según la estructura de tu proyecto

export function AdminRoute({ children }) {
  const { tokenExist, isAdmin } = useAuth();

  if (!tokenExist || !isAdmin) {
    return <Navigate to="/inicio" replace />;
  }

  return children;
}

AdminRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
