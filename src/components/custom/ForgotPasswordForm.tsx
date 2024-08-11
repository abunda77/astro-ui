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

const PEXELS_API_KEY = import.meta.env.PUBLIC_PEXELS_API_KEY;
const PEXELS_QUERY = ["property"][Math.floor(Math.random() * 3)];
const FASTAPI_ENDPOINT = import.meta.env.PUBLIC_FASTAPI_ENDPOINT;

const client = createClient(PEXELS_API_KEY);

const ForgotPasswordForm: React.FC<{
  onForgotPasswordSuccess?: (email: string) => void;
}> = ({ onForgotPasswordSuccess }) => {
  const [email, setEmail] = useState("");

  const [errors, setErrors] = useState({ email: "" });
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
        setTimeout(() => setIsPageLoading(false), 1000);
      }
    };
    fetchCarouselImages();
  }, []);

  const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      const response = await fetch(FASTAPI_ENDPOINT + "/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
        body: new URLSearchParams({
          email,

          grant_type: "",
          scope: "",
          client_id: "",
          client_secret: "",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Set cookies
        // document.cookie = `access_token=${data.access_token}; path=/; max-age=3600; secure; samesite=strict`;
        // document.cookie = `user_id=${data.user_id}; path=/; max-age=3600; secure; samesite=strict`;
        // document.cookie = `username=${username}; path=/; max-age=3600; secure; samesite=strict`;

        toast({
          title: "Request Password Successful Sent",
          description: `Email has been sent to, ${email}!`,
        });

        if (onForgotPasswordSuccess) {
          onForgotPasswordSuccess(email);
        }

        // Redirect to home page
        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
      } else {
        toast({
          title: "Request Password Failed",
          description: data.detail || "An error occurred. Please try again.",
          variant: "destructive",
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
      }

      console.log("Emaiil in:", { email });
    } catch (error) {
      console.error("Request Password error:", error);
      setErrors({
        email: "Invalid email",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      // Implement registration logic here
      console.log("Req Password:", { email });
    } catch (error) {
      console.error("Req Password error:", error);
      setErrors({
        email: "Invalid email",
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

  if (isPageLoading) {
    return <AttractiveLoadingAnimation />;
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

      {/* Versi Mobile */}
      <div className="flex items-center justify-center min-h-screen px-4 py-6 lg:hidden">
        <Card className="w-full max-w-sm bg-white rounded-lg shadow-lg">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl font-bold text-center">
              Forgot Password
            </CardTitle>
            <CardDescription className="text-sm text-center">
              Enter your email address to reset your password
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6" onSubmit={handleForgotPassword}>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Your Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full h-10 text-base px-3 border ${
                    errors.email
                      ? "border-red-500"
                      : "bg-slate-200 border-gray-300 dark:bg-slate-700"
                  } rounded-md`}
                  aria-invalid={errors.email ? "true" : "false"}
                />
                {errors.email && (
                  <p className="text-xs text-red-500">{errors.email}</p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full h-10 text-sm bg-green-500 rounded-md"
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Reset Password"}
              </Button>
            </form>
            <div className="mt-4 text-xs text-center">
              Remember your password?{" "}
              <a href="/auth/login" className="text-blue-600 underline">
                Sign in
              </a>
            </div>
            <div className="mt-2 text-xs text-center">
              <a href="/" className="text-blue-600 underline">
                Back to Home
              </a>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bagian Kanan (Form Versi Desktop) */}
      <div className="items-center justify-center hidden py-12 lg:flex ">
        <Card className="mx-auto w-[350px] shadow-2xl opacity-100">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">
              Forgot Password
            </CardTitle>
            <CardDescription>Enter your Email</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4" onSubmit={handleForgotPassword}>
              <div className="grid gap-2">
                <Label htmlFor="username">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full border ${
                    errors.email
                      ? "border-red-500"
                      : "bg-slate-200 border-green-500 dark:bg-slate-300"
                  }`}
                  aria-invalid={errors.email ? "true" : "false"}
                />
                {errors.email && (
                  <p className="text-xs text-red-500">{errors.email}</p>
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
            <div className="mt-6 text-sm text-center">
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

export default ForgotPasswordForm;
