import React from "react";
import "@/styles/globals.css";

const HeroSection = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background image */}
      <div
        className="absolute top-0 left-0 w-full h-full bg-center bg-cover animate-horizontal-move"
        style={{ backgroundImage: "url(images/logo.png)" }}
      ></div>

      {/* Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-black opacity-60"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-white">
        <h1 className="text-4xl font-bold text-center md:text-6xl">
          Professional business headshots, without a physical photo shoot
        </h1>
        <p className="max-w-2xl mt-4 text-lg text-center md:text-2xl">
          Get professional business headshots in minutes with our
          AI-photographer. Upload photos, pick your styles & receive 120+
          headshots.
        </p>
        <div className="flex mt-8 space-x-4">
          <button className="px-6 py-3 font-bold text-white bg-green-500 rounded-lg hover:bg-green-600">
            Get your headshots
          </button>
          <button className="px-6 py-3 font-bold text-white bg-transparent border-2 border-white rounded-lg hover:bg-white hover:text-black">
            For companies & teams
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
