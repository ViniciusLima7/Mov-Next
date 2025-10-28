"use client";

import { createContext, useState, ReactNode, useEffect } from 'react';
import Cookies from 'js-cookie';
import challenges from '../../challenges.json';
import { LevelUpModal } from '../components/LevelUpModal';



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
    closeLevelUpModal: () => void;
    levelUp: () => void;
}


interface ChallengesProviderProps {
    children: ReactNode;

    level: number
    currentExperience: number
    challengesCompleted: number

}
export const ChallengesContext = createContext({} as ChallengesContextData);

export function ChallengesProvider({ children, ...rest }: ChallengesProviderProps) {

    const [level, setLevel] = useState(rest.level ?? 1);
    const [currentExperience, setCurrenteExperience] = useState(rest.currentExperience ?? 0);
    const [challengesCompleted, setChallengesCompleted] = useState(rest.challengesCompleted ?? 0);

    const [activeChallenge, SetActiveChallenge] = useState<Challenge | null>(null);
    const [isLevelUpModalOpen, SetIsLevelUpModalOpen] = useState(false);


    const experienceToNextLevel = Math.pow((level + 1) * 4, 2)

    // ArrAY VAZIO [] e quando sera executado apenas uma vez quando for apresentado essa tela
    useEffect(() => {
        Notification.requestPermission();
    }, [])


    useEffect(() => {
        Cookies.set('level', String(level));
        Cookies.set('currentExperience', String(currentExperience));
        Cookies.set('challengesCompleted', String(challengesCompleted));

    }, [level, currentExperience, challengesCompleted])

    function levelUp() {
        setLevel(level + 1);
        SetIsLevelUpModalOpen(true);
    }

    function closeLevelUpModal(){
        SetIsLevelUpModalOpen(false);
    }

    function startNewChallenge() {
        const randomChallengeIndex = Math.floor(Math.random() * challenges.length)
        const challenge = challenges[randomChallengeIndex];

        SetActiveChallenge(challenge);

        new Audio('/notification.mp3').play();
        // O que vai aparecer na notificação quando tiver desafio
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
                closeLevelUpModal,
                levelUp
            }}>
            {children}

            {isLevelUpModalOpen && <LevelUpModal />}
        </ChallengesContext.Provider>
    )
}