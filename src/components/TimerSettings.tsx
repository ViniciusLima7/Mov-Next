"use client";

import { useContext, useState, useEffect } from "react";
import { TimerSettingsContext } from "../contexts/TimerSettingsContext";
import { LanguageContext } from "../contexts/LanguageContext";
import styles from "../styles/components/TimerSettings.module.css";

export function TimerSettings() {
  const {
    workDuration,
    shortBreakDuration,
    longBreakDuration,
    cyclesUntilLongBreak,
    updateTimerSettings,
  } = useContext(TimerSettingsContext);

  const { t } = useContext(LanguageContext);

  const [localWork, setLocalWork] = useState(workDuration);
  const [localShort, setLocalShort] = useState(shortBreakDuration);
  const [localLong, setLocalLong] = useState(longBreakDuration);
  const [localCycles, setLocalCycles] = useState(cyclesUntilLongBreak);

  useEffect(() => {
    setLocalWork(workDuration);
    setLocalShort(shortBreakDuration);
    setLocalLong(longBreakDuration);
    setLocalCycles(cyclesUntilLongBreak);
  }, [
    workDuration,
    shortBreakDuration,
    longBreakDuration,
    cyclesUntilLongBreak,
  ]);

  // Helper para pluralização
  const getMinuteText = (value: number) => {
    return value === 1 ? t("timer.minute") : t("timer.minutes");
  };

  function handleWorkChange(value: number) {
    const clamped = Math.max(1, Math.min(60, value));
    setLocalWork(clamped);
    updateTimerSettings({ workDuration: clamped });
  }

  function handleShortChange(value: number) {
    const clamped = Math.max(1, Math.min(30, value));
    setLocalShort(clamped);
    updateTimerSettings({ shortBreakDuration: clamped });
  }

  function handleLongChange(value: number) {
    const clamped = Math.max(1, Math.min(60, value));
    setLocalLong(clamped);
    updateTimerSettings({ longBreakDuration: clamped });
  }

  function handleCyclesChange(value: number) {
    const clamped = Math.max(2, Math.min(10, value));
    setLocalCycles(clamped);
    updateTimerSettings({ cyclesUntilLongBreak: clamped });
  }

  function handleResetDefaults() {
    handleWorkChange(25);
    handleShortChange(5);
    handleLongChange(15);
    handleCyclesChange(4);
  }

  return (
    <div className={styles.container}>
      <div className={styles.settingItem}>
        <div className={styles.settingLabel}>
          <strong>🍅 {t("timer.workDuration")}</strong>
          <span>{getMinuteText(localWork)}</span>
        </div>
        <div className={styles.settingControl}>
          <button
            onClick={() => handleWorkChange(localWork - 1)}
            disabled={localWork <= 1}
          >
            −
          </button>
          <input
            type="number"
            min="1"
            max="60"
            value={localWork}
            onChange={(e) => handleWorkChange(parseInt(e.target.value) || 1)}
          />
          <button
            onClick={() => handleWorkChange(localWork + 1)}
            disabled={localWork >= 60}
          >
            +
          </button>
        </div>
      </div>

      <div className={styles.settingItem}>
        <div className={styles.settingLabel}>
          <strong>☕ {t("timer.shortBreak")}</strong>
          <span>{getMinuteText(localShort)}</span>
        </div>
        <div className={styles.settingControl}>
          <button
            onClick={() => handleShortChange(localShort - 1)}
            disabled={localShort <= 1}
          >
            −
          </button>
          <input
            type="number"
            min="1"
            max="30"
            value={localShort}
            onChange={(e) => handleShortChange(parseInt(e.target.value) || 1)}
          />
          <button
            onClick={() => handleShortChange(localShort + 1)}
            disabled={localShort >= 30}
          >
            +
          </button>
        </div>
      </div>

      <div className={styles.settingItem}>
        <div className={styles.settingLabel}>
          <strong>☕ {t("timer.longBreak")}</strong>
          <span>{getMinuteText(localLong)}</span>
        </div>
        <div className={styles.settingControl}>
          <button
            onClick={() => handleLongChange(localLong - 1)}
            disabled={localLong <= 1}
          >
            −
          </button>
          <input
            type="number"
            min="1"
            max="60"
            value={localLong}
            onChange={(e) => handleLongChange(parseInt(e.target.value) || 1)}
          />
          <button
            onClick={() => handleLongChange(localLong + 1)}
            disabled={localLong >= 60}
          >
            +
          </button>
        </div>
      </div>

      <div className={styles.settingItem}>
        <div className={styles.settingLabel}>
          <strong>🔄 {t("timer.cyclesUntilLongBreak")}</strong>
          <span>{t("timer.cycles")}</span>
        </div>
        <div className={styles.settingControl}>
          <button
            onClick={() => handleCyclesChange(localCycles - 1)}
            disabled={localCycles <= 2}
          >
            −
          </button>
          <input
            type="number"
            min="2"
            max="10"
            value={localCycles}
            onChange={(e) => handleCyclesChange(parseInt(e.target.value) || 2)}
          />
          <button
            onClick={() => handleCyclesChange(localCycles + 1)}
            disabled={localCycles >= 10}
          >
            +
          </button>
        </div>
      </div>

      <div className={styles.note}>
        <p>
          <strong>{t("timer.note")}</strong> {t("timer.noteDescription")}
        </p>
      </div>

      <button className={styles.resetButton} onClick={handleResetDefaults}>
        {t("timer.resetDefaults")}
      </button>
    </div>
  );
}
