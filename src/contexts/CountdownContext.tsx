"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
  useRef,
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

export function CountdownProvider({ children }: CountdownProviderProps) {
  const { startNewChallenge } = useContext(ChallengesContext);

  const [time, setTime] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);
  const [isRestTime, setIsRestTime] = useState(false);
  const [pomodoroCount, setPomodoroCount] = useState(0); // 0-4 pomodoros
  const [isLongBreak, setIsLongBreak] = useState(false);

  const startTimeRef = useRef<number>(0);
  const durationRef = useRef<number>(25 * 60);

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  function startCountdown() {
    startTimeRef.current = Date.now();
    durationRef.current = time;
    setIsActive(true);
  }

  function resetCountdown() {
    setIsActive(false);
    setHasFinished(false);
    setIsRestTime(false);
    setIsLongBreak(false);
    setTime(25 * 60);
  }

  function resetCountdownRest() {
    setIsActive(false);
    setHasFinished(false);
    setIsRestTime(false);
    setIsLongBreak(false);
    setTime(25 * 60);
  }

  function startRestTime() {
    const newPomodoroCount = pomodoroCount + 1;
    setPomodoroCount(newPomodoroCount);

    if (newPomodoroCount >= 4) {
      setIsLongBreak(true);
      setTime(15 * 60);
    } else {
      // Pausa curta de 5 minutos
      setIsLongBreak(false);
      setTime(5 * 60);
    }

    setIsRestTime(true);
    setHasFinished(true);
    setIsActive(false);
  }

  function completeRestTime() {
    if (isLongBreak) {
      setPomodoroCount(0);
    }

    setIsActive(false);
    setIsRestTime(false);
    setIsLongBreak(false);
    setHasFinished(false);
    setTime(25 * 60);
    startNewChallenge();
  }

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isActive) {
      intervalId = setInterval(() => {
        const elapsedTime = Math.floor(
          (Date.now() - startTimeRef.current) / 1000
        );
        const newTime = Math.max(0, durationRef.current - elapsedTime);

        setTime(newTime);

        if (newTime === 0) {
          clearInterval(intervalId);

          if (!isRestTime) {
            startRestTime();
          } else {
            completeRestTime();
          }
        }
      }, 100);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isActive, isRestTime]);

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
