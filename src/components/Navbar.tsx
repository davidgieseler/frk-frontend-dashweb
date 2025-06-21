import { NavLink, useLocation, useNavigate } from "react-router-dom";
import ThemeToggleButton from "./ThemeToggleButton";
import { useState, useEffect, useRef, useCallback, FC } from "react";
import { useTranslation } from "react-i18next";
import { Menu, X, ChevronDown, LogOut } from "lucide-react"; // Adicionei o ícone LogOut

// --- HOOKS E COMPONENTES DE LÓGICA ---
import useAuth from "../hooks/useAuth";
import useUI from "../hooks/useUI";
import HasPermission from "./auth/HasPermission"; // Verifique se o caminho está correto

// --- RECURSOS ESTÁTICOS ---
import defaultIcon from '../assets/react.svg'; // Verifique o caminho

// --- INTERFACES E TIPOS ---
interface NavItemProps {
  label: string;
  subItems?: { to: string; label: string }[];
}

const Navbar: FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const { logout } = useAuth();
  const { loading: uiLoading } = useUI();

  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // --- ESTRUTURA ESTÁTICA DO MENU ---
  // ** REMOVEMOS O ITEM DE LOGOUT DESTA LISTA **
  const navItems: NavItemProps[] = [
    {
      label: "Main",
      subItems: [
        { to: "/home", label: t("home") },
        { to: "/contact", label: t("contact") },
      ],
    },
    {
      label: "Dashboard",
      subItems: [
        { to: "/mail_daily_dash", label: t("mail_daily_dash") },
        { to: "/grafana_dash", label: t("grafana_dash") },
        { to: "/dash", label: t("dash") },
      ],
    },
    {
      label: "Account",
      subItems: [
        { to: "/account_settings", label: t("account_settings") },
      ],
    },
  ];

  const handleSignOut = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (menuOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
      setMenuOpen(false);
      setOpenDropdown(null);
    }
  }, [menuOpen]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleClickOutside]);

  const toggleDropdown = (label: string) => {
    setOpenDropdown(prev => (prev === label ? null : label));
  };

  const currentPageLabel = navItems
      .flatMap((item) => item.subItems || [])
      .find((sub) => sub.to === location.pathname)?.label || "Menu";

  if (uiLoading) {
    return <header className="bg-[var(--surface-color)] shadow-md z-1000 h-16" />;
  }

  return (
      <header className="bg-[var(--surface-color)] shadow-md z-1000">
        {/* Cabeçalho superior */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`overflow-hidden transition-all duration-300 ${menuOpen ? "max-h-0 opacity-0" : "max-h-40 opacity-100"}`}>
            <div className="flex justify-between items-center py-4">
              <div className="flex gap-10 items-center group hover:text-[var(--primary-light)] hover:scale-105 transition-transform duration-200 origin-left">
                <button className="cursor-pointer flex justify-between items-center gap-1" aria-label="Abrir menu" onClick={() => setMenuOpen(true)}>
                  <Menu size={24} />
                  <img src={defaultIcon} alt="Logo" className="h-5 mx-auto dark:brightness-150" />
                  <span className="text-[var(--text-color)] font-semibold group-hover:text-[var(--primary-light)]">{currentPageLabel}</span>
                </button>
              </div>
              <ThemeToggleButton />
            </div>
          </div>
        </div>

        {/* Sidebar Menu */}
        <div ref={sidebarRef} id="sidebar-menu" className={`fixed top-0 left-0 h-full w-64 bg-[var(--surface-color)] shadow-lg transform ${menuOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out`}>
          <div className="flex items-center justify-between p-4 border-b border-[var(--primary-light)]">
            <span className="text-[var(--text-color)] font-semibold">{currentPageLabel}</span>
            <button onClick={() => setMenuOpen(false)} aria-label="Fechar menu">
              <X size={24} className="cursor-pointer hover:text-[var(--primary-light)]" />
            </button>
          </div>

          {/* --- Renderização da Navegação --- */}
          {/* Usamos flex-col para empurrar o logout para baixo */}
          <div className="h-full flex flex-col p-4">
            <nav className="flex-grow">
              {navItems.map(({ label, subItems }) => (
                  <HasPermission key={label} name={`menugroup-${label.toLowerCase()}`}>
                    <div className="mb-2">
                      <button onClick={() => toggleDropdown(label)} className="flex justify-between items-center w-full py-2 cursor-pointer text-[var(--text-color)] hover:text-[var(--primary-light)]" aria-expanded={openDropdown === label}>
                        {label}
                        <ChevronDown size={16} className={openDropdown === label ? "rotate-180 transition-transform" : "transition-transform"} />
                      </button>
                      {openDropdown === label && (
                          <div className="ml-4 border-l border-[var(--primary-light)] pl-2">
                            {subItems?.map((item) => (
                                <HasPermission key={item.to} name={`menu${item.to.replace(/\//g, '-')}`}>
                                  <NavLink
                                      to={item.to}
                                      className="block py-1 text-[var(--text-color)] hover:text-[var(--primary-light)]"
                                      onClick={() => { setMenuOpen(false); setOpenDropdown(null); }}
                                  >
                                    {item.label}
                                  </NavLink>
                                </HasPermission>
                            ))}
                          </div>
                      )}
                    </div>
                  </HasPermission>
              ))}
            </nav>

            {/* --- Seção de Logout (Sempre visível) --- */}
            <div className="mt-auto">
              <hr className="my-2 border-[var(--border-color)] opacity-50" />
              <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 w-full text-left p-2 rounded-md text-[var(--text-color)] hover:bg-[var(--surface-alt)] hover:text-[var(--primary-light)]"
              >
                <LogOut size={16} />
                <span>{t("sign_out")}</span>
              </button>
            </div>
          </div>

          {/* Rodapé da Sidebar foi movido para dentro do flex-col */}
          <div className="absolute bottom-0 left-0 w-full pb-4">
            <div className="flex justify-center mb-4">
              <ThemeToggleButton />
            </div>
            <div className="text-center mt-4">
              <img src={defaultIcon} alt="Logo" className="h-10 mx-auto dark:brightness-150"/>
            </div>
          </div>
        </div>
      </header>
  );
};

export default Navbar;