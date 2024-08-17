import React from "react";
import "@/styles/globals.css";
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";

export function TypewriterEffectSmoothDemo() {
  const words = [
    {
      text: "Temukan",
      className: "text-3xl antialiased",
    },
    {
      text: "Hunian",
      className: "text-3xl antialiased",
    },

    {
      text: "Idaman Anda.",
      className: "text-blue-500 dark:text-blue-500 text-3xl antialiased",
    },
  ];
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="antialiased text-9xl">
        <TypewriterEffectSmooth words={words} />
      </h1>
    </div>
  );
}
