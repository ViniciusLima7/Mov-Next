"use client";

import { useState, useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import styles from "../styles/components/ProfileSetupModal.module.css";

export function ProfileSetupModal() {
  const { updateUser, completeSetup } = useContext(UserContext);
  const [name, setName] = useState("");
  const [githubUsername, setGithubUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isLoadingAvatar, setIsLoadingAvatar] = useState(false);
  const [error, setError] = useState("");

  async function handleFetchGithubAvatar() {
    if (!githubUsername.trim()) {
      setError("Digite um username do GitHub");
      return;
    }

    setIsLoadingAvatar(true);
    setError("");

    try {
      const response = await fetch(
        `https://api.github.com/users/${githubUsername}`
      );

      if (!response.ok) {
        throw new Error("Usuário não encontrado");
      }

      const data = await response.json();
      setAvatarUrl(data.avatar_url);
    } catch (err) {
      setError("Usuário do GitHub não encontrado");
      setAvatarUrl("");
    } finally {
      setIsLoadingAvatar(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name.trim()) {
      setError("Por favor, digite seu nome");
      return;
    }

    if (!avatarUrl) {
      setError("Por favor, busque seu avatar do GitHub");
      return;
    }

    updateUser(name, avatarUrl, githubUsername);
    completeSetup();
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        <header>
          <img src="/favicon.png" alt="favicon" />
        </header>

        <strong>Bem-vindo!</strong>
        <p>Configure seu perfil para começar</p>

        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor="name">Seu nome</label>
            <input
              id="name"
              type="text"
              placeholder="Digite seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="github">GitHub Username</label>
            <div className={styles.githubInput}>
              <input
                id="github"
                type="text"
                placeholder="seu-username"
                value={githubUsername}
                onChange={(e) => setGithubUsername(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
              />
              <button
                type="button"
                onClick={handleFetchGithubAvatar}
                disabled={isLoadingAvatar}
                className={styles.fetchButton}
              >
                {isLoadingAvatar ? "Buscando..." : "Buscar"}
              </button>
            </div>
          </div>

          {avatarUrl && (
            <div className={styles.avatarPreview}>
              <img src={avatarUrl} alt="Preview" />
              <span>✓ Avatar encontrado!</span>
            </div>
          )}

          {error && <p className={styles.error}>{error}</p>}

          <button
            type="submit"
            className={styles.submitButton}
            disabled={!name.trim() || !avatarUrl}
          >
            Começar
          </button>
        </form>
      </div>
    </div>
  );
}
