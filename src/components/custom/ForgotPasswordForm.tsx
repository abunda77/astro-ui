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

const PEXELS_API_KEY =
  "qx8GVjVSbbbIzugyU7YdcWvufPqQBjFed1CeoV0exEfksFiKWoSVmV9g";
const PEXELS_QUERY = ["property"][Math.floor(Math.random() * 3)];

const client = createClient(PEXELS_API_KEY);

const ForgotPasswordForm: React.FC<{
  onForgotPasswordSuccess?: (email: string) => void;
}> = ({ onForgotPasswordSuccess }) => {
  const [email, setEmail] = useState("");

  const [errors, setErrors] = useState({ email: "" });
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

  const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      const response = await fetch(
        "https://fastapi.serverdata.my.id//api/v1/auth/forgot-password",
        {
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
        }
      );

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
      <div className="flex items-center justify-center min-h-screen px-2 py-8 sm:px-4 lg:hidden">
        <Card className="w-full max-w-4xl p-12 bg-white rounded-lg shadow-2xl">
          <CardHeader>
            <CardTitle className="text-6xl font-bold text-center">
              Login Mobile
            </CardTitle>
            <CardDescription className="text-4xl text-center">
              Enter your username and password below to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="grid gap-12" onSubmit={handleForgotPassword}>
              <div className="grid gap-6">
                <Label htmlFor="email" className="text-4xl font-medium">
                  Your Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full h-28 text-5xl px-8 border ${
                    errors.email
                      ? "border-red-500"
                      : "bg-slate-200 border-green-500 dark:bg-slate-300"
                  } rounded-lg`}
                  aria-invalid={errors.email ? "true" : "false"}
                />
                {errors.email && (
                  <p className="text-xl text-red-500">{errors.email}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full text-5xl bg-green-500 rounded-lg h-28"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>
            <div className="mt-6 text-4xl text-center">
              Don't have an account?{" "}
              <a href="/auth/register" className="text-blue-600 underline">
                Sign up
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
