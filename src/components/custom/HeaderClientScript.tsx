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
      document.documentElement.classList.toggle("dark", isDark);
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

    const initialTheme = getThemePreference();
    setTheme(initialTheme);
    updateTheme(initialTheme);

    // Tambahkan event listener untuk perubahan tema sistem
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      const newTheme = e.matches ? "dark" : "light";
      setTheme(newTheme);
      updateTheme(newTheme);
    };
    mediaQuery.addEventListener("change", handleChange);

    // Expose setTheme function to window object
    (window as any).setTheme = (newTheme: "dark" | "light") => {
      setTheme(newTheme);
      updateTheme(newTheme);
    };

    // Cleanup
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  return null;
};

export default HeaderClientScript;
