"use client";

import { useContext, useState, useEffect } from "react";
import { UserContext } from "../contexts/UserContext";
import { LanguageContext } from "../contexts/LanguageContext";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSelector } from "./LanguageSelector";
import { TimerSettings } from "./TimerSettings";
import styles from "../styles/components/SettingsModal.module.css";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { name, avatarUrl, githubUsername, updateUser } =
    useContext(UserContext);
  const { t } = useContext(LanguageContext);
  const [activeSection, setActiveSection] = useState<
    "profile" | "appearance" | "language" | "timer"
  >("profile");

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
      setError(t("errors.enterGithubUsername"));
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
        setError(t("errors.githubRateLimit", { minutes: minutes.toString() }));
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
        setError(t("errors.githubUserNotFound"));
        setEditAvatarUrl("");
      }
    } catch (err) {
      setError(t("errors.githubUserNotFound"));
      setEditAvatarUrl("");
    } finally {
      setIsLoadingAvatar(false);
    }
  }

  function handleUseCustomUrl() {
    if (!editCustomUrl.trim()) {
      setError(t("errors.enterValidUrl"));
      return;
    }
    setError("");
    setEditAvatarUrl(editCustomUrl);
    setHasCustomAvatar(true);
  }

  function handleImageError() {
    if (editName.trim()) {
      setEditAvatarUrl(generateFallbackAvatar(editName));
      setError(t("errors.invalidUrlUsingInitials"));
    } else {
      setError(t("errors.invalidUrlEnterName"));
      setEditAvatarUrl("");
    }
  }

  function handleSave() {
    if (!editName.trim()) {
      setError(t("errors.enterYourName"));
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
          <h2>⚙️ {t("settings.title")}</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ✕
          </button>
        </div>

        <div className={styles.content}>
          {/* Sidebar Navigation */}
          <nav className={styles.sidebar}>
            <button
              className={`${styles.navButton} ${
                activeSection === "profile" ? styles.active : ""
              }`}
              onClick={() => setActiveSection("profile")}
            >
              <span className={styles.navIcon}>👤</span>
              {t("settings.profile")}
            </button>
            <button
              className={`${styles.navButton} ${
                activeSection === "appearance" ? styles.active : ""
              }`}
              onClick={() => setActiveSection("appearance")}
            >
              <span className={styles.navIcon}>🎨</span>
              {t("settings.appearance")}
            </button>
            <button
              className={`${styles.navButton} ${
                activeSection === "language" ? styles.active : ""
              }`}
              onClick={() => setActiveSection("language")}
            >
              <span className={styles.navIcon}>🌍</span>
              {t("settings.language")}
            </button>
            <button
              className={`${styles.navButton} ${
                activeSection === "timer" ? styles.active : ""
              }`}
              onClick={() => setActiveSection("timer")}
            >
              <span className={styles.navIcon}>⏱️</span>
              {t("settings.timer")}
            </button>
          </nav>

          {/* Main Content Area */}
          <div className={styles.mainContent}>
            {activeSection === "profile" && (
              <div className={styles.section}>
                <h3>{t("profile.title")}</h3>
                <p className={styles.sectionDescription}>
                  {t("settings.personalizeInfo")}
                </p>

                <div className={styles.inputGroup}>
                  <label>{t("profile.name")}</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder={t("profile.namePlaceholder")}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label>{t("profile.profilePhoto")}</label>
                  <p className={styles.helpText}>
                    {t("profile.profilePhotoHelp")}
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
                      {t("common.github")}
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
                      {t("common.url")}
                    </button>
                  </div>

                  {activeTab === "github" && (
                    <div className={styles.githubInput}>
                      <input
                        type="text"
                        value={editGithubUsername}
                        onChange={(e) => setEditGithubUsername(e.target.value)}
                        placeholder={t("profile.usernamePlaceholder")}
                      />
                      <button
                        type="button"
                        onClick={handleFetchGithubAvatar}
                        disabled={isLoadingAvatar}
                      >
                        {isLoadingAvatar
                          ? t("common.searching")
                          : t("common.search")}
                      </button>
                    </div>
                  )}

                  {activeTab === "url" && (
                    <div className={styles.githubInput}>
                      <input
                        type="url"
                        value={editCustomUrl}
                        onChange={(e) => setEditCustomUrl(e.target.value)}
                        placeholder={t("profile.urlPlaceholder")}
                      />
                      <button type="button" onClick={handleUseCustomUrl}>
                        {t("common.use")}
                      </button>
                    </div>
                  )}
                </div>

                {editAvatarUrl && (
                  <div className={styles.avatarPreview}>
                    <img
                      src={editAvatarUrl}
                      alt={t("profile.preview")}
                      onError={handleImageError}
                    />
                    <span>{t("profile.avatarLoaded")}</span>
                  </div>
                )}

                {error && <p className={styles.error}>{error}</p>}

                <div className={styles.saveButton}>
                  <button onClick={handleSave}>
                    {t("profile.saveProfile")}
                  </button>
                </div>
              </div>
            )}

            {activeSection === "appearance" && (
              <div className={styles.section}>
                <h3>{t("settings.appearance")}</h3>
                <p className={styles.sectionDescription}>
                  {t("settings.personalizeAppearance")}
                </p>

                <div className={styles.themeSection}>
                  <div className={styles.themeInfo}>
                    <strong>{t("appearance.theme")}</strong>
                    <span>{t("appearance.themeDescription")}</span>
                  </div>
                  <ThemeToggle />
                </div>
              </div>
            )}

            {activeSection === "language" && (
              <div className={styles.section}>
                <h3>{t("settings.language")}</h3>
                <p className={styles.sectionDescription}>
                  {t("language.chooseLanguage")}
                </p>

                <LanguageSelector />
              </div>
            )}

            {activeSection === "timer" && (
              <div className={styles.section}>
                <h3>{t("timer.title")}</h3>
                <p className={styles.sectionDescription}>
                  {t("timer.description")}
                </p>

                <TimerSettings />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
