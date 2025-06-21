import React, { createContext, useState, useEffect, ReactNode } from 'react';
import apiClient from '../api/axios';
import { LoginStep1Response, AuthTokens } from '../interfaces/api';

// 1. Definir a interface para o valor do contexto
interface AuthContextType {
    isAuthenticated: boolean;
    loading: boolean;
    loginStep1: (username: string, password: string) => Promise<LoginStep1Response>;
    loginStep2: (userId: number, organizationId: number) => Promise<void>;
    logout: () => void;
}

// 2. Criar o contexto com o tipo e um valor padrão
const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            setIsAuthenticated(true);
        }
        setLoading(false);
    }, []);

    const loginStep1 = async (username: string, password: string): Promise<LoginStep1Response> => {
        const response = await apiClient.post<LoginStep1Response>('/login/', { username, password });
        return response.data;
    };

    const loginStep2 = async (userId: number, organizationId: number): Promise<void> => {
        const response = await apiClient.post<AuthTokens>('/login/select-organization/', {
            user_id: userId,
            organization_id: organizationId,
        });

        const { access, refresh } = response.data;
        localStorage.setItem('accessToken', access);
        localStorage.setItem('refreshToken', refresh);
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setIsAuthenticated(false);
    };

    const authContextValue: AuthContextType = {
        isAuthenticated,
        loading,
        loginStep1,
        loginStep2,
        logout,
    };

    return (
        <AuthContext.Provider value={authContextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;