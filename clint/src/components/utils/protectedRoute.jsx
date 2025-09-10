import { Navigate } from "react-router-dom";
import { getUserRole } from "../Role Protection/auth"; // <-- Corrected path

export default function ProtectedRoute({ children, role }) {
    const userRole = getUserRole();
    if (!userRole) return <Navigate to="/login" />;
    if (role && userRole !== role) return <Navigate to="/dashboard" />;
    return children;
}