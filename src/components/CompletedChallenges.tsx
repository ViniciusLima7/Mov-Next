"use client";

import { useContext } from "react";
import { ChallengesContext } from "../contexts/ChallengesContext";
import { LanguageContext } from "../contexts/LanguageContext";
import styles from "../styles/components/CompletedChallenges.module.css";

export function CompletedChallenges() {
  const { challengesCompleted } = useContext(ChallengesContext);
  const { t } = useContext(LanguageContext);
  return (
    <div className={styles.completedChallengesContainer}>
      <span>{t("challenges.completed")}</span>
      <span>{challengesCompleted}</span>
    </div>
  );
}
