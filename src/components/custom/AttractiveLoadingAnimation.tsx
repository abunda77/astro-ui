import React from "react";
import "@/styles/globals.css";
const AttractiveLoadingAnimation = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-200">
      <div className="relative w-16 h-16 opacity-0 sm:w-24 sm:h-24 md:w-64 md:h-64 animate-fadeIn">
        <svg
          className="w-64 h-64"
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
        {/* <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-bold text-gray-800 text-1xl animate-bounce">
            Tunggu sebentar ...
          </span>
        </div> */}
      </div>
    </div>
  );
};

export default AttractiveLoadingAnimation;
