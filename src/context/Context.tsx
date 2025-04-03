// GlobalContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { organizations } from "../data/Organizations";
import { Organization } from "../interfaces/Organization.ts";

interface GlobalProviderProps {
  children: React.ReactNode;
  /** Permite definir a organização inicial (caso não haja valor salvo no localStorage) */
  initialOrganization?: keyof typeof organizations;
  /** Permite definir o tema inicial (caso não haja valor salvo no localStorage) */
  initialTheme?: "light" | "dark";
}

interface ContextType {
  organization: Organization;
  setOrganization: (orgName: keyof typeof organizations) => void;
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
}

const GlobalContext = createContext<ContextType | undefined>(undefined);

export const GlobalProvider: React.FC<GlobalProviderProps> = ({
  children,
  initialOrganization,
  initialTheme,
}) => {
  // Obtém do localStorage ou utiliza os valores iniciais/passados via props
  const storedOrg = localStorage.getItem("selectedOrganization") as
    | keyof typeof organizations
    | null;
  const storedTheme = localStorage.getItem("theme") as "light" | "dark" | null;

  const [organization, setOrganizationState] = useState<Organization>(
    storedOrg && organizations[storedOrg]
      ? organizations[storedOrg]
      : initialOrganization && organizations[initialOrganization]
        ? organizations[initialOrganization]
        : organizations.Fricke,
  );

  const [theme, setThemeState] = useState<"light" | "dark">(
    storedTheme ? storedTheme : initialTheme ? initialTheme : "light",
  );

  useEffect(() => {
    localStorage.setItem("selectedOrganization", organization.name);
    localStorage.setItem("theme", theme);

    // Atualiza o arquivo de estilos (CSS) da organização
    const link = document.getElementById(
      "theme-stylesheet",
    ) as HTMLLinkElement | null;
    if (link) {
      link.href = organization.cssFile;
    }

    // Atualiza o título da página
    document.title = organization.name;

    // Atualiza o favicon
    const favicon = document.getElementById(
      "favicon",
    ) as HTMLLinkElement | null;
    if (favicon) {
      favicon.href = organization.icon;
    }

    // Atualiza o tema (dark/light) na raiz do documento
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [organization, theme]);

  const setOrganization = (orgName: keyof typeof organizations) => {
    setOrganizationState(organizations[orgName]);
  };

  const setTheme = (theme: "light" | "dark") => {
    setThemeState(theme);
  };

  return (
    <GlobalContext.Provider
      value={{ organization, setOrganization, theme, setTheme }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = (): ContextType => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
};
