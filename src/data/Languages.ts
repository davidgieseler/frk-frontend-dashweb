import { Language } from "../interfaces/Language.ts";
import { BR, US } from "country-flag-icons/react/3x2";

export const getLanguages = (): Language[] => {
  return [
    { code: "en", name: "English", flagCode: "us", Flag: US },
    { code: "pt", name: "Português", flagCode: "br", Flag: BR },
  ];
};
