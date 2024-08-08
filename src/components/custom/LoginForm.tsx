import React, { useState, useEffect } from "react";

import "@/styles/globals.css";
import { createClient } from "pexels";
import Autoplay from "embla-carousel-autoplay";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToastAction } from "@/components/ui/toast";
import { toast } from "@/components/ui/use-toast";

const PEXELS_API_KEY =
  "qx8GVjVSbbbIzugyU7YdcWvufPqQBjFed1CeoV0exEfksFiKWoSVmV9g";
const PEXELS_QUERY = ["real estate", "home decor", "property"][
  Math.floor(Math.random() * 3)
];

const client = createClient(PEXELS_API_KEY);

const LoginForm: React.FC<{
  onLoginSuccess?: (username: string) => void;
}> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ username: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [carouselImages, setCarouselImages] = useState<any[]>([]);

  useEffect(() => {
    const fetchCarouselImages = async () => {
      try {
        const response = await client.photos.search({
          query: PEXELS_QUERY,
          per_page: 5,
          size: "small",
          orientation: "portrait",
        });
        const photos = "photos" in response ? response.photos : []; // Check if 'photos' exists
        setCarouselImages(photos);
      } catch (error) {
        console.error("Error fetching carousel images:", error);
      }
    };
    fetchCarouselImages();
  }, []);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;
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

      console.log("Logging in:", { username, password });
    } catch (error) {
      console.error("Login error:", error);
      setErrors({
        username: "Invalid username",
        password: "Invalid password",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      // Implement registration logic here
      console.log("Registering:", { username, password });
    } catch (error) {
      console.error("Registration error:", error);
      setErrors({
        username: "Invalid username",
        password: "Invalid password",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    // Implement form validation logic here
    return true;
  };

  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  );

  return (
    <div className="w-full h-full m-0 lg:grid lg:grid-cols-2">
      <div className="hidden bg-muted lg:block">
        <Carousel
          plugins={[plugin.current]}
          className="w-full h-full"
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
        >
          <CarouselContent>
            {carouselImages.map((image) => (
              <CarouselItem key={image.id}>
                <div className="relative p-0">
                  <Card>
                    <CardContent className="flex items-center justify-center p-0">
                      <img
                        src={image.src.large2x}
                        alt={image.alt}
                        className="object-cover w-full h-screen"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <p className="text-4xl font-semibold text-white">
                          {image.alt}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
      <div className="flex items-center justify-center py-12 ">
        <Card className="mx-auto w-[350px] shadow-2xl opacity-100">
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
