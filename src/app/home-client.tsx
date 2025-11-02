"use client";

import Head from "next/head";
import { ChallengeBox } from "../components/ChallengeBox";
import { CompletedChallenges } from "../components/CompletedChallenges";
import { Countdown } from "../components/Countdown";
import { ExperienceBar } from "../components/ExperienceBar";
import { Profile } from "../components/Profile";
import { ProfileSetupModal } from "../components/ProfileSetupModal";
import { CountdownProvider } from "../contexts/CountdownContext";
import { UserProvider } from "../contexts/UserContext";
import { ThemeProvider } from "../contexts/ThemeContext";
import { LanguageProvider } from "../contexts/LanguageContext";
import styles from "../styles/pages/Home.module.css";
import { ChallengesProvider } from "../contexts/ChallengesContext";
import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";

interface HomeClientProps {
  level: number;
  currentExperience: number;
  challengesCompleted: number;
}

function HomeContent() {
  const { isFirstVisit } = useContext(UserContext);

  return (
    <>
      {isFirstVisit && <ProfileSetupModal />}
      <div className={styles.container}>
        <Head>
          <title>FitPomo - Pomodoro Timer with Fitness Challenges</title>
        </Head>
        <ExperienceBar />

        <CountdownProvider>
          <section>
            <div>
              <Profile />
              <CompletedChallenges />
              <Countdown />
            </div>

            <div>
              <ChallengeBox />
            </div>
          </section>
        </CountdownProvider>
      </div>
    </>
  );
}

export function HomeClient({
  level,
  currentExperience,
  challengesCompleted,
}: HomeClientProps) {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <UserProvider>
          <ChallengesProvider
            level={level}
            currentExperience={currentExperience}
            challengesCompleted={challengesCompleted}
          >
            <HomeContent />
          </ChallengesProvider>
        </UserProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}
