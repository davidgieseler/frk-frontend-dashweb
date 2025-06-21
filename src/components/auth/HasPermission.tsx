// src/components/auth/HasPermission.tsx

import { ReactNode, FC } from 'react';
import useUI from '../../hooks/useUI'; // Verifique o caminho

interface HasPermissionProps {
    name: string; // O nome da permissão (ex: "btn-add-user")
    children: ReactNode;
}

const HasPermission: FC<HasPermissionProps> = ({ name, children }) => {
    const { hasAccess, loading } = useUI();

    // Não renderiza nada enquanto as permissões estão carregando
    if (loading) {
        return null;
    }

    // Se tem acesso, renderiza os filhos. Senão, não renderiza nada.
    return hasAccess(name) ? <>{children}</> : null;
};

export default HasPermission;