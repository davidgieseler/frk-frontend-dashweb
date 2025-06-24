import { ReactNode, FC } from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

interface RedirectIfAuthProps {
    children: ReactNode;
}

/**
 * Este componente verifica se o usuário JÁ ESTÁ autenticado.
 * Se estiver, redireciona para a página '/home'.
 * Se NÃO estiver, renderiza o componente filho (ex: a página de login).
 */
const RedirectIfAuth: FC<RedirectIfAuthProps> = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    // Enquanto o estado de autenticação carrega, não fazemos nada para evitar um "piscar" de tela
    if (loading) {
        return <div>Carregando...</div>;
    }

    // Se o usuário está autenticado, redireciona para a home
    if (isAuthenticated) {
        return <Navigate to="/home" replace />;
    }

    // Se não está autenticado, permite o acesso à página
    return <>{children}</>;
};

export default RedirectIfAuth;