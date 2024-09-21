// Toggle option Light or Dark Mode
import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { Toggle } from "rsuite";
import "rsuite/dist/rsuite-no-reset.min.css";

export function ModeToggle() {
  const [theme, setThemeState] = React.useState<
    "theme-light" | "dark" | "system"
  >("system");

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTheme = window.localStorage.getItem("theme") as
        | "theme-light"
        | "dark"
        | "system";
      setThemeState(savedTheme || "system");
    }
  }, []);

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const updateTheme = () => {
      const isDark =
        theme === "dark" ||
        (theme === "system" &&
          window.matchMedia("(prefers-color-scheme: dark)").matches);
      document.documentElement.classList.toggle("dark", isDark);
    };

    updateTheme();
    window.localStorage.setItem("theme", theme);

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", updateTheme);

    return () => mediaQuery.removeEventListener("change", updateTheme);
  }, [theme]);

  return (
    <div className="flex items-center">
      <Toggle
        checkedChildren={
          <Moon className="h-[1.2rem] w-[1.2rem] dark:text-gray-400" />
        }
        unCheckedChildren={
          <Sun className="h-[1.2rem] w-[1.2rem] dark:text-gray-400" />
        }
        checked={
          theme === "dark" ||
          (theme === "system" &&
            typeof window !== "undefined" &&
            window.matchMedia("(prefers-color-scheme: dark)").matches)
        }
        onChange={() => {
          const newTheme = theme === "dark" ? "theme-light" : "dark";
          setThemeState(newTheme);
        }}
      />
    </div>
  );
}
