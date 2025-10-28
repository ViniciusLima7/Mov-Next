"use client";

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
  pomodoroCount: number;
  isLongBreak: boolean;
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

  const [time, setTime] = useState(1 * 10);
  const [isActive, setIsActive] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);
  const [isRestTime, setIsRestTime] = useState(false);
  const [pomodoroCount, setPomodoroCount] = useState(0); // 0-4 pomodoros
  const [isLongBreak, setIsLongBreak] = useState(false);

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
    setIsLongBreak(false);
    setTime(1 * 10);
  }

  function resetCountdownRest() {
    clearTimeout(countdownTimeout);
    setIsActive(false);
    setHasFinished(false);
    setIsRestTime(false);
    setIsLongBreak(false);
    setTime(1 * 10);
  }

  function startRestTime() {
    // Incrementa contador de pomodoros quando termina um ciclo de trabalho
    const newPomodoroCount = pomodoroCount + 1;
    setPomodoroCount(newPomodoroCount);

    // Decide se é pausa curta ou longa
    if (newPomodoroCount >= 4) {
      // Pausa longa de 15 minutos
      setIsLongBreak(true);
      setTime(15 * 60);
    } else {
      // Pausa curta de 5 minutos
      setIsLongBreak(false);
      setTime(1 * 5);
    }

    setIsRestTime(true);
    setHasFinished(true);
    setIsActive(false);
  }

  function completeRestTime() {
    // Se completou pausa longa, reseta contador de pomodoros
    if (isLongBreak) {
      setPomodoroCount(0);
    }

    // Para o timer para não iniciar automaticamente
    setIsActive(false);
    setIsRestTime(false);
    setIsLongBreak(false);
    setHasFinished(false);
    setTime(1 * 10);
    startNewChallenge();
  }

  useEffect(() => {
    if (isActive && time > 0) {
      countdownTimeout = setTimeout(() => {
        setTime(time - 1);
      }, 1000);
    } else if (isActive && time === 0 && !isRestTime) {
      // Terminou um pomodoro de trabalho - inicia pausa
      startRestTime();
    } else if (isActive && time === 0 && isRestTime) {
      // Terminou uma pausa - volta pro trabalho
      completeRestTime();
    }
  }, [isActive, time, isRestTime]);

  return (
    <CountdownContext.Provider
      value={{
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
      }}
    >
      {children}
    </CountdownContext.Provider>
  );
}
