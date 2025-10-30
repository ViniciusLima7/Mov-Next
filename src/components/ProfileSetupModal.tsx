"use client";

import { useState, useContext, useEffect } from "react";
import { UserContext } from "../contexts/UserContext";
import styles from "../styles/components/ProfileSetupModal.module.css";

export function ProfileSetupModal() {
  const { updateUser, completeSetup } = useContext(UserContext);
  const [name, setName] = useState("");
  const [githubUsername, setGithubUsername] = useState("");
  const [customUrl, setCustomUrl] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isLoadingAvatar, setIsLoadingAvatar] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"github" | "url">("github");
  const [hasCustomAvatar, setHasCustomAvatar] = useState(false);

  function generateFallbackAvatar(name: string): string {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      name
    )}&size=120&background=5965E0&color=fff&bold=true`;
  }

  useEffect(() => {
    if (name.trim() && !hasCustomAvatar) {
      setAvatarUrl(generateFallbackAvatar(name));
    }
  }, [name, hasCustomAvatar]);

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

      const rateLimitRemaining = response.headers.get("x-ratelimit-remaining");
      const rateLimitReset = response.headers.get("x-ratelimit-reset");

      if (response.status === 403 && rateLimitRemaining === "0") {
        const resetDate = new Date(Number(rateLimitReset) * 1000);
        const minutes = Math.ceil((resetDate.getTime() - Date.now()) / 60000);
        setError(
          `Limite da API atingido. Tente em ${minutes} min. Use a aba URL para continuar.`
        );
        setActiveTab("url");
        setAvatarUrl("");
        return;
      }

      if (!response.ok) {
        throw new Error("Usuário não encontrado");
      }

      const data = await response.json();
      const githubAvatarUrl = `https://github.com/${githubUsername}.png`;
      setAvatarUrl(githubAvatarUrl);
      setHasCustomAvatar(true);
    } catch (err) {
      setError("Usuário do GitHub não encontrado");
      setAvatarUrl("");
    } finally {
      setIsLoadingAvatar(false);
    }
  }

  function handleUseCustomUrl() {
    if (!customUrl.trim()) {
      setError("Digite uma URL válida");
      return;
    }
    setError("");
    setAvatarUrl(customUrl);
    setHasCustomAvatar(true);
  }

  function handleImageError() {
    if (name.trim()) {
      setAvatarUrl(generateFallbackAvatar(name));
      setError("URL inválida. Usando avatar com suas iniciais.");
    } else {
      setError("URL inválida. Digite seu nome para gerar um avatar.");
      setAvatarUrl("");
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name.trim()) {
      setError("Por favor, digite seu nome");
      return;
    }

    const finalAvatarUrl = avatarUrl || generateFallbackAvatar(name);
    const finalGithubUsername =
      avatarUrl && activeTab === "github" ? githubUsername : "";

    updateUser(name, finalAvatarUrl, finalGithubUsername);
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
            <label>Foto de perfil (opcional)</label>
            <p className={styles.helpText}>
              💡 Sem foto? Usaremos suas iniciais
            </p>

            <div className={styles.tabs}>
              <button
                type="button"
                className={
                  activeTab === "github" ? styles.tabActive : styles.tab
                }
                onClick={() => {
                  setActiveTab("github");
                  setError("");
                }}
              >
                GitHub
              </button>
              <button
                type="button"
                className={activeTab === "url" ? styles.tabActive : styles.tab}
                onClick={() => {
                  setActiveTab("url");
                  setError("");
                }}
              >
                URL
              </button>
            </div>

            {activeTab === "github" && (
              <div className={styles.githubInput}>
                <input
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
            )}

            {activeTab === "url" && (
              <div className={styles.githubInput}>
                <input
                  type="url"
                  placeholder="https://exemplo.com/foto.jpg"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
                />
                <button
                  type="button"
                  onClick={handleUseCustomUrl}
                  className={styles.fetchButton}
                >
                  Usar
                </button>
              </div>
            )}
          </div>

          {avatarUrl && (
            <div className={styles.avatarPreview}>
              <img src={avatarUrl} alt="Preview" onError={handleImageError} />
              <span>✓ Avatar carregado!</span>
            </div>
          )}

          {error && <p className={styles.error}>{error}</p>}

          <button
            type="submit"
            className={styles.submitButton}
            disabled={!name.trim()}
          >
            Começar
          </button>
        </form>
      </div>
    </div>
  );
}
