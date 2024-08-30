import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { Toggle } from "rsuite";
import "rsuite/dist/rsuite-no-reset.min.css";

export function ModeToggle() {
  const [theme, setThemeState] = React.useState<
    "theme-light" | "dark" | "system"
  >("theme-light");

  React.useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains("dark");
    setThemeState(isDarkMode ? "dark" : "theme-light");
  }, []);

  React.useEffect(() => {
    const isDark =
      theme === "dark" ||
      (theme === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList[isDark ? "add" : "remove"]("dark");
  }, [theme]);

  return (
    <div className="flex items-center">
      <Toggle
        size="lg"
        checkedChildren={
          <Moon className="h-[1.2rem] w-[1.2rem] dark:text-gray-400" />
        }
        unCheckedChildren={
          <Sun className="h-[1.2rem] w-[1.2rem] dark:text-gray-400" />
        }
        checked={theme === "dark"}
        onChange={() =>
          setThemeState(theme === "dark" ? "theme-light" : "dark")
        }
      />
    </div>
  );
}
