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

const RegisterForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ name: "", password: "" });
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(
        "https://fastapi.serverdata.my.id/api/v1/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
            role: "customer",
            is_active: true,
          }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "Registration failed");
      }

      const data = await response.json();
      console.log("Registration successful:", data);
      toast({
        title: "Registration Successful",
        description: "You can now log in to your account.",
        action: <ToastAction altText="Close">Close</ToastAction>,
      });

      // Redirect to home page
      setTimeout(() => {
        window.location.href = "/auth/login";
      }, 1000);
    } catch (error: unknown) {
      // Menambahkan tipe 'unknown' pada error
      console.error("Registration error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error"; // Menangani tipe unknown
      setErrors({
        name: "Invalid name",
        password: "Invalid password",
      });
      toast({
        title: "Registration Failed",
        description: errorMessage, // Menggunakan errorMessage yang sudah ditangani
        variant: "destructive",
        action: <ToastAction altText="Close">Close</ToastAction>,
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
            <CardTitle className="text-3xl font-bold">Register</CardTitle>
            <CardDescription>
              Enter your name, email, and password below to register to your
              account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4" onSubmit={handleRegister}>
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full border ${
                    errors.name
                      ? "border-red-500"
                      : "bg-slate-200 border-green-500 dark:bg-slate-300"
                  }`}
                  aria-invalid={errors.name ? "true" : "false"}
                />
                {errors.name && (
                  <p className="text-xs text-red-500">{errors.name}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full border ${
                    errors.name
                      ? "border-red-500"
                      : "bg-slate-200 border-green-500 dark:bg-slate-300"
                  }`}
                  aria-invalid={errors.name ? "true" : "false"}
                />
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
                {isLoading ? "Registering..." : "Register"}
              </Button>
              <Button variant="outline" className="w-full">
                Register with Google
              </Button>
            </form>
            <div className="mt-4 text-sm text-center">
              Already have an account?{" "}
              <a href="/auth/login" className="underline">
                {" "}
                Sign in{" "}
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegisterForm;
