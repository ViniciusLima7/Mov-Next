import { cookies } from "next/headers";
import { HomeClient } from "./home-client";

export default async function Home() {
  const cookieStore = await cookies();
  const level = Number(cookieStore.get("level")?.value) || 1;
  const currentExperience = Number(cookieStore.get("currentExperience")?.value) || 0;
  const challengesCompleted = Number(cookieStore.get("challengesCompleted")?.value) || 0;

  return (
    <HomeClient
      level={level}
      currentExperience={currentExperience}
      challengesCompleted={challengesCompleted}
    />
  );
}

