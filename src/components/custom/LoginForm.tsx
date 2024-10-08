import "@/styles/globals.css";
import React, { useState, useEffect } from "react";

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
import AttractiveLoadingAnimation from "@/components/custom/AttractiveLoadingAnimation";
import { Loader } from "rsuite";
import "rsuite/dist/rsuite-no-reset.min.css";

const PEXELS_API_KEY = import.meta.env.PUBLIC_PEXELS_API_KEY;
// const AUTH_LOGIN_ENDPOINT = import.meta.env.PUBLIC_AUTH_LOGIN_ENDPOINT;

// console.log("PEXELS_API_KEY", PEXELS_API_KEY);

const PEXELS_QUERY = ["home decor"][Math.floor(Math.random() * 3)];

const client = createClient(PEXELS_API_KEY);
const FASTAPI_LOGIN = import.meta.env.PUBLIC_FASTAPI_ENDPOINT;
const LoginForm: React.FC<{
  onLoginSuccess?: (username: string) => void;
}> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ username: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [carouselImages, setCarouselImages] = useState<any[]>([]);
  const [isPageLoading, setIsPageLoading] = useState(true);

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
      } finally {
        // Simulate a minimum loading time of 1 second
        setTimeout(() => setIsPageLoading(false), 2000);
      }
    };
    fetchCarouselImages();
  }, []);

  // ... (rest of the component code remains the same)

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      const response = await fetch(FASTAPI_LOGIN + "/auth/login", {
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

        toast({
          title: "Login Successful",
          description: `Welcome back, ${username}!`,
        });

        if (onLoginSuccess) {
          onLoginSuccess(username);
        }

        // Redirect to home page
        setTimeout(() => {
          window.location.href = "/dashboard";
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
    Autoplay({ delay: 1000, stopOnInteraction: true })
  );

  if (isPageLoading) {
    return (
      <div className="h-screen bg-[#94918d]">
        <Loader size="lg" inverse center content="loading..." />
      </div>
    );
  }

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
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
                        <p className="justify-center p-4 text-3xl font-semibold text-white">
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

      <div className="flex items-center justify-center min-h-screen px-4 py-6 lg:py-12">
        <Card className="w-full max-w-sm bg-white rounded-lg shadow-lg lg:w-[350px]">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl font-bold text-center lg:text-3xl">
              Login
            </CardTitle>
            <CardDescription className="text-sm text-center">
              Enter your username and password below to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6 lg:grid lg:gap-4" onSubmit={handleLogin}>
              <div className="space-y-2 lg:grid lg:gap-2">
                <Label htmlFor="username" className="text-sm font-medium">
                  Username
                </Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={`w-full h-10 text-base px-3 border ${
                    errors.username
                      ? "border-red-500"
                      : "bg-slate-200 border-green-500 dark:bg-slate-300"
                  } rounded-md`}
                  aria-invalid={errors.username ? "true" : "false"}
                />
                {errors.username && (
                  <p className="text-xs text-red-500">{errors.username}</p>
                )}
              </div>
              <div className="space-y-2 lg:grid lg:gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <a
                    href="/auth/forgot-password"
                    className="text-xs text-blue-600 underline lg:text-sm"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full h-10 text-base px-3 border ${
                    errors.password
                      ? "border-red-500"
                      : "bg-slate-200 border-green-500 dark:bg-slate-300"
                  } rounded-md`}
                  aria-invalid={errors.password ? "true" : "false"}
                />
                {errors.password && (
                  <p className="text-xs text-red-500">{errors.password}</p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full h-10 text-sm bg-green-500 rounded-md lg:bg-green-500"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
              <Button
                variant="outline"
                className="w-full h-10 text-sm border border-green-500 rounded-md"
              >
                Login with Google
              </Button>
            </form>
            <div className="mt-4 text-xs text-center lg:text-sm">
              Don't have an account?{" "}
              <a href="/auth/register" className="text-blue-600 underline">
                Sign up
              </a>
            </div>
            <div className="mt-2 text-xs text-center lg:mt-6 lg:text-sm">
              <a href="/" className="text-blue-600 underline">
                Back to Home
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginForm;
