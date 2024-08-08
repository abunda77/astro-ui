import React, { useState } from "react";
import "@/styles/globals.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ToastAction } from "@/components/ui/toast";
import { toast } from "@/components/ui/use-toast";

interface Props {
  onLoginSuccess?: (username: string) => void;
}

interface FormErrors {
  username: string;
  password: string;
}

const LoginForm: React.FC<Props> = ({ onLoginSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({
    username: "",
    password: "",
  });
  const [username, setUsername] = useState(""); // Added this line to declare username
  const [password, setPassword] = useState(""); // Added this line to declare password

  const validateForm = (username: string, password: string): boolean => {
    const newErrors: FormErrors = { username: "", password: "" };
    let isValid = true;

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

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const username = (form.elements.namedItem("username") as HTMLInputElement)
      .value;
    const password = (form.elements.namedItem("password") as HTMLInputElement)
      .value;

    if (!validateForm(username, password)) return;

    setIsLoading(true);

    try {
      const response = await fetch(
        "https://fastapi.serverdata.my.id/api/v1/auth/login",
        {
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
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Set cookies
        document.cookie = `access_token=${data.access_token}; path=/; max-age=3600; secure; samesite=strict`;
        document.cookie = `user_id=${data.user_id}; path=/; max-age=3600; secure; samesite=strict`;
        document.cookie = `username=${username}; path=/; max-age=3600; secure; samesite=strict`;

        toast({
          title: "Login Successful",
          description: `Welcome back, ${username}!`,
        });

        if (onLoginSuccess) {
          onLoginSuccess(username);
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
          action: <ToastAction altText="Try again">Try again</ToastAction>,
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
    <div className="w-full lg:grid lg:h-screen lg:grid-cols-2 xl:min-h-[800px]">
      <div className="hidden bg-muted lg:block">
        <img
          src="/images/login.jpg"
          alt="Image"
          width="1920"
          height="1900"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>

      <div className="flex items-center justify-center py-12">
        <Card className="mx-auto w-[350px]">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Login</CardTitle>
            <CardDescription>
              Enter your username and password below to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4" onSubmit={handleLogin}>
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
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
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <a href="/auth/forgot-password" className="text-sm underline">
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
                className="w-full bg-green-500"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
              <Button variant="outline" className="w-full">
                Login with Google
              </Button>
            </form>
            <div className="mt-4 text-sm text-center">
              Don&apos;t have an account?{" "}
              <a href="/auth/register" className="underline">
                {" "}
                Sign up{" "}
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginForm;
