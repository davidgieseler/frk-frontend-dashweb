import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { organizations } from "../data/Organizations";
import { Organization } from "../interfaces/Organization.ts";

// Interface para as propriedades do Provider
interface GlobalProviderProps {
  children: ReactNode;
  /** Permite definir a organização inicial (caso não haja valor salvo no localStorage) */
  initialOrganization?: keyof typeof organizations;
  /** Permite definir o tema inicial (caso não haja valor salvo no localStorage) */
  initialTheme?: "light" | "dark";
}

// Interface para o valor do Contexto
interface ContextType {
  organization: Organization;
  setOrganization: (orgName: keyof typeof organizations) => void;
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
}

// Criação do Contexto
const GlobalContext = createContext<ContextType | undefined>(undefined);

// Componente Provider
export const GlobalProvider: React.FC<GlobalProviderProps> = ({
                                                                children,
                                                                initialOrganization,
                                                                initialTheme,
                                                              }) => {
  // --- LÓGICA DE INICIALIZAÇÃO ---
  // Esta função é chamada apenas uma vez para definir o estado inicial.
  // Ela busca a CHAVE da organização no localStorage, garantindo consistência.
  const getInitialOrgKey = (): keyof typeof organizations => {
    const storedOrgKey = localStorage.getItem(
        "selectedOrganization",
    ) as keyof typeof organizations | null;

    // 1. Tenta usar o valor do localStorage, se for uma chave válida
    if (storedOrgKey && organizations[storedOrgKey]) {
      return storedOrgKey;
    }
    // 2. Se não, tenta usar a propriedade inicial passada para o Provider
    if (initialOrganization && organizations[initialOrganization]) {
      return initialOrganization;
    }
    // 3. Como último recurso, usa "Fricke" como padrão
    return "Fricke";
  };

  // Função similar para o tema
  const getInitialTheme = (): "light" | "dark" => {
    const storedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    return storedTheme || initialTheme || "light";
  };

  // --- ESTADO PRINCIPAL ---
  // O estado agora armazena a CHAVE da organização, não o objeto inteiro.
  // Isso é mais eficiente e evita bugs.
  const [organizationKey, setOrganizationKey] = useState<
      keyof typeof organizations
  >(getInitialOrgKey());

  const [theme, setThemeState] = useState<"light" | "dark">(getInitialTheme());

  // --- ESTADO DERIVADO ---
  // O objeto 'organization' completo é derivado da chave.
  // Se 'organizationKey' mudar, este objeto será recalculado automaticamente.
  const organization = organizations[organizationKey];

  // --- EFEITO COLATERAL (useEffect) ---
  // Este efeito é executado sempre que a chave da organização ou o tema mudam.
  useEffect(() => {
    // 1. Salva a CHAVE correta no localStorage, não o nome.
    localStorage.setItem("selectedOrganization", String(organizationKey));
    localStorage.setItem("theme", theme);

    // 2. Atualiza o arquivo de estilos (CSS) da organização
    const link = document.getElementById(
        "theme-stylesheet",
    ) as HTMLLinkElement | null;
    if (link) {
      link.href = organization.cssFile;
    }

    // 3. Atualiza o título da página
    document.title = organization.name;

    // 4. Atualiza o favicon
    const favicon = document.getElementById("favicon") as HTMLLinkElement | null;
    if (favicon) {
      favicon.href = organization.icon;
    }

    // 5. Atualiza o tema (dark/light) no elemento <html>
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [organizationKey, theme, organization]); // Depende da chave e do tema

  // --- FUNÇÕES EXPOSTAS PELO CONTEXTO ---
  // A função para o usuário chamar. Ela apenas atualiza a CHAVE.
  const setOrganization = (orgKey: keyof typeof organizations) => {
    setOrganizationKey(orgKey);
  };

  const setTheme = (newTheme: "light" | "dark") => {
    setThemeState(newTheme);
  };

  // O valor que será fornecido para todos os componentes filhos
  const contextValue = {
    organization, // Fornecemos o objeto completo
    setOrganization, // e a função para alterá-lo
    theme,
    setTheme,
  };

  return (
      <GlobalContext.Provider value={contextValue}>
        {children}
      </GlobalContext.Provider>
  );
};

// --- HOOK CUSTOMIZADO ---
// Nenhuma alteração aqui. Permanece como uma forma fácil e segura
// de acessar o contexto em outros componentes.
export const useGlobalContext = (): ContextType => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
};