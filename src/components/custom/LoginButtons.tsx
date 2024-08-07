import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import LoginModal from "@/components/custom/LoginModal";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";

const LoginButtons = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = () => {
    const usernameCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("username="));
    if (usernameCookie) {
      const loggedInUsername = usernameCookie.split("=")[1];
      setIsLoggedIn(true);
      setUsername(loggedInUsername);
      updateWelcomeMessage(loggedInUsername);
    }
  };

  const updateWelcomeMessage = (name: string) => {
    const welcomeMessage = document.getElementById("welcomeMessage");
    if (welcomeMessage) {
      welcomeMessage.textContent = name ? `Welcome ${name}` : "Welcome User";
    }
  };

  const handleLoginSuccess = (loggedInUsername: string) => {
    setIsLoggedIn(true);
    setUsername(loggedInUsername);
    updateWelcomeMessage(loggedInUsername);
  };

  const handleLogout = () => {
    document.cookie =
      "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    document.cookie =
      "user_id=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    document.cookie =
      "username=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    setIsLoggedIn(false);
    setUsername("");
    updateWelcomeMessage("");

    toast({
      title: "Logout Successful",
      variant: "warning",
      description: `Good bye, ${username}!`,
    });

    setTimeout(() => {
      window.location.href = "/";
    }, 5000);
  };

  return (
    <div className="flex space-x-2">
      {isLoggedIn ? (
        <>
          <Button
            variant="secondary"
            className="hover:bg-gray-300 dark:hover:bg-gray-700"
            onClick={() => (window.location.href = "/dashboard")}
          >
            Dashboard
          </Button>
          <Button
            variant="secondary"
            className="hover:bg-gray-300 dark:hover:bg-gray-700"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </>
      ) : (
        <>
          <LoginModal onLoginSuccess={handleLoginSuccess} />
          <Button
            className="text-white bg-green-500 hover:bg-green-600"
            onClick={() => (window.location.href = "/auth/register")}
          >
            Register
          </Button>
        </>
      )}
    </div>
  );
};

export default LoginButtons;
