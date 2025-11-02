"use client";

import { useState, useContext, useEffect } from "react";
import { UserContext } from "../contexts/UserContext";
import { LanguageContext } from "../contexts/LanguageContext";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSelector } from "./LanguageSelector";
import styles from "../styles/components/ProfileSetupModal.module.css";

export function ProfileSetupModal() {
  const { updateUser, completeSetup } = useContext(UserContext);
  const { t } = useContext(LanguageContext);
  const [activeSection, setActiveSection] = useState<
    "profile" | "appearance" | "language"
  >("profile");
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
      setError(t("errors.enterGithubUsername"));
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
        setError(t("errors.githubRateLimit", { minutes: minutes.toString() }));
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
      setError(t("errors.githubUserNotFound"));
      setAvatarUrl("");
    } finally {
      setIsLoadingAvatar(false);
    }
  }

  function handleUseCustomUrl() {
    if (!customUrl.trim()) {
      setError(t("errors.enterValidUrl"));
      return;
    }
    setError("");
    setAvatarUrl(customUrl);
    setHasCustomAvatar(true);
  }

  function handleImageError() {
    if (name.trim()) {
      setAvatarUrl(generateFallbackAvatar(name));
      setError(t("errors.invalidUrlUsingInitials"));
    } else {
      setError(t("errors.invalidUrlEnterName"));
      setAvatarUrl("");
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name.trim()) {
      setError(t("errors.enterYourName"));
      return;
    }

    const finalAvatarUrl = avatarUrl || generateFallbackAvatar(name);
    const isUsingInitials = finalAvatarUrl.includes("ui-avatars.com");
    const finalGithubUsername =
      !isUsingInitials && activeTab === "github" ? githubUsername : "";

    updateUser(name, finalAvatarUrl, finalGithubUsername);
    completeSetup();
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <img src="/favicon.png" alt="favicon" />
            <div>
              <h2>{t("setup.welcome")}</h2>
              <p>{t("setup.subtitle")}</p>
            </div>
          </div>
        </div>

        <div className={styles.content}>
          {/* Sidebar Navigation */}
          <nav className={styles.sidebar}>
            <button
              className={`${styles.navButton} ${
                activeSection === "profile" ? styles.active : ""
              }`}
              onClick={() => setActiveSection("profile")}
              type="button"
            >
              <span className={styles.navIcon}>👤</span>
              {t("profile.title")}
            </button>
            <button
              className={`${styles.navButton} ${
                activeSection === "appearance" ? styles.active : ""
              }`}
              onClick={() => setActiveSection("appearance")}
              type="button"
            >
              <span className={styles.navIcon}>🎨</span>
              {t("settings.appearance")}
            </button>
            <button
              className={`${styles.navButton} ${
                activeSection === "language" ? styles.active : ""
              }`}
              onClick={() => setActiveSection("language")}
              type="button"
            >
              <span className={styles.navIcon}>🌍</span>
              {t("settings.language")}
            </button>
          </nav>

          {/* Main Content Area */}
          <div className={styles.mainContent}>
            {activeSection === "profile" && (
              <div className={styles.section}>
                <h3>{t("profile.yourProfile")}</h3>
                <p className={styles.sectionDescription}>
                  {t("profile.howToCall")}
                </p>

                <form onSubmit={handleSubmit}>
                  <div className={styles.inputGroup}>
                    <label htmlFor="name">{t("profile.name")}</label>
                    <input
                      id="name"
                      type="text"
                      placeholder={t("profile.namePlaceholder")}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
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
                          placeholder={t("profile.usernamePlaceholder")}
                          value={githubUsername}
                          onChange={(e) => setGithubUsername(e.target.value)}
                          onKeyDown={(e) =>
                            e.key === "Enter" && e.preventDefault()
                          }
                        />
                        <button
                          type="button"
                          onClick={handleFetchGithubAvatar}
                          disabled={isLoadingAvatar}
                          className={styles.fetchButton}
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
                          placeholder={t("profile.urlPlaceholder")}
                          value={customUrl}
                          onChange={(e) => setCustomUrl(e.target.value)}
                          onKeyDown={(e) =>
                            e.key === "Enter" && e.preventDefault()
                          }
                        />
                        <button
                          type="button"
                          onClick={handleUseCustomUrl}
                          className={styles.fetchButton}
                        >
                          {t("common.use")}
                        </button>
                      </div>
                    )}
                  </div>

                  {avatarUrl && (
                    <div className={styles.avatarPreview}>
                      <img
                        src={avatarUrl}
                        alt={t("profile.preview")}
                        onError={handleImageError}
                      />
                      <span>{t("profile.avatarLoaded")}</span>
                    </div>
                  )}

                  {error && <p className={styles.error}>{error}</p>}

                  <button
                    type="submit"
                    className={styles.submitButton}
                    disabled={!name.trim()}
                  >
                    {t("common.start")}
                  </button>
                </form>
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

                <div className={styles.appearanceNote}>
                  <p>{t("appearance.tip")}</p>
                  <p>{t("appearance.tipDescription")}</p>
                </div>

                <button
                  type="button"
                  className={styles.continueButton}
                  onClick={() => setActiveSection("profile")}
                >
                  {t("appearance.backToProfile")}
                </button>
              </div>
            )}

            {activeSection === "language" && (
              <div className={styles.section}>
                <h3>{t("settings.language")}</h3>
                <p className={styles.sectionDescription}>
                  {t("language.chooseLanguage")}
                </p>

                <LanguageSelector />

                <div className={styles.appearanceNote}>
                  <p>{t("appearance.tip")}</p>
                  <p>{t("appearance.tipDescription")}</p>
                </div>

                <button
                  type="button"
                  className={styles.continueButton}
                  onClick={() => setActiveSection("profile")}
                >
                  {t("appearance.backToProfile")}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
