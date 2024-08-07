import React, { useEffect } from "react";

const HeaderClientScript = () => {
  useEffect(() => {
    const getThemePreference = () => {
      if (
        typeof localStorage !== "undefined" &&
        localStorage.getItem("theme")
      ) {
        return localStorage.getItem("theme");
      }
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    };

    const isDark = getThemePreference() === "dark";
    document.documentElement.classList[isDark ? "add" : "remove"]("dark");
    const updateLogo = () => {
      const isDark = document.documentElement.classList.contains("dark");
      const logoElement = document.getElementById(
        "themeLogo"
      ) as HTMLImageElement;
      if (logoElement) {
        logoElement.src = isDark
          ? "../images/dark-logo.png"
          : "../images/logo.png";
      }
    };

    updateLogo();

    if (typeof localStorage !== "undefined") {
      const observer = new MutationObserver(() => {
        const isDark = document.documentElement.classList.contains("dark");
        localStorage.setItem("theme", isDark ? "dark" : "light");
        updateLogo();
      });
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class"],
      });
    }

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
        welcomeMessage.textContent = name ? `Welcome ${name}` : "Welcome User";
      }
    };

    checkLoginStatus();
  }, []);

  return null;
};

export default HeaderClientScript;
