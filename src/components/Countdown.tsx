
import { useContext } from 'react';
import { CountdownContext } from '../contexts/CountdownContext';
import styles from '../styles/components/Countdown.module.css'


export function Countdown() {

    const {
        minutes,
        seconds,
        hasFinished,
        isActive,
        startCountdown,
        resetCountdown } = useContext(CountdownContext)

    // --padstart ele verifica se tem duas variaveis e caso tenha menos que 2 vai colocar 0 na esquerda
    // --split divide a variavel por caractere se eu não colocar marcadador ele dividi cada um
    const [minuteLeft, minuteRight] = String(minutes).padStart(2, '0').split('');
    const [secondLeft, secondRight] = String(seconds).padStart(2, '0').split('');


    // --parametros useEffect = função e valor

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


            { hasFinished ? (
                <button
                    disabled
                    className={styles.countdownButton}
                >
                    Ciclo Encerrado
                </button>
            ) : (
                    <>
                        {isActive ? (
                            <button type="button"
                                className={`${styles.countdownButton} ${styles.countdownButtonActive}`}
                                onClick={resetCountdown}>
                                Abandonar Ciclo
                            </button>) :

                            (<button type="button"
                                className={styles.countdownButton}
                                onClick={startCountdown}>
                                Iniciar Ciclo
                            </button>

                            )}</>
                )}




        </div>

    );
}