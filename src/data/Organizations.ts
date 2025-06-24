import { Organization } from "../interfaces/Organization.ts";

export const organizations: { [key: string]: Organization } = {
  Lojas_Fricke: {
    name: "Lojas Fricke",
    cssFile: "/src/styles/FrickeColors.css",
    logo: "/images/fricke-logo.png",
    icon: "/icons/fricke.png",
    site: "https://www.loja.fricke.com.br/",
  },
  Balmer: {
    name: "Balmer",
    cssFile: "/src/styles/BalmerColors.css",
    logo: "/images/balmer-logo.png",
    icon: "/icons/balmer.png",
    site: "https://balmer.com.br/",
  },
  None: {
    name: "Grupo Fricke",
    cssFile: "/src/styles/NoneColors.css",
    logo: "/images/none-logo.png",
    icon: "/icons/none.png",
    site: "https://balmer.com.br/",
  },
};
