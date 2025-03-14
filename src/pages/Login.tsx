import React, { useEffect, useState, useCallback, useRef } from "react";

// Opções de temas
const themeOptions = [
  { value: "/src/styles/FrickeColors.css", label: "Fricke" },
  { value: "/src/styles/BalmerColors.css", label: "Balmer" },
];

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedTheme, setSelectedTheme] = useState<string>(() => {
    return localStorage.getItem("cssTheme") || themeOptions[0].value;
  });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Atualiza o link do CSS e armazena a preferência no localStorage
  useEffect(() => {
    const link = document.getElementById(
      "theme-stylesheet",
    ) as HTMLLinkElement | null;
    if (link) {
      link.href = selectedTheme;
    }
    localStorage.setItem("cssTheme", selectedTheme);
  }, [selectedTheme]);

  // Fecha o dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      // Lógica de autenticação pode ser implementada aqui.
      console.log("Dados do formulário:", { email, password });
    },
    [email, password],
  );

  return (
    <div className="w-full max-w-md bg-[var(--surface-color)] p-8 shadow-lg rounded-lg border border-[var(--border-color)]">
      <div className="mb-6 text-center">
        {/* Placeholder para o logo */}
        <h1 className="text-3xl font-bold text-[var(--text-color)]">Fricke</h1>
      </div>
      <form onSubmit={handleSubmit} noValidate>
        {/* Dropdown para seleção de tema */}
        <div className="mb-4" ref={dropdownRef}>
          <label
            htmlFor="organization"
            className="block text-[var(--text-color)] text-sm font-semibold mb-2"
          >
            Organização
          </label>
          <button
            type="button"
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="w-full flex justify-between items-center px-4 py-2 border border-[var(--primary-color)] bg-[var(--background-alt)] text-[var(--text-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
          >
            {themeOptions.find((opt) => opt.value === selectedTheme)?.label ||
              "Selecione um estilo"}
            <svg
              className={`w-4 h-4 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : "rotate-0"}`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          <div className="relative w-full">
            {dropdownOpen && (
              <ul className="absolute w-full bg-[var(--surface-color)] border border-[var(--primary-color)] rounded-lg mt-1 shadow-lg z-10">
                {themeOptions.map((option) => (
                  <li
                    key={option.value}
                    onClick={() => {
                      setSelectedTheme(option.value);
                      setDropdownOpen(false);
                    }}
                    className="px-4 py-2 cursor-pointer hover:bg-[var(--primary-light)] hover:text-[var(--text-invert)] transition duration-200"
                  >
                    {option.label}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        {/* Campo de e-mail */}
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-[var(--text-color)] text-sm font-semibold mb-2"
          >
            E-mail
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Digite seu e-mail"
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
            Senha
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Digite sua senha"
            className="w-full px-4 py-2 border border-[var(--primary-color)] bg-[var(--background-alt)] text-[var(--text-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-[var(--primary-color)] text-[var(--text-invert)] py-2 rounded-lg hover:bg-[var(--primary-light)] active:bg-[var(--primary-dark)] transition duration-200 cursor-pointer"
        >
          Entrar
        </button>
      </form>
    </div>
  );
};

export default Login;
