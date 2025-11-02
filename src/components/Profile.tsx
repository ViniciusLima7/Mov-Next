"use client";

import { useContext, useState } from "react";
import { ChallengesContext } from "../contexts/ChallengesContext";
import { UserContext } from "../contexts/UserContext";
import { LanguageContext } from "../contexts/LanguageContext";
import { SettingsModal } from "./SettingsModal";
import styles from "../styles/components/Profile.module.css";

export function Profile() {
  const { level } = useContext(ChallengesContext);
  const { name, avatarUrl } = useContext(UserContext);
  const { t } = useContext(LanguageContext);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <>
      <div className={styles.profileContainer}>
        <img
          src={avatarUrl || "https://github.com/ghost.png"}
          alt={name || "User"}
        ></img>
        <div>
          <strong>{name || "User"}</strong>
          <p>
            <img src="icons/level.svg" alt="Level"></img>
            {t("common.level")} {level}
          </p>
        </div>
        <button
          className={styles.editButton}
          onClick={() => setIsSettingsOpen(true)}
          title={t("profile.settings")}
        >
          ⚙️
        </button>
      </div>

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
    </>
  );
}
