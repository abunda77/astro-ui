import React from "react";
import "@/styles/globals.css";
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";

export function TypewriterEffectSmoothDemo() {
  const words = [
    {
      text: "Temukan",
      className: "text-3xl sm:text-4xl md:text-5xl antialiased",
    },
    {
      text: "Hunian",
      className: "text-3xl sm:text-4xl md:text-5xl antialiased",
    },
    {
      text: "Idaman Anda.",
      className:
        "text-blue-500 dark:text-blue-500 text-3xl sm:text-4xl md:text-5xl antialiased inline",
    },
  ];
  return (
    <div className="flex flex-col items-center justify-center mx-4 sm:mx-0">
      <h1>
        <TypewriterEffectSmooth words={words} />
      </h1>
    </div>
  );
}
