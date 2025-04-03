import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useGlobalContext } from "../context/Context.tsx";
import { useNavigate } from "react-router-dom";
import DropdownButton from "../components/DropDownButton.tsx";
import { organizations } from "../data/Organizations.ts";

const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const { organization, setOrganization } = useGlobalContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault(); // Previne recarregamento da página

    // Simulação de login (pode ser substituído por uma API real)
    if (email && password) {
      console.log("Usuário logado:", email);
      navigate("/home"); // Redireciona para a página inicial após login
    } else {
      alert("Preencha os campos corretamente!");
    }
  };

  return (
    <div className="w-full max-w-md bg-[var(--surface-color)] p-8 shadow-lg rounded-lg border border-[var(--border-color)]">
      <div className="mb-6 text-center">
        {/* Logo Dinâmica */}
        <img
          src={organization.logo}
          alt="Logo"
          className="h-16 mx-auto dark:brightness-150"
        />
      </div>
      {/*<form onSubmit={(e) => e.preventDefault()} noValidate>*/}
      <form onSubmit={handleLogin} noValidate>
        {/* Seleção de Organização */}
        <DropdownButton
          label={t("organization")}
          selected={organization.name}
          options={Object.keys(organizations)}
          onSelect={(value) =>
            setOrganization(value as keyof typeof organizations)
          }
          getLabel={(orgKey) => organizations[orgKey].name}
        />

        {/* Campo de e-mail */}
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-[var(--text-color)] text-sm font-semibold mb-2"
          >
            {t("email")}
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("email_placeholder")}
            className="w-full px-4 py-2 border border-[var(--primary-color)] bg-[var(--background-alt)] text-[var(--text-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
            required
          />
        </div>

        {/* Campo de senha */}
        <div className="mb-6">
          <label
            htmlFor="password"
            className="block text-[var(--text-color)] text-sm font-semibold mb-2"
          >
            {t("password")}
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t("password_placeholder")}
            className="w-full px-4 py-2 border border-[var(--primary-color)] bg-[var(--background-alt)] text-[var(--text-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[var(--primary-color)] text-[var(--text-invert)] py-2 rounded-lg hover:bg-[var(--primary-light)] active:bg-[var(--primary-dark)] transition duration-200 cursor-pointer"
        >
          {t("login_button")}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
