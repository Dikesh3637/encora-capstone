import { Navigate } from "react-router";
import { useUser } from "../provider/userProvider";

function ProtectedRoute({ adminOnly = false, children }) {
  const { user, isLoading } = useUser();

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  if (adminOnly && user.roles.includes("ADMIN") === false) {
    return <Navigate to="/" replace />;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return children;
}

export default ProtectedRoute;
