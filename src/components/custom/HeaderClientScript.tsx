import React, { useEffect, useState } from "react";

const HeaderClientScript = () => {
  const [theme, setTheme] = useState<"theme-light" | "dark" | "system">(
    "system"
  );

  useEffect(() => {
    const getThemePreference = () => {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme) {
        return savedTheme as "theme-light" | "dark" | "system";
      }
      return "system";
    };

    setTheme(getThemePreference());

    const updateTheme = () => {
      const isDark =
        theme === "dark" ||
        (theme === "system" &&
          window.matchMedia("(prefers-color-scheme: dark)").matches);
      document.documentElement.classList[isDark ? "add" : "remove"]("dark");
      localStorage.setItem("theme", theme);
      updateLogo(isDark);
    };

    const updateLogo = (isDark: boolean) => {
      const logoElement = document.getElementById(
        "themeLogo"
      ) as HTMLImageElement;
      if (logoElement) {
        logoElement.src = isDark
          ? "../images/dark-logo.png"
          : "../images/logo.png";
      }
    };

    updateTheme();

    // Tambahkan event listener untuk perubahan tema sistem
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addListener(() => {
      if (theme === "system") {
        updateTheme();
      }
    });

    // Login state management
    const checkLoginStatus = () => {
      const usernameCookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("username="));
      if (usernameCookie) {
        const loggedInUsername = usernameCookie.split("=")[1];
        updateWelcomeMessage(loggedInUsername);
      } else {
        updateWelcomeMessage("");
      }
    };

    const updateWelcomeMessage = (name: string) => {
      const welcomeMessage = document.getElementById("welcomeMessage");
      if (welcomeMessage) {
        welcomeMessage.textContent = name
          ? `Welcome, ${name}`
          : "Hello, Guest!";
      }
    };

    checkLoginStatus();

    // Cleanup
    return () => {
      mediaQuery.removeListener(updateTheme);
    };
  }, [theme]);

  // Expose setTheme function to window object
  useEffect(() => {
    (window as any).setTheme = setTheme;
  }, []);

  return null;
};

export default HeaderClientScript;
