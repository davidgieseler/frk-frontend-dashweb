import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import NotFoundPage from "../pages/NotFoundPage";
import LoginPage from "../pages/LoginPage.tsx";
import LanguageSelectorComponent from "../components/LanguageSelectorComponent.tsx";
import HomePage from "../pages/HomePage";
import Footer from "../components/Footer.tsx";
import ContactPage from "../pages/ContactPage.tsx";
import { DashboardMailDaily } from "../pages/DashboardMailDaily.tsx"; // Exemplo de uma página com Navbar

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

const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      {/* Rotas que não exibem a Navbar */}
      <Route element={<AuthLayout />}>
        <Route path="/" element={<LoginPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* Rotas que usam o layout padrão com Navbar */}
      <Route element={<DefaultLayout />}>
        <Route path="/home" element={<HomePage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/mail_daily_dash" element={<DashboardMailDaily />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;
