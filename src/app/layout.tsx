import type { Metadata } from "next";
import "../styles/global.css";

export const metadata: Metadata = {
  title: "Mov-Next",
  description: "Pomodoro app with challenges",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="shortcut icon" href="/favicon.png" type="image/png" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Rajdhani:wght@600&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // Detecta tema
                const theme = document.cookie.match(/theme=([^;]+)/)?.[1] || 'light';
                document.documentElement.setAttribute('data-theme', theme);
                
                // Detecta idioma
                const savedLang = document.cookie.match(/language=([^;]+)/)?.[1];
                const browserLang = (navigator.language || navigator.userLanguage || 'en').split('-')[0];
                const supportedLangs = ['pt', 'en', 'es'];
                const finalLang = savedLang || (supportedLangs.includes(browserLang) ? browserLang : 'en');
                document.documentElement.setAttribute('lang', finalLang);
              })();
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
