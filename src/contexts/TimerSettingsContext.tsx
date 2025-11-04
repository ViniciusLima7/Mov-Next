"use client";

import { createContext, ReactNode, useState, useEffect } from "react";

interface TimerSettings {
  workDuration: number; // em minutos
  shortBreakDuration: number; // em minutos
  longBreakDuration: number; // em minutos
  cyclesUntilLongBreak: number;
}

interface TimerSettingsContextData extends TimerSettings {
  updateTimerSettings: (settings: Partial<TimerSettings>) => void;
}

interface TimerSettingsProviderProps {
  children: ReactNode;
}

const DEFAULT_SETTINGS: TimerSettings = {
  workDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  cyclesUntilLongBreak: 4,
};

export const TimerSettingsContext = createContext(
  {} as TimerSettingsContextData
);

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}

function setCookie(name: string, value: string, days: number = 365) {
  if (typeof document === "undefined") return;
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

function loadTimerSettings(): TimerSettings {
  if (typeof document === "undefined") return DEFAULT_SETTINGS;

  const saved = getCookie("timerSettings");
  if (!saved) return DEFAULT_SETTINGS;

  try {
    const parsed = JSON.parse(decodeURIComponent(saved));
    return {
      workDuration: parsed.workDuration || DEFAULT_SETTINGS.workDuration,
      shortBreakDuration:
        parsed.shortBreakDuration || DEFAULT_SETTINGS.shortBreakDuration,
      longBreakDuration:
        parsed.longBreakDuration || DEFAULT_SETTINGS.longBreakDuration,
      cyclesUntilLongBreak:
        parsed.cyclesUntilLongBreak || DEFAULT_SETTINGS.cyclesUntilLongBreak,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function TimerSettingsProvider({
  children,
}: TimerSettingsProviderProps) {
  const [settings, setSettings] = useState<TimerSettings>(DEFAULT_SETTINGS);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const loadedSettings = loadTimerSettings();
    setSettings(loadedSettings);
    setIsInitialized(true);
  }, []);

  function updateTimerSettings(newSettings: Partial<TimerSettings>) {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };

      // Validações
      if (updated.workDuration < 1) updated.workDuration = 1;
      if (updated.workDuration > 60) updated.workDuration = 60;
      if (updated.shortBreakDuration < 1) updated.shortBreakDuration = 1;
      if (updated.shortBreakDuration > 30) updated.shortBreakDuration = 30;
      if (updated.longBreakDuration < 1) updated.longBreakDuration = 1;
      if (updated.longBreakDuration > 60) updated.longBreakDuration = 60;
      if (updated.cyclesUntilLongBreak < 2) updated.cyclesUntilLongBreak = 2;
      if (updated.cyclesUntilLongBreak > 10) updated.cyclesUntilLongBreak = 10;

      // Salvar no cookie
      setCookie("timerSettings", encodeURIComponent(JSON.stringify(updated)));

      return updated;
    });
  }

  if (!isInitialized) {
    return null;
  }

  return (
    <TimerSettingsContext.Provider
      value={{
        ...settings,
        updateTimerSettings,
      }}
    >
      {children}
    </TimerSettingsContext.Provider>
  );
}
