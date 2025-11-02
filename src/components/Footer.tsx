"use client";

import { useContext } from "react";
import { LanguageContext } from "../contexts/LanguageContext";
import styles from "../styles/components/Footer.module.css";

export function Footer() {
  const { t } = useContext(LanguageContext);
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <p>
        © {currentYear}{" "}
        <a
          href="https://www.linkedin.com/in/marcos-vinicius-lima/"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
          title={t("footer.developedBy")}
        >
          V7-APPS
        </a>{" "}
        | {t("footer.copyright")}
      </p>
    </footer>
  );
}
