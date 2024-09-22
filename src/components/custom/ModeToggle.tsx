// Toggle option Light or Dark Mode
import * as React from "react";
import { Moon, Sun } from "lucide-react";
// import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

import dynamic from "next/dynamic";

const Switch = dynamic(
  () => import("@/components/ui/switch").then((mod) => mod.Switch),
  { ssr: false }
);

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
    <div className="flex items-center space-x-2">
      <Switch
        id="dark-mode"
        checked={
          theme === "dark" ||
          (theme === "system" &&
            typeof window !== "undefined" &&
            window.matchMedia("(prefers-color-scheme: dark)").matches)
        }
        onCheckedChange={() => {
          const newTheme = theme === "dark" ? "theme-light" : "dark";
          setThemeState(newTheme);
        }}
        className="bg-gray-700 dark:bg-gray-200"
      />
      <Label htmlFor="dark-mode" className="sr-only">
        Mode Gelap
      </Label>
      {theme === "dark" ? (
        <Moon className="h-[1.2rem] w-[1.2rem] text-gray-600 dark:text-gray-400" />
      ) : (
        <Sun className="h-[1.2rem] w-[1.2rem] text-yellow-500 dark:text-gray-400" />
      )}
    </div>
  );
}
