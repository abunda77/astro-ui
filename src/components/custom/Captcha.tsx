import React, { useState, useEffect } from "react";
import { RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CaptchaProps {
  onValidate: (isValid: boolean) => void;
}

const Captcha: React.FC<CaptchaProps> = ({ onValidate }) => {
  const [captchaText, setCaptchaText] = useState("");
  const [userInput, setUserInput] = useState("");

  const generateCaptcha = () => {
    const randomString = Math.random().toString(36).substring(2, 8);
    setCaptchaText(randomString);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
    onValidate(e.target.value === captchaText);
  };

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center space-x-2">
        <div className="p-2 text-black bg-gray-200 rounded dark:bg-gray-700 dark:text-white">
          {captchaText}
        </div>
        <Button
          onClick={generateCaptcha}
          variant="outline"
          size="icon"
          className="bg-blue-300 dark:border-gray-600 dark:text-gray-300"
        >
          <RefreshCcw className="w-4 h-4" />
        </Button>
      </div>
      <Input
        type="text"
        placeholder="Masukkan captcha"
        value={userInput}
        onChange={handleInputChange}
        className="w-36 dark:bg-gray-800 dark:text-white dark:border-gray-600"
        maxLength={10}
      />
    </div>
  );
};

export default Captcha;
