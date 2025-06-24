import { NavLink, useLocation } from "react-router-dom";
import ThemeToggleButton from "./ThemeToggleButton";
import { useState, useEffect, useRef, useCallback, useMemo, useContext } from "react";
import { useGlobalContext } from "../context/Context";
import { useTranslation } from "react-i18next";
import { Menu, X, ChevronDown } from "lucide-react";
import UIContext from "../context/UIContext";
import useAuth from "../hooks/useAuth";

interface NavItemProps {
  label: string;
  subItems?: { to: string; label: string }[];
}

const Navbar = () => {
  const { t } = useTranslation();
  const { organization } = useGlobalContext();
  const location = useLocation();
  const { logout } = useAuth();
  const ui = useContext(UIContext);

  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);


  const loading = ui?.loading ?? true;

  const groupedItems: NavItemProps[] = useMemo(() => {
    if (loading) return [];

    const objects = ui?.uiObjects ?? [];
    const groups: Record<string, NavItemProps> = {};

    objects.forEach((obj) => {
      if (obj.type === "MENU") {
        const section = obj.metadata?.section || "Outros";

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        if (!groups[section]) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          groups[section] = { label: section, subItems: [] };
        }

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        groups[section].subItems?.push({
          to: obj.metadata.href || "#",
          label: obj.metadata.label || obj.name,
        });
      }
    });

    return Object.values(groups);
  }, [loading, ui?.uiObjects]);

  const currentPageLabel =
      groupedItems
          .flatMap((item) => item.subItems || [])
          .find((sub) => sub.to === location.pathname)?.label || "";

  const handleSignOut = () => {
    logout();
  };

  const handleClickOutside = useCallback(
      (event: MouseEvent) => {
        if (
            menuOpen &&
            sidebarRef.current &&
            !sidebarRef.current.contains(event.target as Node)
        ) {
          setMenuOpen(false);
          setOpenDropdown(null);
        }
      },
      [menuOpen]
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  const toggleDropdown = (label: string) => {
    setOpenDropdown((prev) => (prev === label ? null : label));
  };

  if (loading) {
    return (
        <header className="bg-[var(--surface-color)] shadow-md z-1000">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <span className="text-[var(--text-color)] font-semibold">Carregando menu...</span>
              <ThemeToggleButton />
            </div>
          </div>
        </header>
    );
  }

  return (
      <header className="bg-[var(--surface-color)] shadow-md z-1000">
        {/* Cabeçalho superior */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
              className={`overflow-hidden transition-all duration-300 ${
                  menuOpen ? "max-h-0 opacity-0" : "max-h-40 opacity-100"
              }`}
          >
            <div className="flex justify-between items-center py-4">
              <div className="flex gap-10 items-center group hover:text-[var(--primary-light)] hover:scale-105 transition-transform duration-200 origin-left">
                <button
                    className="cursor-pointer flex justify-between items-center gap-1"
                    aria-label="Abrir menu"
                    onClick={() => setMenuOpen(true)}
                >
                  <Menu size={24} />
                  <img
                      src={organization.icon}
                      alt="Logo"
                      className="h-5 mx-auto dark:brightness-150"
                  />
                  <span className="text-[var(--text-color)] font-semibold group-hover:text-[var(--primary-light)]">
                  {currentPageLabel}
                </span>
                </button>
              </div>
              <ThemeToggleButton />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div
            ref={sidebarRef}
            id="sidebar-menu"
            className={`fixed top-0 left-0 h-full w-64 bg-[var(--surface-color)] shadow-lg transform ${
                menuOpen ? "translate-x-0" : "-translate-x-full"
            } transition-transform duration-300 ease-in-out`}
        >
          <div className="flex items-center justify-between p-4 border-b border-[var(--primary-light)]">
          <span className="text-[var(--text-color)] font-semibold">
            {currentPageLabel}
          </span>
            <button onClick={() => setMenuOpen(false)} aria-label="Fechar menu">
              <X
                  size={24}
                  className="cursor-pointer hover:text-[var(--primary-light)]"
              />
            </button>
          </div>

          <nav className="mt-4 p-4">
            {groupedItems.map(({ label, subItems }) => (
                <div key={label} className="mb-2">
                  <button
                      onClick={() => toggleDropdown(label)}
                      className="flex justify-between items-center w-full py-2 cursor-pointer text-[var(--text-color)] hover:text-[var(--primary-light)]"
                      aria-expanded={openDropdown === label}
                      aria-controls={`dropdown-${label}`}
                  >
                    {label}
                    <ChevronDown
                        size={16}
                        className={
                          openDropdown === label
                              ? "rotate-180 transition-transform"
                              : "transition-transform"
                        }
                    />
                  </button>
                  {openDropdown === label && (
                      <div
                          id={`dropdown-${label}`}
                          className="ml-4 border-l border-[var(--primary-light)] pl-2"
                      >
                        {subItems?.map(({ to, label }) => (
                            <NavLink
                                key={to}
                                to={to}
                                className="block py-1 text-[var(--text-color)] hover:text-[var(--primary-light)]"
                                onClick={() => {
                                  setMenuOpen(false);
                                  setOpenDropdown(null);
                                }}
                            >
                              {label}
                            </NavLink>
                        ))}
                      </div>
                  )}
                </div>
            ))}
          </nav>

          {/* Rodapé */}
          <div className="absolute bottom-0 left-0 w-full pb-4">
            <div className="flex justify-center mb-4">
              <ThemeToggleButton />
            </div>
            <div className="text-center mt-4">
              <img
                  src={organization.logo}
                  alt="Logo"
                  className="h-10 mx-auto dark:brightness-150"
              />
            </div>
            <div className="text-center mt-4">
              <button
                  onClick={handleSignOut}
                  className="text-sm text-[var(--primary-light)] hover:underline transition cursor-pointer"
              >
                {t("sign_out")}
              </button>
            </div>
          </div>
        </div>
      </header>
  );
};

export default Navbar;
