"use client";

import { useContext, useEffect } from "react";
import { CountdownContext } from "../contexts/CountdownContext";
import { LanguageContext } from "../contexts/LanguageContext";
import { TimerSettingsContext } from "../contexts/TimerSettingsContext";
import styles from "../styles/components/Countdown.module.css";

export function Countdown() {
  const {
    minutes,
    seconds,
    hasFinished,
    isRestTime,
    isActive,
    isPaused,
    pomodoroCount,
    isLongBreak,
    startCountdown,
    resetCountdown,
    resetCountdownRest,
    pauseCountdown,
    resumeCountdown,
  } = useContext(CountdownContext);

  const { t } = useContext(LanguageContext);
  const { cyclesUntilLongBreak, shortBreakDuration, longBreakDuration } =
    useContext(TimerSettingsContext);

  // --padstart ele verifica se tem duas variaveis e caso tenha menos que 2 vai colocar 0 na esquerda
  // --split divide a variavel por caractere se eu não colocar marcadador ele dividi cada um
  const [minuteLeft, minuteRight] = String(minutes).padStart(2, "0").split("");
  const [secondLeft, secondRight] = String(seconds).padStart(2, "0").split("");
  const isTimerZero = minutes === 0 && seconds === 0;

  // Helper para pluralização
  const getMinuteText = (value: number) => {
    return value === 1 ? t("timer.minute") : t("timer.minutes");
  };

  // Atualiza o título da página com o timer
  useEffect(() => {
    const timeString = `${minuteLeft}${minuteRight}:${secondLeft}${secondRight}`;

    if (isActive) {
      if (isRestTime) {
        const breakType = isLongBreak ? "☕" : "☕";
        document.title = `${timeString} ${breakType} - FitPomo`;
      } else {
        // Adiciona indicador de pausa se estiver pausado
        const pauseIndicator = isPaused ? "⏸️ " : "🍅 ";
        document.title = `${timeString} ${pauseIndicator}- FitPomo`;
      }
    } else {
      document.title = "FitPomo";
    }

    // Cleanup: restaura título original quando desmonta
    return () => {
      document.title = "FitPomo";
    };
  }, [
    minutes,
    seconds,
    isActive,
    isPaused,
    isRestTime,
    isLongBreak,
    minuteLeft,
    minuteRight,
    secondLeft,
    secondRight,
  ]);

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
          🍅 {t("common.pomodoro")} {pomodoroCount + 1}/{cyclesUntilLongBreak}
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
          {isLongBreak
            ? `☕ ${t("timer.longBreak")} (${longBreakDuration} ${getMinuteText(
                longBreakDuration
              )})`
            : `☕ ${t(
                "timer.shortBreak"
              )} (${shortBreakDuration} ${getMinuteText(shortBreakDuration)})`}
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
            <div className={styles.buttonGroup}>
              {isPaused ? (
                <button
                  type="button"
                  className={styles.countdownButton}
                  onClick={resumeCountdown}
                >
                  {t("pomodoro.resumeCycle")}
                </button>
              ) : (
                <button
                  type="button"
                  className={`${styles.countdownButton} ${styles.countdownButtonPause}`}
                  onClick={pauseCountdown}
                >
                  {t("pomodoro.pauseCycle")}
                </button>
              )}
              <button
                type="button"
                className={`${styles.countdownButton} ${styles.countdownButtonActive}`}
                onClick={resetCountdown}
              >
                {t("pomodoro.abandonCycle")}
              </button>
            </div>
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
