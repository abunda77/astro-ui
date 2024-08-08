"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";

interface LoginModalProps {
  onLoginSuccess?: (username: string) => void;
}

const LoginModal: React.FC<{ onLoginSuccess: (username: string) => void }> = ({
  onLoginSuccess,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ username: "", password: "" });
  const { toast } = useToast();

  const validateForm = () => {
    let isValid = true;
    const newErrors = { username: "", password: "" };

    if (!username.trim()) {
      newErrors.username = "Username is required";
      isValid = false;
    }
    if (!password.trim()) {
      newErrors.password = "Password is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8000/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
        body: new URLSearchParams({
          username,
          password,
          grant_type: "",
          scope: "",
          client_id: "",
          client_secret: "",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Set cookies
        document.cookie = `access_token=${data.access_token}; path=/; max-age=3600; secure; samesite=strict`;
        document.cookie = `user_id=${data.user_id}; path=/; max-age=3600; secure; samesite=strict`;
        document.cookie = `username=${username}; path=/; max-age=3600; secure; samesite=strict`;

        setIsOpen(false);

        // Delay toast to ensure it appears after modal closes
        toast({
          title: "Login Successful",
          description: `Welcome back, ${username}!`,
        });

        if (onLoginSuccess) {
          onLoginSuccess(username);
        }

        // Update welcome message
        const welcomeMessage = document.getElementById("welcomeMessage");
        if (welcomeMessage) {
          welcomeMessage.textContent = `Welcome to ${username}`;
        }

        // Redirect to home page
        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
      } else {
        toast({
          title: "Login Failed",
          description: data.detail || "An error occurred. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          className="mx-2 hover:bg-gray-300 dark:outline-gray-200"
          onClick={() => setIsOpen(true)}
        >
          Login
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px] p-6">
        <DialogHeader>
          <DialogTitle className="mb-2 text-2xl font-bold text-center dark:text-gray-300">
            Login
          </DialogTitle>
          <p className="mb-6 text-center text-gray-600 dark:text-gray-400">
            Enter your credentials to login to your account
          </p>
        </DialogHeader>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-sm font-medium">
              Username
            </Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={`w-full border ${
                errors.username
                  ? "border-red-500"
                  : "bg-slate-200 border-green-500 dark:bg-slate-300"
              }`}
              aria-invalid={errors.username ? "true" : "false"}
            />
            {errors.username && (
              <p className="text-xs text-red-500">{errors.username}</p>
            )}
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <a
                href="#"
                className="text-sm text-green-600 hover:underline dark:text-green-400"
              >
                Forgot your password?
              </a>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full border ${
                errors.password
                  ? "border-red-500"
                  : "bg-slate-200 border-green-500 dark:bg-slate-300"
              }`}
              aria-invalid={errors.password ? "true" : "false"}
            />
            {errors.password && (
              <p className="text-xs text-red-500">{errors.password}</p>
            )}
          </div>
          <Button
            type="submit"
            className="w-full text-white bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-500"
            disabled={isLoading}
            //aria-disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>
          <p className="text-sm text-center text-gray-600 dark:text-gray-300">
            Don't have an account?{" "}
            <a
              href="#"
              className="text-green-600 hover:underline dark:text-green-400"
            >
              Sign up
            </a>
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
