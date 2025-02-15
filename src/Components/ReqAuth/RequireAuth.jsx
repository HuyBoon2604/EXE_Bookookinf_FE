import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { jwtDecode } from "jwt-decode";

const RequireAuth = ({ allowedRoles }) => {
    const { auth } = useAuth();
    const token = window.localStorage.getItem("Authen");
    const location = useLocation();

    let roleId;

    // Check if the token exists and decode it
    if (token) {
        try {
            const decodedToken = jwtDecode(token);
            roleId = decodedToken.RoleID;
        } catch (error) {
            console.error("Token decoding failed:", error);
            // Optionally, you can redirect to login or unauthorized page here
            return <Navigate to="/unauthorized" state={{ from: location }} replace />;
        }
    }

    // Check if the user is authenticated and has the required role
    return (
        token && allowedRoles?.includes(roleId)
            ? <Outlet />
            : <Navigate to="/unauthorized" state={{ from: location }} replace />
    );
};

export default RequireAuth;