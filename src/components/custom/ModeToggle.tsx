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
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setThemeState(savedTheme as "theme-light" | "dark" | "system");
    }
  }, []);

  React.useEffect(() => {
    const isDark =
      theme === "dark" ||
      (theme === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList[isDark ? "add" : "remove"]("dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div className="flex items-center">
      <Toggle
        size="xl"
        checkedChildren={
          <Moon className="h-[1.2rem] w-[1.2rem] dark:text-gray-400" />
        }
        unCheckedChildren={
          <Sun className="h-[1.2rem] w-[1.2rem] dark:text-gray-400" />
        }
        checked={theme === "dark"}
        onChange={() => {
          const newTheme = theme === "dark" ? "theme-light" : "dark";
          setThemeState(newTheme);
        }}
      />
    </div>
  );
}
