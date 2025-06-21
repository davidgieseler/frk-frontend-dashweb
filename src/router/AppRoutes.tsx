import { BrowserRouter, Routes, Route, Outlet, Navigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import NotFoundPage from "../pages/NotFoundPage";
import LoginPage from "../pages/LoginPage";
import LanguageSelectorComponent from "../components/LanguageSelectorComponent";
import HomePage from "../pages/HomePage";
import Footer from "../components/Footer";
import ContactPage from "../pages/ContactPage";
import { DashboardMailDaily } from "../pages/DashboardMailDaily";

// --- Nossos imports de Lógica ---
import { AuthProvider } from '../context/AuthContext';
import { UIProvider } from '../context/UIContext';
import useAuth from "../hooks/useAuth";

// ===================================================================
// 1. Layouts (como você já tinha, sem alterações)
// ===================================================================

// Layout padrão (Com Navbar)
const DefaultLayout = () => (
    <div className="min-h-screen flex flex-col bg-[var(--background-color)] text-[var(--text-color)]">
        <Navbar />
        <main className="flex-grow flex items-center justify-center m-0.5 sm:m-3">
            <Outlet />
        </main>
        <LanguageSelectorComponent />
        <Footer />
    </div>
);

// Layout para páginas sem Navbar (LoginPage, NotFound)
const AuthLayout = () => (
    <div className="min-h-screen flex flex-col bg-[var(--background-color)] text-[var(--text-color)]">
        <main className="flex-grow flex items-center justify-center">
            <Outlet />
        </main>
        <LanguageSelectorComponent />
        <Footer />
    </div>
);

// ===================================================================
// 2. Novo "Layout Protetor" (O Porteiro)
//    Este componente substitui o nosso antigo 'ProtectedRoute.tsx'
//    e se integra perfeitamente com a lógica de layouts.
// ===================================================================
const ProtectedLayout = () => {
    const { isAuthenticated, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <div>Carregando...</div>; // Ou um componente de Spinner
    }

    if (!isAuthenticated) {
        // Redireciona para o login, guardando a página que o usuário tentou acessar
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    // Se o usuário estiver autenticado, ativa o UIProvider e renderiza a página protegida
    return (
        <UIProvider>
            <Outlet />
        </UIProvider>
    );
};

// ===================================================================
// 3. Componente Principal de Rotas (Atualizado)
// ===================================================================
const AppRoutes = () => (
    <BrowserRouter>
        {/* O AuthProvider deve envolver toda a aplicação */}
        <AuthProvider>
            <Routes>
                {/* GRUPO 1: Rotas de Autenticação (Layout sem Navbar) */}
                <Route element={<AuthLayout />}>
                    <Route path="/" element={<LoginPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                </Route>

                {/* GRUPO 2: Rotas Públicas (Layout com Navbar) */}
                <Route element={<DefaultLayout />}>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                </Route>

                {/* GRUPO 3: Rotas Protegidas (Passam pelo porteiro 'ProtectedLayout') */}
                <Route element={<ProtectedLayout />}>
                    {/* Após passar pelo porteiro, usamos o DefaultLayout para ter a Navbar */}
                    <Route element={<DefaultLayout />}>
                        <Route path="/home" element={<HomePage />} />
                        <Route path="/mail_daily_dash" element={<DashboardMailDaily />} />
                        {/* Adicione outras rotas protegidas aqui. Ex: */}
                        {/* <Route path="/users" element={<UsersPage />} /> */}
                    </Route>
                </Route>

            </Routes>
        </AuthProvider>
    </BrowserRouter>
);

export default AppRoutes;