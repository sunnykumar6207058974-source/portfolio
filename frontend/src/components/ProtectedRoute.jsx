import { useAuth } from "../context/AuthContext";
import AdminLoginModal from "./AdminLoginModal";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-cyan-400 font-bold">
        Verifying Session & JWT Tokens...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLoginModal />;
  }

  return children;
};

export default ProtectedRoute;
