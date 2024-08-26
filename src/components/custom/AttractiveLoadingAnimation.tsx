import React from "react";
import "@/styles/globals.css";
const AttractiveLoadingAnimation = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="w-32 h-32 opacity-0 sm:w-16 sm:h-16 md:w-32 md:h-32 animate-fadeIn">
        <svg
          className="w-32 h-32"
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            className="animate-pulse"
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#4CAF50"
            strokeWidth="8"
          />
          <path
            className="animate-dash"
            fill="none"
            stroke="#1E88E5"
            strokeWidth="8"
            strokeLinecap="round"
            d="M 50,50 m -40,0 a 40,40 0 1,1 80,0 a 40,40 0 1,1 -80,0"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold text-white animate-bounce">
            Mohon tunggu ...
          </span>
        </div>
      </div>
    </div>
  );
};

export default AttractiveLoadingAnimation;
