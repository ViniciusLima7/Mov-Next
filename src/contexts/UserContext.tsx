"use client";

import { createContext, useState, ReactNode, useEffect } from "react";
import Cookies from "js-cookie";

interface UserContextData {
  name: string;
  avatarUrl: string;
  githubUsername: string;
  updateUser: (name: string, avatarUrl: string, githubUsername: string) => void;
  isFirstVisit: boolean;
  completeSetup: () => void;
}

interface UserProviderProps {
  children: ReactNode;
}

export const UserContext = createContext({} as UserContextData);

export function UserProvider({ children }: UserProviderProps) {
  const [name, setName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [githubUsername, setGithubUsername] = useState("");
  const [isFirstVisit, setIsFirstVisit] = useState(true);

  useEffect(() => {
    const savedName = Cookies.get("userName");
    const savedAvatar = Cookies.get("userAvatar");
    const savedGithubUsername = Cookies.get("githubUsername");
    const hasCompletedSetup = Cookies.get("hasCompletedSetup");

    if (savedName && savedAvatar) {
      setName(savedName);
      setAvatarUrl(savedAvatar);
    }

    if (savedGithubUsername) {
      setGithubUsername(savedGithubUsername);
    }

    if (hasCompletedSetup === "true") {
      setIsFirstVisit(false);
    }
  }, []);

  function updateUser(
    newName: string,
    newAvatarUrl: string,
    newGithubUsername: string
  ) {
    setName(newName);
    setAvatarUrl(newAvatarUrl);
    setGithubUsername(newGithubUsername);

    Cookies.set("userName", newName);
    Cookies.set("userAvatar", newAvatarUrl);
    Cookies.set("githubUsername", newGithubUsername);
  }

  function completeSetup() {
    setIsFirstVisit(false);
    Cookies.set("hasCompletedSetup", "true");
  }

  return (
    <UserContext.Provider
      value={{
        name,
        avatarUrl,
        githubUsername,
        updateUser,
        isFirstVisit,
        completeSetup,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
