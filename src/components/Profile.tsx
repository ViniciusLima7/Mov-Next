"use client";

import { useContext, useState, useEffect } from "react";
import { ChallengesContext } from "../contexts/ChallengesContext";
import { UserContext } from "../contexts/UserContext";
import styles from "../styles/components/Profile.module.css";

export function Profile() {
  const { level } = useContext(ChallengesContext);
  const { name, avatarUrl, githubUsername, updateUser } =
    useContext(UserContext);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editGithubUsername, setEditGithubUsername] = useState("");
  const [editCustomUrl, setEditCustomUrl] = useState("");
  const [editAvatarUrl, setEditAvatarUrl] = useState("");
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
    if (editName.trim() && !hasCustomAvatar && isEditing) {
      setEditAvatarUrl(generateFallbackAvatar(editName));
    }
  }, [editName, hasCustomAvatar, isEditing]);

  function handleEditClick() {
    setEditName(name);
    setEditAvatarUrl(avatarUrl);
    const isUsingInitials = avatarUrl.includes("ui-avatars.com");
    setHasCustomAvatar(!isUsingInitials);

    if (isUsingInitials) {
      setEditGithubUsername("");
      setEditCustomUrl("");
      setActiveTab("github");
    } else if (githubUsername) {
      setEditGithubUsername(githubUsername);
      setEditCustomUrl("");
      setActiveTab("github");
    } else {
      setEditGithubUsername("");
      setEditCustomUrl(avatarUrl);
      setActiveTab("url");
    }

    setError("");
    setIsEditing(true);
  }

  async function handleFetchGithubAvatar() {
    if (!editGithubUsername.trim()) {
      setError("Digite um username do GitHub");
      return;
    }

    setIsLoadingAvatar(true);
    setError("");

    try {
      const response = await fetch(
        `https://api.github.com/users/${editGithubUsername}`
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
        setEditAvatarUrl("");
        return;
      }

      if (response.ok) {
        const data = await response.json();
        const githubAvatarUrl = `https://github.com/${editGithubUsername}.png`;
        setEditAvatarUrl(githubAvatarUrl);
        setHasCustomAvatar(true);
      } else {
        setError("Usuário do GitHub não encontrado");
        setEditAvatarUrl("");
      }
    } catch (err) {
      setError("Usuário do GitHub não encontrado");
      setEditAvatarUrl("");
    } finally {
      setIsLoadingAvatar(false);
    }
  }

  function handleUseCustomUrl() {
    if (!editCustomUrl.trim()) {
      setError("Digite uma URL válida");
      return;
    }
    setError("");
    setEditAvatarUrl(editCustomUrl);
    setHasCustomAvatar(true);
  }

  function handleImageError() {
    if (editName.trim()) {
      setEditAvatarUrl(generateFallbackAvatar(editName));
      setError("URL inválida. Usando avatar com suas iniciais.");
    } else {
      setError("URL inválida. Digite seu nome para gerar um avatar.");
      setEditAvatarUrl("");
    }
  }

  function handleSave() {
    if (!editName.trim()) {
      setError("Digite seu nome");
      return;
    }

    const finalAvatarUrl = editAvatarUrl || generateFallbackAvatar(editName);
    const isUsingInitials = finalAvatarUrl.includes("ui-avatars.com");
    const finalGithubUsername =
      !isUsingInitials && activeTab === "github" ? editGithubUsername : "";

    updateUser(editName, finalAvatarUrl, finalGithubUsername);
    setIsEditing(false);
  }

  function handleCancel() {
    setIsEditing(false);
    setEditName("");
    setEditGithubUsername("");
    setEditCustomUrl("");
    setEditAvatarUrl("");
    setError("");
    setActiveTab("github");
    setHasCustomAvatar(false);
  }

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
            Level {level}
          </p>
        </div>
        <button
          className={styles.editButton}
          onClick={handleEditClick}
          title="Editar perfil"
        >
          ⚙️
        </button>
      </div>

      {isEditing && (
        <div
          className={styles.editModal}
          onClick={(e) => e.target === e.currentTarget && handleCancel()}
        >
          <div className={styles.editModalContent}>
            <h3>Editar Perfil</h3>

            <div className={styles.inputGroup}>
              <label>Nome</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Seu nome"
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
                  className={
                    activeTab === "url" ? styles.tabActive : styles.tab
                  }
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
                    value={editGithubUsername}
                    onChange={(e) => setEditGithubUsername(e.target.value)}
                    placeholder="seu-username"
                  />
                  <button
                    type="button"
                    onClick={handleFetchGithubAvatar}
                    disabled={isLoadingAvatar}
                  >
                    {isLoadingAvatar ? "..." : "Buscar"}
                  </button>
                </div>
              )}

              {activeTab === "url" && (
                <div className={styles.githubInput}>
                  <input
                    type="url"
                    value={editCustomUrl}
                    onChange={(e) => setEditCustomUrl(e.target.value)}
                    placeholder="https://exemplo.com/foto.jpg"
                  />
                  <button type="button" onClick={handleUseCustomUrl}>
                    Usar
                  </button>
                </div>
              )}
            </div>

            {editAvatarUrl && (
              <div className={styles.avatarPreview}>
                <img
                  src={editAvatarUrl}
                  alt="Preview"
                  onError={handleImageError}
                />
                <span>Preview</span>
              </div>
            )}

            {error && <p className={styles.error}>{error}</p>}

            <div className={styles.modalButtons}>
              <button onClick={handleSave}>Salvar</button>
              <button onClick={handleCancel}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
