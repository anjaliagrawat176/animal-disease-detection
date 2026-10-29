"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

type Theme = "light" | "dark";
type Language = "en" | "hi";

type ThemeLanguageContextType = {
  theme: Theme;
  language: Language;
  toggleTheme: () => void;
  setLanguage: (language: Language) => void;
};

const ThemeLanguageContext =
  createContext<ThemeLanguageContextType | undefined>(undefined);

export function ThemeLanguageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setTheme] = useState<Theme>("light");
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    const savedLanguage = localStorage.getItem("language") as Language | null;

    if (savedTheme === "light" || savedTheme === "dark") {
      setTheme(savedTheme);
    }

    if (savedLanguage === "en" || savedLanguage === "hi") {
      setLanguageState(savedLanguage);
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle(
      "dark",
      theme === "dark"
    );

    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  const toggleTheme = () => {
    setTheme((current) =>
      current === "light" ? "dark" : "light"
    );
  };

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
  };

  return (
    <ThemeLanguageContext.Provider
      value={{
        theme,
        language,
        toggleTheme,
        setLanguage,
      }}
    >
      {children}
    </ThemeLanguageContext.Provider>
  );
}

export function useThemeLanguage() {
  const context = useContext(ThemeLanguageContext);

  if (!context) {
    throw new Error(
      "useThemeLanguage must be used inside ThemeLanguageProvider"
    );
  }

  return context;
}