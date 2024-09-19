import React, { useState, useEffect } from "react";
import { getCookie } from "@/utils/auth";

interface TimerCookieProps {
  onExpire: () => void;
}

const TimerCookie: React.FC<TimerCookieProps> = ({ onExpire }) => {
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    const accessToken = getCookie("access_token");
    if (accessToken) {
      const expirationTime = new Date(accessToken.split(".")[1]).getTime();
      const currentTime = new Date().getTime();
      const initialTimeLeft = Math.max(
        0,
        Math.floor((expirationTime - currentTime) / 1000)
      );
      setTimeLeft(initialTimeLeft);
    }
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      onExpire();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onExpire]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="text-sm font-medium text-gray-600 dark:text-gray-300">
      Sesi berakhir dalam: {formatTime(timeLeft)}
    </div>
  );
};

export default TimerCookie;
