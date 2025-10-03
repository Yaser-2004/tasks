import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  // If no token → redirect to login page (landing)
  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children;
}
