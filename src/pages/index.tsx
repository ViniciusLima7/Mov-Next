import Head from "next/head";

import { GetServerSideProps } from "next";
import { ChallengeBox } from "../components/ChallengeBox";
import { cookies } from "next/headers";

import { CompletedChallenges } from "../components/CompletedChallenges";
import { Countdown } from "../components/Countdown";
import { ExperienceBar } from "../components/ExperienceBar";
import { Profile } from "../components/Profile";
import { CountdownProvider } from "../contexts/CountdownContext";

import styles from "../styles/pages/Home.module.css";
import { ChallengesProvider } from "../contexts/ChallengesContext";

interface HomeProps {
  level: number;
  currentExperience: number;
  challengesCompleted: number;
}

export default function Home(props: HomeProps) {
  return (
    <ChallengesProvider
      level={props.level}
      currentExperience={props.currentExperience}
      challengesCompleted={props.challengesCompleted}
    >
      <div className={styles.container}>
        <Head>
          <title>Inicio | Mov-Next</title>
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
    </ChallengesProvider>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const cookieStore = await cookies();
  const level = cookieStore.get("level")?.value;
  const currentExperience = cookieStore.get("currentExperience")?.value;
  const challengesCompleted = cookieStore.get("challengesCompleted")?.value;

  return {
    props: {
      level: Number(level) || 1,
      currentExperience: Number(currentExperience) || 0,
      challengesCompleted: Number(challengesCompleted) || 0,
    },
  };
};
