import "@/styles/globals.css";

import React, { useState, useEffect } from "react";

import { createClient } from "pexels";
import Autoplay from "embla-carousel-autoplay";
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
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import AttractiveLoadingAnimation from "@/components/custom/AttractiveLoadingAnimation";
import { Loader, Placeholder } from "rsuite";
import "rsuite/dist/rsuite-no-reset.min.css";

const PEXELS_API_KEY = import.meta.env.PUBLIC_PEXELS_API_KEY;
const PEXELS_QUERY = ["real estate"][Math.floor(Math.random() * 3)];

const client = createClient(PEXELS_API_KEY);
const FASTAPI_ENDPOINT = import.meta.env.PUBLIC_FASTAPI_ENDPOINT;

// Fungsi untuk mode maintenance
const isMaintenanceMode = () => {
  // Logika untuk menentukan apakah dalam mode maintenance
  // Misalnya, bisa menggunakan variabel lingkungan atau kondisi tertentu
  return true; // Ganti menjadi true untuk mengaktifkan mode maintenance
};

const RegisterForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ name: "", password: "" });
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(FASTAPI_ENDPOINT + "/auth/register", {
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
      });

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
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  );

  if (isPageLoading) {
    return (
      <div className="h-screen bg-[#94918d]">
        <Loader size="lg" inverse center content="loading..." />
      </div>
    );
  }

  if (isMaintenanceMode()) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <div className="p-8 text-center bg-white rounded-lg shadow-xl">
          <h1 className="mb-4 text-4xl font-bold text-gray-800">Coming Soon</h1>
          <p className="mb-6 text-xl text-gray-600">
            We're working on something awesome. Please check back later!
          </p>
          <Button
            onClick={() => (window.location.href = "/")}
            className="px-6 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            Kembali ke Beranda
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full m-0 lg:grid lg:grid-cols-2">
      {/* Bagian Kiri (Carousel) */}
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

      {/* Bagian Kanan (Form Register) */}

      {/* Versi Mobile */}
      <div className="flex items-center justify-center min-h-screen px-4 py-6 lg:hidden">
        <Card className="w-full max-w-sm bg-white rounded-lg shadow-2xl">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl font-bold text-center">
              Register Mobile
            </CardTitle>
            <CardDescription className="text-sm text-center">
              Enter your name, email, and password below to register your
              account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6" onSubmit={handleRegister}>
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Name
                </Label>
                <Input
                  id="name1"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full h-10 text-base px-3 border ${
                    errors.name
                      ? "border-red-500"
                      : "bg-slate-200 border-green-500 dark:bg-slate-700"
                  } rounded-md`}
                  aria-invalid={errors.name ? "true" : "false"}
                />
                {errors.name && (
                  <p className="text-xs text-red-500">{errors.name}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <Input
                  id="email1"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full h-10 text-base px-3 border ${
                    errors.name
                      ? "border-red-500"
                      : "bg-slate-200 border-green-500 dark:bg-slate-700"
                  } rounded-md`}
                  aria-invalid={errors.name ? "true" : "false"}
                />
                {errors.name && (
                  <p className="text-xs text-red-500">{errors.name}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <Input
                  id="password1"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full h-10 text-base px-3 border ${
                    errors.password
                      ? "border-red-500"
                      : "bg-slate-200 border-green-500 dark:bg-slate-700"
                  } rounded-md`}
                  aria-invalid={errors.password ? "true" : "false"}
                />
                {errors.password && (
                  <p className="text-xs text-red-500">{errors.password}</p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full h-10 text-sm bg-green-500 rounded-md"
                disabled={isLoading}
              >
                {isLoading ? "Registering..." : "Register"}
              </Button>
              <Button
                variant="outline"
                className="w-full h-10 text-sm border border-green-500 rounded-md"
              >
                Register with Google
              </Button>
            </form>
            <div className="mt-4 text-xs text-center">
              Already have an account?{" "}
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

      {/* Versi Desktop */}
      <div className="items-center justify-center hidden px-8 py-12 lg:flex">
        <Card className="w-full max-w-md p-8 bg-white rounded-lg shadow-2xl">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">
              Register
            </CardTitle>
            <CardDescription className="text-center">
              Enter your name, email, and password below to register your
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

export default RegisterForm;
