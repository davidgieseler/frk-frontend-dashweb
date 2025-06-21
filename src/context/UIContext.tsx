// src/context/UIContext.tsx

import {
    createContext,
    useState,
    useEffect,
    useCallback,
    ReactNode,
    FC
} from 'react';
import apiClient from '../api/axios';
import useAuth from '../hooks/useAuth';
import { AccessObject } from '../interfaces/api';

// A "forma" do nosso contexto
interface UIContextType {
    uiObjects: AccessObject[];
    loading: boolean;
    hasAccess: (objectName: string) => boolean;
    refreshUI: () => void;
}

// O Contexto em si, devidamente tipado
const UIContext = createContext<UIContextType | null>(null);

// As props do nosso Provider
interface UIProviderProps {
    children: ReactNode;
}

// O Componente Provider
export const UIProvider: FC<UIProviderProps> = ({ children }) => {
    const [uiObjects, setUiObjects] = useState<AccessObject[]>([]);
    const [loading, setLoading] = useState(true);
    const { isAuthenticated } = useAuth(); // Depende do AuthContext

    const fetchUiObjects = useCallback(async () => {
        if (isAuthenticated) { // Só busca se o usuário estiver logado
            try {
                setLoading(true);
                const response = await apiClient.get<AccessObject[]>('/ui/access-objects/');
                setUiObjects(response.data);
            } catch (error) {
                console.error("UIContext: Falha ao buscar objetos da UI:", error);
                setUiObjects([]);
            } finally {
                setLoading(false);
            }
        } else {
            setUiObjects([]); // Garante que as permissões sejam limpas no logout
            setLoading(false);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        fetchUiObjects();
    }, [fetchUiObjects]);

    const hasAccess = (objectName: string): boolean => {
        return uiObjects.some(obj => obj.name === objectName);
    };

    const uiContextValue: UIContextType = {
        uiObjects,
        loading,
        hasAccess,
        refreshUI: fetchUiObjects,
    };

    return (
        <UIContext.Provider value={uiContextValue}>
            {children}
        </UIContext.Provider>
    );
};

export default UIContext;