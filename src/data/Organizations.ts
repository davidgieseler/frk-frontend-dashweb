import { Organization } from "../interfaces/Organization.ts";

export const organizations: { [key: string]: Organization } = {
  Fricke: {
    name: "Fricke",
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
};
