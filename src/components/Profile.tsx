"use client";

import { useContext, useState } from "react";
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
  const [editAvatarUrl, setEditAvatarUrl] = useState("");
  const [isLoadingAvatar, setIsLoadingAvatar] = useState(false);
  const [error, setError] = useState("");

  function handleEditClick() {
    setEditName(name);
    setEditAvatarUrl(avatarUrl);
    setEditGithubUsername(githubUsername);
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

      if (response.ok) {
        const data = await response.json();
        setEditAvatarUrl(data.avatar_url);
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

  function handleSave() {
    if (editName.trim() && editAvatarUrl && editGithubUsername.trim()) {
      updateUser(editName, editAvatarUrl, editGithubUsername);
    }
    setIsEditing(false);
  }

  function handleCancel() {
    setIsEditing(false);
    setEditName("");
    setEditGithubUsername("");
    setEditAvatarUrl("");
    setError("");
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
              <label>GitHub Username</label>
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
            </div>

            {editAvatarUrl && (
              <div className={styles.avatarPreview}>
                <img src={editAvatarUrl} alt="Preview" />
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
