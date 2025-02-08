import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { jwtDecode } from "jwt-decode";

const RequireAuth = ({ allowedRoles }) => {
    const { auth } = useAuth();
    const x = window.localStorage.getItem("Authen");
    const location = useLocation();
    const decodetoken = jwtDecode(x);
  const roleId=decodetoken.RoleID;

    return (
        x && allowedRoles?.includes(roleId)
            ? <Outlet />
            : <Navigate to="/unauthorized" state={{ from: location }} replace />
        // x ? <Outlet/> : <Navigate to="/log-in" state={{ from: location }} replace />
    );
};

export default RequireAuth;
