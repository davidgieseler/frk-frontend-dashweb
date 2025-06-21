import { ReactNode, FC } from 'react'; // 1. Importe os tipos necessários
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

// 2. Defina a interface para as props do componente
interface ProtectedRouteProps {
    children: ReactNode;
}

// 3. Aplique a tipagem ao seu componente usando React.FC
const ProtectedRoute: FC<ProtectedRouteProps> = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        // Mostra um spinner ou tela de carregamento enquanto valida o token
        return <div>Carregando...</div>;
    }

    if (!isAuthenticated) {
        // Redireciona para a página de login se não estiver autenticado
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Agora o TypeScript sabe que 'children' é um ReactNode válido para ser retornado
    return children;
};

export default ProtectedRoute;