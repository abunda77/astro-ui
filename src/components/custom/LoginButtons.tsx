import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import LoginModal from "@/components/custom/LoginModal";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { Skeleton } from "@/components/ui/skeleton";

const LoginButtons = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const checkLoginStatus = async () => {
    const usernameCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("username="));
    if (usernameCookie) {
      const loggedInUsername = usernameCookie.split("=")[1];
      setIsLoggedIn(true);
      setUsername(loggedInUsername);
    }
  };

  useEffect(() => {
    checkLoginStatus().finally(() => setLoading(false));
  }, []);

  const updateWelcomeMessage = (name: string) => {
    const welcomeMessage = document.getElementById("welcomeMessage");
    if (welcomeMessage) {
      welcomeMessage.textContent = name ? `Welcome ${name}` : "Welcome User";
    }
  };

  const handleLoginSuccess = (loggedInUsername: string) => {
    setLoading(true); // Mulai loading setelah login sukses
    setTimeout(() => {
      setIsLoggedIn(true);
      setUsername(loggedInUsername);
      updateWelcomeMessage(loggedInUsername);
      setLoading(false); // Hentikan loading setelah beberapa saat (simulasi)
      window.location.href = "/dashboard";
    }, 2000); // Ganti 2000 dengan waktu loading yang Anda inginkan
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
      {loading ? (
        <Skeleton className="w-24 h-8" /> // Tampilkan skeleton saat loading
      ) : isLoggedIn ? (
        <>
          <Button
            variant="secondary"
            className="mx-2 hover:bg-gray-300 dark:hover:bg-gray-700"
            onClick={() => (window.location.href = "/dashboard")}
          >
            Dashboard
          </Button>
          <Button
            variant="secondary"
            className="text-gray-200 bg-gray-900 hover:bg-gray-600 dark:bg-gray-700 dark:hover:bg-gray-500"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </>
      ) : (
        <>
          {/* <LoginButton /> */}
          <Button
            variant="link"
            className="dark:text-gray-100"
            onClick={() => (window.location.href = "/loginpage")}
          >
            Register
          </Button>

          {/* <RegisterButton /> */}

          <LoginModal onLoginSuccess={handleLoginSuccess} />
        </>
      )}
    </div>
  );
};

export default LoginButtons;
