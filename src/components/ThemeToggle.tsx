"use client";

import { useContext } from "react";
import { ThemeContext } from "../contexts/ThemeContext";
import { LanguageContext } from "../contexts/LanguageContext";
import styles from "../styles/components/ThemeToggle.module.css";

export function ThemeToggle() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { t } = useContext(LanguageContext);

  return (
    <button
      className={styles.themeToggle}
      onClick={toggleTheme}
      title={
        theme === "light"
          ? t("theme.toggleTooltipLight")
          : t("theme.toggleTooltipDark")
      }
    >
      <div className={styles.toggleTrack}>
        <div
          className={`${styles.toggleThumb} ${
            theme === "dark" ? styles.dark : ""
          }`}
        >
          {theme === "light" ? "☀️" : "🌙"}
        </div>
      </div>
      <span className={styles.label}>
        {theme === "light" ? t("theme.light") : t("theme.dark")}
      </span>
    </button>
  );
}
