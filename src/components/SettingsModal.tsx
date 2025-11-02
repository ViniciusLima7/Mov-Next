"use client";

import { useContext, useState, useEffect } from "react";
import { UserContext } from "../contexts/UserContext";
import { ThemeToggle } from "./ThemeToggle";
import styles from "../styles/components/SettingsModal.module.css";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { name, avatarUrl, githubUsername, updateUser } =
    useContext(UserContext);
  const [activeSection, setActiveSection] = useState<"profile" | "appearance">(
    "profile"
  );

  // Profile states
  const [editName, setEditName] = useState("");
  const [editGithubUsername, setEditGithubUsername] = useState("");
  const [editCustomUrl, setEditCustomUrl] = useState("");
  const [editAvatarUrl, setEditAvatarUrl] = useState("");
  const [isLoadingAvatar, setIsLoadingAvatar] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"github" | "url">("github");
  const [hasCustomAvatar, setHasCustomAvatar] = useState(false);

  useEffect(() => {
    if (isOpen) {
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
    }
  }, [isOpen, name, avatarUrl, githubUsername]);

  function generateFallbackAvatar(name: string): string {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      name
    )}&size=120&background=5965E0&color=fff&bold=true`;
  }

  useEffect(() => {
    if (editName.trim() && !hasCustomAvatar && isOpen) {
      setEditAvatarUrl(generateFallbackAvatar(editName));
    }
  }, [editName, hasCustomAvatar, isOpen]);

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
    onClose();
  }

  if (!isOpen) return null;

  return (
    <div
      className={styles.overlay}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>⚙️ Configurações</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ✕
          </button>
        </div>

        <div className={styles.content}>
          <nav className={styles.sidebar}>
            <button
              className={`${styles.navButton} ${
                activeSection === "profile" ? styles.active : ""
              }`}
              onClick={() => setActiveSection("profile")}
            >
              <span className={styles.navIcon}>👤</span>
              Perfil
            </button>
            <button
              className={`${styles.navButton} ${
                activeSection === "appearance" ? styles.active : ""
              }`}
              onClick={() => setActiveSection("appearance")}
            >
              <span className={styles.navIcon}>🎨</span>
              Aparência
            </button>
          </nav>

          {/* Main Content Area */}
          <div className={styles.mainContent}>
            {activeSection === "profile" && (
              <div className={styles.section}>
                <h3>Perfil</h3>
                <p className={styles.sectionDescription}>
                  Personalize suas informações de perfil
                </p>

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

                <div className={styles.saveButton}>
                  <button onClick={handleSave}>Salvar Perfil</button>
                </div>
              </div>
            )}

            {activeSection === "appearance" && (
              <div className={styles.section}>
                <h3>Aparência</h3>
                <p className={styles.sectionDescription}>
                  Personalize a aparência da aplicação
                </p>

                <div className={styles.themeSection}>
                  <div className={styles.themeInfo}>
                    <strong>Tema</strong>
                    <span>Escolha entre o tema claro ou escuro</span>
                  </div>
                  <ThemeToggle />
                </div>

                <div className={styles.comingSoon}>
                  <p>
                    🌍 <strong>Idioma</strong> - Em breve
                  </p>
                  <span>Adicione suporte para múltiplos idiomas</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
