import { NavLink } from "react-router-dom";
import ThemeToggleButton from "./ThemeToggleButton";

const Navbar = () => (
  <header className="bg-[var(--surface-color)] shadow-md">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center py-4">
        <nav className="flex space-x-6">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "text-[var(--primary-color)] font-semibold border-b-2 border-[var(--primary-color)] pb-1"
                : "text-[var(--text-color)] hover:text-[var(--primary-light)] transition duration-200"
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive
                ? "text-[var(--primary-color)] font-semibold border-b-2 border-[var(--primary-color)] pb-1"
                : "text-[var(--text-color)] hover:text-[var(--primary-light)] transition duration-200"
            }
          >
            Sobre
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              isActive
                ? "text-[var(--primary-color)] font-semibold border-b-2 border-[var(--primary-color)] pb-1"
                : "text-[var(--text-color)] hover:text-[var(--primary-light)] transition duration-200"
            }
          >
            Contato
          </NavLink>
        </nav>
        <ThemeToggleButton />
      </div>
    </div>
  </header>
);

export default Navbar;
