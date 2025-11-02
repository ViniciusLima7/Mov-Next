"use client";

import { useContext } from "react";
import { LanguageContext } from "../contexts/LanguageContext";
import styles from "../styles/components/LanguageSelector.module.css";

export function LanguageSelector() {
  const { language, setLanguage, t } = useContext(LanguageContext);

  const languages = [
    { code: "pt" as const, flag: "🇧🇷", name: "Português" },
    { code: "en" as const, flag: "🇺🇸", name: "English" },
    { code: "es" as const, flag: "🇪🇸", name: "Español" },
  ];

  return (
    <div className={styles.languageSelector}>
      {languages.map((lang) => (
        <button
          key={lang.code}
          className={`${styles.languageButton} ${
            language === lang.code ? styles.active : ""
          }`}
          onClick={() => setLanguage(lang.code)}
        >
          <span className={styles.flag}>{lang.flag}</span>
          <span className={styles.name}>{lang.name}</span>
        </button>
      ))}
    </div>
  );
}
