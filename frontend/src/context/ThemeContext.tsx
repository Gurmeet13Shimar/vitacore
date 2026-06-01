import React, { createContext, useContext, useState, useEffect } from "react";

export type ThemeType = "dark" | "bright";

export interface ThemeColors {
  background: string;
  cardBg: string;
  cardBorder: string;
  textWhite: string;
  textMuted: string;
  neonPurple: string;
  neonPink: string;
  gold: string;
}

interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  themeColors: ThemeColors;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeType>("dark");

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("vitacoreSettings");
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        if (settings.theme) {
          setThemeState(settings.theme);
        }
      } catch (e) {
        console.error("Failed to parse settings:", e);
      }
    }
  }, []);

  // Save theme to localStorage whenever it changes
  const setTheme = (newTheme: ThemeType) => {
    setThemeState(newTheme);
    const savedSettings = localStorage.getItem("vitacoreSettings");
    const settings = savedSettings ? JSON.parse(savedSettings) : {};
    settings.theme = newTheme;
    localStorage.setItem("vitacoreSettings", JSON.stringify(settings));
  };

  const themeColors: ThemeColors =
    theme === "bright"
      ? {
          background: "#f8f9fa",
          cardBg: "rgba(255, 255, 255, 0.95)",
          cardBorder: "rgba(124, 79, 240, 0.15)",
          textWhite: "#1a1a1a",
          textMuted: "rgba(26, 26, 26, 0.6)",
          neonPurple: "#6b5ce7",
          neonPink: "#d41e77",
          gold: "#d4a300",
        }
      : {
          background: "#050714",
          cardBg: "rgba(255, 255, 255, 0.03)",
          cardBorder: "rgba(255, 255, 255, 0.08)",
          textWhite: "#ffffff",
          textMuted: "rgba(255, 255, 255, 0.6)",
          neonPurple: "#7c4ff0",
          neonPink: "#e91e8c",
          gold: "#f5c518",
        };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themeColors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
