import { createContext, useState, ReactNode } from 'react';
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
    completeChallenge:() => void;
    levelUp: () => void;
}


interface ChallengesProviderProps {
    children: ReactNode;
}
export const ChallengesContext = createContext({} as ChallengesContextData);

export function ChallengesProvider({ children }: ChallengesProviderProps) {

    const [level, setLevel] = useState(1);
    const [currentExperience, setCurrenteExperience] = useState(30);
    const [challengesCompleted, setChallengesCompleted] = useState(2)

    const [activeChallenge, SetActiveChallenge] = useState(null);

    const experienceToNextLevel = Math.pow((level + 1) * 4, 2)

    function levelUp() {
        setLevel(level + 1);
    }

    function startNewChallenge() {
        const randomChallengeIndex = Math.floor(Math.random() * challenges.length)
        const challenge = challenges[randomChallengeIndex];

        SetActiveChallenge(challenge)
    }


    function reseteChallenge() {
        SetActiveChallenge(null);

    }


    function completeChallenge() {

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