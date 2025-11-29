import { Navigate } from "react-router";
import { useUser } from "../provider/userProvider";

export default function ProtectedRoute({ children }) {
    const { user } = useUser();

    if (!user) {
        return <Navigate to="/auth/login" replace />;
    }

    return children;
}
