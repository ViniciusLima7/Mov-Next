import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { ChallengesContext } from "./ChallengesContext";

interface CountdownContextData {
  minutes: number;
  seconds: number;
  hasFinished: boolean;
  isRestTime: boolean;
  isActive: boolean;
  startCountdown: () => void;
  resetCountdown: () => void;
  resetCountdownRest: () => void;
}

interface CountdownProviderProps {
  children: ReactNode;
}

export const CountdownContext = createContext({} as CountdownContextData);

let countdownTimeout: NodeJS.Timeout;

export function CountdownProvider({ children }: CountdownProviderProps) {
  const { startNewChallenge } = useContext(ChallengesContext);

  const [time, setTime] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);
  const [isRestTime, setIsRestTime] = useState(false);

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  function startCountdown() {
    setIsActive(true);
  }

  function resetCountdown() {
    clearTimeout(countdownTimeout);
    setIsActive(false);
    setHasFinished(false);
    setIsRestTime(false);
    setTime(25 * 60);
  }

  function resetCountdownRest() {
    clearTimeout(countdownTimeout);
    setIsActive(false);
    setTime(4.5 * 60);
  }

  function toggleRestTime() {
    setIsRestTime((prevState) => !prevState);
    setTime(4.5 * 60);
  }

  useEffect(() => {
    if (isActive && time > 0) {
      countdownTimeout = setTimeout(() => {
        setTime(time - 1);
      }, 1000);
    } else if (isActive && time === 0) {
      setHasFinished(true);
      setIsActive(false);
      toggleRestTime();
    } else if (!isActive && !isRestTime && hasFinished) {
      setTime(0);
      startNewChallenge();
    }
  }, [isActive, time]);

  return (
    <CountdownContext.Provider
      value={{
        minutes,
        seconds,
        hasFinished,
        isRestTime,
        isActive,
        startCountdown,
        resetCountdown,
        resetCountdownRest,
      }}
    >
      {children}
    </CountdownContext.Provider>
  );
}
