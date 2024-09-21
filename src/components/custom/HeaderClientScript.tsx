import React, { useEffect, useState } from "react";

const HeaderClientScript = () => {
  const [theme, setTheme] = useState<"dark" | "light">("light");

  useEffect(() => {
    const getThemePreference = () => {
      if (
        typeof localStorage !== "undefined" &&
        localStorage.getItem("theme")
      ) {
        return localStorage.getItem("theme") as "dark" | "light";
      }
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    };

    const updateTheme = (newTheme: "dark" | "light") => {
      const isDark = newTheme === "dark";
      document.documentElement.classList[isDark ? "add" : "remove"]("dark");
      localStorage.setItem("theme", newTheme);
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

    setTheme(getThemePreference());

    // Tambahkan event listener untuk perubahan tema sistem
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      const newTheme = e.matches ? "dark" : "light";
      setTheme(newTheme);
      updateTheme(newTheme);
    };
    mediaQuery.addEventListener("change", handleChange);

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
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  useEffect(() => {
    const updateTheme = (newTheme: "dark" | "light") => {
      const isDark = newTheme === "dark";
      document.documentElement.classList[isDark ? "add" : "remove"]("dark");
      localStorage.setItem("theme", newTheme);
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

    updateTheme(theme);
  }, [theme]);

  // Expose setTheme function to window object
  useEffect(() => {
    (window as any).setTheme = setTheme;
  }, []);

  return null;
};

export default HeaderClientScript;
