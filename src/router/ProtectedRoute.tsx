import {FC, useContext} from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import UIContext from "../context/UIContext.tsx"; // Precisamos do useUI para checar as permissões

interface ProtectedRouteProps {
    requiredHref: string;
    children: React.ReactNode;
}

const ProtectedRoute: FC<ProtectedRouteProps> = ({ requiredHref, children }) => {
    const { isAuthenticated, loading: authLoading } = useAuth();
    const ui = useContext(UIContext);
    const location = useLocation();

    if (authLoading || ui?.loading) return <div>Carregando permissões...</div>;

    const accessAllowed = ui?.uiObjects?.some(
        (obj) => obj.type === "MENU" && obj.metadata?.href === requiredHref
    );

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (!accessAllowed) {
        return <Navigate to="/403" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;