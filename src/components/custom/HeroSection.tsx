import React from "react";
import "@/styles/globals.css";
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";

export function TypewriterEffectSmoothDemo() {
  const words = [
    {
      text: "Temukan",
    },
    {
      text: "Hunian",
    },
    {
      text: "Idaman Anda",
    },
    {
      text: "bersama",
    },
    {
      text: "Bosqu Properti.",
      className: "text-blue-500 dark:text-blue-500",
    },
  ];
  return (
    <div className="flex flex-col items-center justify-center ">
      <h1>
        <TypewriterEffectSmooth words={words} />
      </h1>
    </div>
  );
}
