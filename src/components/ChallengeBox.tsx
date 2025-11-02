"use client";

import { useContext } from "react";
import { ChallengesContext } from "../contexts/ChallengesContext";
import { CountdownContext } from "../contexts/CountdownContext";
import { LanguageContext } from "../contexts/LanguageContext";

import styles from "../styles/components/ChallengeBox.module.css";

export function ChallengeBox() {
  const { activeChallenge, reseteChallenge, completeChallenge } =
    useContext(ChallengesContext);
  const { resetCountdown } = useContext(CountdownContext);
  const { t } = useContext(LanguageContext);
  function handleChallengeSucceeded() {
    completeChallenge();
    resetCountdown();
  }

  function handleChallengeFailed() {
    reseteChallenge();
    resetCountdown();
  }

  return (
    <div className={styles.challengeBoxContainer}>
      {activeChallenge ? (
        <div className={styles.challengeBoxActive}>
          <header>
            {t("challenges.earnXp", { amount: activeChallenge.amount })}
          </header>

          <main>
            <img
              src={`icons/${activeChallenge.type}.svg`}
              alt={t("challenges.challengeAlt")}
            />
            <strong>{t("challenges.newChallenge")}</strong>
            <p>{t(`challengeDescriptions.${activeChallenge.id}`)}</p>
          </main>
          <footer>
            <button
              className={styles.challengeBoxFailedButton}
              type="button"
              onClick={handleChallengeFailed}
            >
              {t("challenges.failed")}
            </button>
            <button
              className={styles.challengeBoxSucceededButton}
              type="button"
              onClick={handleChallengeSucceeded}
            >
              {t("challenges.succeeded")}
            </button>
          </footer>
        </div>
      ) : (
        <div className={styles.challengeBoxNotActive}>
          <strong>{t("challenges.finishCycleToReceive")}</strong>
          <p>
            <img src="icons/level-up.svg" alt="Level Up"></img>
            {t("challenges.advanceLevel")}
          </p>
        </div>
      )}
    </div>
  );
}
