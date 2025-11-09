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
import { TimerSettingsContext } from "./TimerSettingsContext";

interface CountdownContextData {
  minutes: number;
  seconds: number;
  hasFinished: boolean;
  isRestTime: boolean;
  isActive: boolean;
  isPaused: boolean;
  pomodoroCount: number;
  isLongBreak: boolean;
  startCountdown: () => void;
  resetCountdown: () => void;
  resetCountdownRest: () => void;
  pauseCountdown: () => void;
  resumeCountdown: () => void;
}

interface CountdownProviderProps {
  children: ReactNode;
}

export const CountdownContext = createContext({} as CountdownContextData);

export function CountdownProvider({ children }: CountdownProviderProps) {
  const { startNewChallenge, activeChallenge, reseteChallenge } =
    useContext(ChallengesContext);
  const {
    workDuration,
    shortBreakDuration,
    longBreakDuration,
    cyclesUntilLongBreak,
  } = useContext(TimerSettingsContext);

  const [time, setTime] = useState(workDuration * 60);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);
  const [isRestTime, setIsRestTime] = useState(false);
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const [isLongBreak, setIsLongBreak] = useState(false);

  const startTimeRef = useRef<number>(0);
  const durationRef = useRef<number>(workDuration * 60);

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  // Atualiza o timer quando as configurações mudarem (se não estiver ativo)
  useEffect(() => {
    if (!isActive && !isRestTime) {
      setTime(workDuration * 60);
    }
  }, [workDuration, isActive, isRestTime]);

  // Atualiza o timer de pausa quando as configurações mudarem (se estiver em pausa mas não ativo)
  useEffect(() => {
    if (!isActive && isRestTime) {
      if (isLongBreak) {
        setTime(longBreakDuration * 60);
      } else {
        setTime(shortBreakDuration * 60);
      }
    }
  }, [
    shortBreakDuration,
    longBreakDuration,
    isActive,
    isRestTime,
    isLongBreak,
  ]);

  function startCountdown() {
    if (activeChallenge) {
      reseteChallenge();
    }

    startTimeRef.current = Date.now();
    durationRef.current = time;
    setIsActive(true);
    setIsPaused(false);
  }

  function resetCountdown() {
    setIsActive(false);
    setIsPaused(false);
    setHasFinished(false);
    setIsRestTime(false);
    setIsLongBreak(false);
    setTime(workDuration * 60);
  }

  function resetCountdownRest() {
    setIsActive(false);
    setIsPaused(false);
    setHasFinished(false);
    setIsRestTime(false);
    setIsLongBreak(false);
    setTime(workDuration * 60);
  }

  function pauseCountdown() {
    if (isActive && !isRestTime) {
      setIsPaused(true);
      // Salva o tempo restante exato no momento da pausa
      durationRef.current = time;
    }
  }

  function resumeCountdown() {
    if (isPaused && !isRestTime) {
      // Reinicia o contador a partir do tempo salvo
      startTimeRef.current = Date.now();
      durationRef.current = time;
      setIsPaused(false);
    }
  }

  function startRestTime() {
    const newPomodoroCount = pomodoroCount + 1;
    setPomodoroCount(newPomodoroCount);

    if (newPomodoroCount >= cyclesUntilLongBreak) {
      setIsLongBreak(true);
      setTime(longBreakDuration * 60);
    } else {
      setIsLongBreak(false);
      setTime(shortBreakDuration * 60);
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
    setTime(workDuration * 60);
    startNewChallenge();
  }

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isActive && !isPaused) {
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
  }, [isActive, isPaused, isRestTime]);

  return (
    <CountdownContext.Provider
      value={{
        minutes,
        seconds,
        hasFinished,
        isRestTime,
        isActive,
        isPaused,
        pomodoroCount,
        isLongBreak,
        startCountdown,
        resetCountdown,
        resetCountdownRest,
        pauseCountdown,
        resumeCountdown,
      }}
    >
      {children}
    </CountdownContext.Provider>
  );
}
