"use client";

import { useContext } from "react";
import { CountdownContext } from "../contexts/CountdownContext";
import { LanguageContext } from "../contexts/LanguageContext";
import styles from "../styles/components/Countdown.module.css";

export function Countdown() {
  const {
    minutes,
    seconds,
    hasFinished,
    isRestTime,
    isActive,
    pomodoroCount,
    isLongBreak,
    startCountdown,
    resetCountdown,
    resetCountdownRest,
  } = useContext(CountdownContext);

  const { t } = useContext(LanguageContext);

  // --padstart ele verifica se tem duas variaveis e caso tenha menos que 2 vai colocar 0 na esquerda
  // --split divide a variavel por caractere se eu não colocar marcadador ele dividi cada um
  const [minuteLeft, minuteRight] = String(minutes).padStart(2, "0").split("");
  const [secondLeft, secondRight] = String(seconds).padStart(2, "0").split("");
  const isTimerZero = minutes === 0 && seconds === 0;

  return (
    <div>
      {/* Pomodoro Counter */}
      {!isRestTime && (
        <div
          style={{
            textAlign: "center",
            marginBottom: "1rem",
            fontSize: "1.2rem",
            fontWeight: 600,
          }}
        >
          {t("pomodoro.count", { count: pomodoroCount + 1 })}
        </div>
      )}

      {/* Rest Time Indicator */}
      {isRestTime && (
        <div
          style={{
            textAlign: "center",
            marginBottom: "1rem",
            fontSize: "1.2rem",
            fontWeight: 600,
          }}
        >
          {isLongBreak ? t("pomodoro.longBreak") : t("pomodoro.shortBreak")}
        </div>
      )}

      <div className={styles.countdownContainer}>
        <div>
          <span>{minuteLeft}</span>
          <span>{minuteRight}</span>
        </div>

        <span>:</span>

        <div>
          <span>{secondLeft}</span>
          <span>{secondRight}</span>
        </div>
      </div>

      {isRestTime ? (
        <>
          {isActive ? (
            <button
              onClick={resetCountdownRest}
              className={`${styles.countdownButton} ${styles.countdownButtonActive}`}
            >
              {t("pomodoro.abandonBreak")}
            </button>
          ) : (
            <button onClick={startCountdown} className={styles.countdownButton}>
              {isLongBreak
                ? t("pomodoro.startLongBreak")
                : t("pomodoro.startShortBreak")}
            </button>
          )}
        </>
      ) : (
        <>
          {isActive ? (
            <button
              type="button"
              className={`${styles.countdownButton} ${styles.countdownButtonActive}`}
              onClick={resetCountdown}
            >
              {t("pomodoro.abandonCycle")}
            </button>
          ) : (
            <button
              type="button"
              className={styles.countdownButton}
              onClick={startCountdown}
            >
              {t("pomodoro.startCycle")}
            </button>
          )}
        </>
      )}
    </div>
  );
}
