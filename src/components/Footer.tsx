import { useTranslation } from "react-i18next";
import { FaEnvelope, FaGlobe, FaLinkedin } from "react-icons/fa";
import { useGlobalContext } from "../context/Context.tsx";
import ThemeToggleButton from "./ThemeToggleButton.tsx";

const Footer = () => {
  const { organization } = useGlobalContext();
  const { t } = useTranslation();
  return (
    <footer className="w-full border-t border-[var(--border-color)] bg-[var(--surface-color)] text-[var(--text-color)] shadow-[0_-4px_6px_rgba(0,0,0,0.05)] z-999">
      <div className="max-w-5xl mx-auto py-6 px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left div */}
        <div className="flex items-center gap-4 text-xl">
          <a
            href="https://www.linkedin.com/company/lojasfricke/posts/?feedView=all"
            target="_blank"
            rel="noopener noreferrer"
            className="transition duration-200 hover:scale-110 hover:text-[var(--primary-color)]"
          >
            <FaLinkedin />
          </a>
          <a
            href={t("mailto")}
            className="transition duration-200 hover:scale-110 hover:text-[var(--primary-color)]"
          >
            <FaEnvelope />
          </a>
          <a
            href={organization.site}
            target="_blank"
            rel="noopener noreferrer"
            className="transition duration-200 hover:scale-110 hover:text-[var(--primary-color)]"
          >
            <FaGlobe />
          </a>
        </div>
        {/* Center div */}
        <div className="flex flex-col items-center">
          <a href="#">
            <img
              src={organization.icon}
              className="h-8 mx-auto transition duration-200 hover:scale-110 dark:brightness-150"
              alt="Logo"
            />
          </a>
          <p className="text-sm text-center mt-2">
            {t("footer_rights", { year: new Date().getFullYear() })}
          </p>
        </div>
        {/* Right div */}
        <div className="flex items-center gap-4 text-xl">
          <ThemeToggleButton />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
