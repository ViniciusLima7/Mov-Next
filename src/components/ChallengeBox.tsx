import { useContext } from 'react';
import { ChallengesContext } from '../contexts/ChallengesContext';

import styles from '../styles/components/ChallengeBox.module.css';


export function ChallengeBox() {



    const { activeChallenge, reseteChallenge } = useContext(ChallengesContext);

    return (
        <div className={styles.challengeBoxContainer}>
            {activeChallenge ? (

                <div className={styles.challengeBoxActive}>
                    <header>Ganhe {activeChallenge.amount} xp</header>


                    <main>
                        <img src={`icons/${activeChallenge.type}.svg`}></img>
                        <strong>Novo Desafio</strong>
                        <p>{activeChallenge.description}</p>
                    </main>
                    <footer>
                        <button
                            className={styles.challengeBoxFailedButton}
                            type="button"
                            onClick={reseteChallenge}>
                            Falhei
                        </button>
                        <button className={styles.challengeBoxSucceededButton} type="button">
                            Completei
                        </button>
                    </footer>

                </div>
            ) : (
                    <div className={styles.challengeBoxNotActive}>
                        <strong>Finalize um ciclo para receber um desafio</strong>
                        <p>
                            <img src="icons/level-up.svg" alt="Level Up"></img>
                Avance de level completando desafios
            </p>
                    </div>
                )}


        </div>

    );
}