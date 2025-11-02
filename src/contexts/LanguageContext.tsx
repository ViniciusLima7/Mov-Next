"use client";

import { createContext, useState, ReactNode, useEffect } from "react";
import Cookies from "js-cookie";
import ptTranslations from "../locales/pt.json";
import enTranslations from "../locales/en.json";
import esTranslations from "../locales/es.json";

type Language = "pt" | "en" | "es";

type Translations = typeof ptTranslations;

interface LanguageContextData {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageContext = createContext({} as LanguageContextData);

const translations: Record<Language, Translations> = {
  pt: ptTranslations,
  en: enTranslations,
  es: esTranslations,
};

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>("pt");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Lê o idioma que o script inline já definiu
    const currentLang = document.documentElement.getAttribute("lang") as Language;
    if (currentLang && ["pt", "en", "es"].includes(currentLang)) {
      setLanguageState(currentLang);
    }
    setIsMounted(true);
  }, []);

  function setLanguage(lang: Language) {
    setLanguageState(lang);
    document.documentElement.setAttribute("lang", lang);
    Cookies.set("language", lang);
  }

  // Função de tradução com suporte a interpolação
  function t(key: string, params?: Record<string, string | number>): string {
    const keys = key.split(".");
    let value: any = translations[language];

    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k];
      } else {
        // Fallback para inglês se não encontrar
        value = translations["en"];
        for (const k2 of keys) {
          if (value && typeof value === "object" && k2 in value) {
            value = value[k2];
          } else {
            return key; // Retorna a chave se não encontrar
          }
        }
        break;
      }
    }

    if (typeof value !== "string") {
      return key;
    }

    // Interpolação de parâmetros
    if (params) {
      return value.replace(/\{(\w+)\}/g, (match, paramKey) => {
        return params[paramKey]?.toString() || match;
      });
    }

    return value;
  }

  // Evita flash de conteúdo
  if (!isMounted) {
    return null;
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

