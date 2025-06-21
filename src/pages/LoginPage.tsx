import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

// --- Nossas Novas Importações ---
import useAuth from "../hooks/useAuth";
import { LoginStep1Response } from "../interfaces/api"; // A interface que define a resposta da etapa 1

// --- Imagem de Logo Padrão (Opcional) ---
// Como na primeira etapa não sabemos a organização, podemos ter um logo padrão.
import defaultLogo from '../assets/react.svg'; // Crie ou ajuste este caminho

const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // 1. Usando nosso novo hook de autenticação
  const auth = useAuth();

  // 2. Novos estados para controlar o fluxo
  const [step, setStep] = useState<1 | 2>(1);
  const [username, setUsername] = useState("admin"); // Ajustado de 'email' para 'username'
  const [password, setPassword] = useState("admin");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // Estado para guardar os dados da primeira etapa (ID do usuário e lista de organizações)
  const [loginData, setLoginData] = useState<LoginStep1Response | null>(null);

  // 3. Nova função para a primeira etapa do login
  const handleLoginSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Chama a primeira etapa da API através do nosso AuthContext
      const data = await auth.loginStep1(username, password);
      setLoginData(data); // Guarda a resposta
      setStep(2); // Avança para a próxima etapa
    } catch (err) {
      setError("Usuário ou senha inválidos. Por favor, tente novamente.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 4. Nova função para a segunda etapa do login
  const handleOrgSelect = async (organizationId: number) => {
    if (!loginData) return; // Segurança
    setError("");
    setLoading(true);

    try {
      // Chama a segunda etapa para obter os tokens
      await auth.loginStep2(loginData.user_id, organizationId);
      navigate("/mail_daily_dash"); // Redireciona para o dashboard após o sucesso
    } catch (err) {
      setError("Não foi possível entrar na organização selecionada.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 5. Renderização condicional baseada na etapa (step)
  return (
      <div className="w-full max-w-md bg-[var(--surface-color)] p-8 shadow-lg rounded-lg border border-[var(--border-color)]">
        {/* Etapa 1: Formulário de Credenciais */}
        {step === 1 && (
            <>
              <div className="mb-6 text-center">
                <img src={defaultLogo} alt="Logo" className="h-16 mx-auto dark:brightness-150" />
              </div>
              <form onSubmit={handleLoginSubmit} noValidate>
                {/* Campo de username (ajustado de email) */}
                <div className="mb-4">
                  <label htmlFor="username" className="block text-[var(--text-color)] text-sm font-semibold mb-2">
                    {t("username")} {/* Crie a tradução para 'username' se necessário */}
                  </label>
                  <input
                      type="text"
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder={t("username_placeholder")}
                      className="w-full px-4 py-2 border border-[var(--primary-color)] bg-[var(--background-alt)] text-[var(--text-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                      required
                  />
                </div>

                {/* Campo de senha (sem alteração) */}
                <div className="mb-6">
                  <label htmlFor="password" className="block text-[var(--text-color)] text-sm font-semibold mb-2">
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
                    disabled={loading} // Desabilita o botão durante o carregamento
                    className="w-full bg-[var(--primary-color)] text-[var(--text-invert)] py-2 rounded-lg hover:bg-[var(--primary-light)] active:bg-[var(--primary-dark)] transition duration-200 cursor-pointer disabled:opacity-50"
                >
                  {loading ? t("loading") : t("login_button")}
                </button>
              </form>
            </>
        )}

        {/* Etapa 2: Seleção de Organização */}
        {step === 2 && loginData && (
            <div className="text-center">
              <h2 className="text-xl font-bold mb-4 text-[var(--text-color)]">{t("select_organization")}</h2>
              <div className="space-y-3">
                {loginData.organizations.map((org) => (
                    <button
                        key={org.id}
                        onClick={() => handleOrgSelect(org.id)}
                        disabled={loading}
                        className="w-full bg-[var(--surface-alt)] border border-[var(--primary-color)] text-[var(--text-color)] py-3 rounded-lg hover:bg-[var(--primary-color)] hover:text-[var(--text-invert)] transition duration-200 cursor-pointer disabled:opacity-50"
                    >
                      {org.name}
                    </button>
                ))}
              </div>
            </div>
        )}

        {/* Exibição de Erro Global */}
        {error && (
            <p className="mt-4 text-center text-red-500 text-sm">{error}</p>
        )}
      </div>
  );
};

export default LoginPage;