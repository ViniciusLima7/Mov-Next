"use client";

import { useContext } from 'react'
import { ChallengesContext } from '../contexts/ChallengesContext'
import { LanguageContext } from '../contexts/LanguageContext'
import styles from '../styles/components/LevelUpModal.module.css'

export function LevelUpModal() {
    const { level, closeLevelUpModal } = useContext(ChallengesContext)
    const { t } = useContext(LanguageContext)
    return (
        <div className={styles.overlay}>
            <div className={styles.container}>
                <header>{level}</header>
                <strong>{t("levelUp.congratulations")}</strong>
                <p>{t("levelUp.reachedNewLevel")}</p>

                <button type="button" onClick={closeLevelUpModal} >
                    <img src="./icons/close.svg" alt={t("levelUp.closeModal")}></img>
                </button>


            </div>

        </div>


    )
}