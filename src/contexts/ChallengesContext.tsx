import { createContext, useState, ReactNode, useEffect } from 'react';
import challenges from '../../challenges.json';

interface Challenge {
    type: 'body' | 'eye';
    description: string;
    amount: number;
}


interface ChallengesContextData {
    level: number;
    currentExperience: number;
    challengesCompleted: number;
    startNewChallenge: () => void;
    activeChallenge: Challenge;
    reseteChallenge: () => void;
    experienceToNextLevel: number;
    completeChallenge: () => void;
    levelUp: () => void;
}


interface ChallengesProviderProps {
    children: ReactNode;
}
export const ChallengesContext = createContext({} as ChallengesContextData);

export function ChallengesProvider({ children }: ChallengesProviderProps) {

    const [level, setLevel] = useState(1);
    const [currentExperience, setCurrenteExperience] = useState(0);
    const [challengesCompleted, setChallengesCompleted] = useState(0)

    const [activeChallenge, SetActiveChallenge] = useState(null);

    const experienceToNextLevel = Math.pow((level + 1) * 4, 2)

    // ArrAY VAZIO [] e quando sera executado apenas uma vez quando for apresentado essa tela
    useEffect(() => {
        Notification.requestPermission();
    }, [])


    function levelUp() {
        setLevel(level + 1);
    }

    function startNewChallenge() {
        const randomChallengeIndex = Math.floor(Math.random() * challenges.length)
        const challenge = challenges[randomChallengeIndex];

        SetActiveChallenge(challenge)

        new Audio('/notification.mp3').play;

        if (Notification.permission === 'granted') {
            new Notification('Novo desafio 🎉', {
                body: `Valendo ${challenge.amount} xp !`
            })
        }
    }


    function reseteChallenge() {
        SetActiveChallenge(null);

    }


    function completeChallenge() {
        if (!activeChallenge) {
            return;
        }
        const { amount } = activeChallenge;


        //let it change - deixe isso mudar, pode mudar
        let finalExperience = currentExperience + amount;

        if (finalExperience >= experienceToNextLevel) {
            levelUp();
            finalExperience = finalExperience - experienceToNextLevel;
        }

        setCurrenteExperience(finalExperience);
        SetActiveChallenge(null);
        setChallengesCompleted(challengesCompleted + 1);
    }


    return (
        <ChallengesContext.Provider
            value={{
                level,
                currentExperience,
                challengesCompleted,
                startNewChallenge,
                activeChallenge,
                reseteChallenge,
                experienceToNextLevel,
                completeChallenge,
                levelUp
            }}>
            {children}
        </ChallengesContext.Provider>
    )
}