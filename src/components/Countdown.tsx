import { useContext } from "react";
import { CountdownContext } from "../contexts/CountdownContext";
import styles from "../styles/components/Countdown.module.css";

export function Countdown() {
  const {
    minutes,
    seconds,
    hasFinished,
    isRestTime,
    isActive,
    startCountdown,
    resetCountdown,
  } = useContext(CountdownContext);

  // --padstart ele verifica se tem duas variaveis e caso tenha menos que 2 vai colocar 0 na esquerda
  // --split divide a variavel por caractere se eu não colocar marcadador ele dividi cada um
  const [minuteLeft, minuteRight] = String(minutes).padStart(2, "0").split("");
  const [secondLeft, secondRight] = String(seconds).padStart(2, "0").split("");
  const isTimerZero = minutes === 0 && seconds === 0;

  return (
    <div>
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

      {hasFinished ? (
        isRestTime && isActive && !isTimerZero ? (
          <button
            onClick={resetCountdown}
            className={`${styles.countdownButton} ${styles.countdownButtonActive}`}
          >
            Abandonar Descanso
          </button>
        ) : isRestTime && !isTimerZero ? (
          <button onClick={startCountdown} className={styles.countdownButton}>
            Iniciar Descanso
          </button>
        ) : (
          <button
            disabled
            onClick={startCountdown}
            className={styles.countdownButton}
          >
            Ciclo Encerrado
          </button>
        )
      ) : (
        <>
          {isActive ? (
            <button
              type="button"
              className={`${styles.countdownButton} ${styles.countdownButtonActive}`}
              onClick={resetCountdown}
            >
              Abandonar Ciclo
            </button>
          ) : (
            <button
              type="button"
              className={styles.countdownButton}
              onClick={startCountdown}
            >
              Iniciar Ciclo
            </button>
          )}
        </>
      )}
    </div>
  );
}
