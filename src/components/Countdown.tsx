import { useState, useEffect, useContext } from 'react';
import { ChallengesContext } from '../contexts/ChallengesContext';
import styles from '../styles/components/Countdown.module.css'

let countdownTimeout: NodeJS.Timeout;

export function Countdown() {

    const { startNewChallenge } = useContext(ChallengesContext)

    const [time, SetTime] = useState(0.1 * 60);
    const [isActive, SetIsActive] = useState(false);
    const [hasFinished, SetHasFinished] = useState(false);


    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    // --padstart ele verifica se tem duas variaveis e caso tenha menos que 2 vai colocar 0 na esquerda
    // --split divide a variavel por caractere se eu não colocar marcadador ele dividi cada um
    const [minuteLeft, minuteRight] = String(minutes).padStart(2, '0').split('');
    const [secondLeft, secondRight] = String(seconds).padStart(2, '0').split('');

    function startCountdown() {

        SetIsActive(true);
    }


    function resetCountdown() {
        clearTimeout(countdownTimeout);
        SetIsActive(false);
        SetTime(0.1 * 60);
    }
    // --parametros useEffect = função e valor
    useEffect(() => {

        if (isActive && time > 0) {
            countdownTimeout = setTimeout(() => {
                SetTime(time - 1);
            }, 1000)
        } else if (isActive && time === 0) {
            SetHasFinished(true);
            SetIsActive(false);
            startNewChallenge();
        }
        // console.log(active);  --verificar como esta no navegador aba console
    }, [isActive, time])
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