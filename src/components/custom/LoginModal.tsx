"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import Captcha from "@/components/custom/Captcha";
import QuotesLocale from "@/components/custom/QuotesLocal";
import { LogIn } from "lucide-react";

const FASTAPI_ENDPOINT = import.meta.env.PUBLIC_FASTAPI_ENDPOINT;

interface LoginModalProps {
  onLoginSuccess?: (username: string) => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onLoginSuccess }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeForm, setActiveForm] = useState<
    "login" | "register" | "forgotPassword"
  >("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isCaptchaValid, setIsCaptchaValid] = useState(false);
  const { toast } = useToast();

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    };

    if (activeForm === "login" || activeForm === "register") {
      if (!username.trim()) {
        newErrors.username = "Username harus diisi";
        isValid = false;
      }
      if (!password.trim()) {
        newErrors.password = "Password harus diisi";
        isValid = false;
      }
    }

    if (activeForm === "register") {
      if (!email.trim()) {
        newErrors.email = "Email harus diisi";
        isValid = false;
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        newErrors.email = "Email tidak valid";
        isValid = false;
      }
      if (password !== confirmPassword) {
        newErrors.confirmPassword = "Password tidak cocok";
        isValid = false;
      }
    }

    if (activeForm === "forgotPassword") {
      if (!email.trim()) {
        newErrors.email = "Email harus diisi";
        isValid = false;
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        newErrors.email = "Email tidak valid";
        isValid = false;
      }
    }

    if (!isCaptchaValid) {
      isValid = false;
      toast({
        title: "Error",
        description: "Silakan selesaikan captcha",
        variant: "destructive",
      });
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      let response;
      let data;

      switch (activeForm) {
        case "login":
          response = await fetch(FASTAPI_ENDPOINT + "/auth/login", {
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

          data = await response.json();

          console.log("Response data:", data);

          if (response.ok) {
            document.cookie = `access_token=${data.access_token}; path=/; max-age=3600; secure; samesite=strict`;
            document.cookie = `user_id=${data.user_id}; path=/; max-age=3600; secure; samesite=strict`;
            document.cookie = `username=${username}; path=/; max-age=3600; secure; samesite=strict`;
            console.log(`access_tokenZ: ${data.access_token}`);
            console.log(`user_idZ: ${data.user_id}`);

            setIsOpen(false);
            toast({
              title: "Login Berhasil",
              description: `Selamat datang kembali, ${username}! `,
            });
            if (onLoginSuccess) {
              onLoginSuccess(username);
            }
            setTimeout(() => {
              window.location.href = "/dashboard";
            }, 1000);
          } else {
            throw new Error(data.detail || "Terjadi kesalahan saat login");
          }
          break;

        case "register":
          response = await fetch(FASTAPI_ENDPOINT + "/auth/register", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({
              name: username,
              email,
              password,
              role: "customer",
              is_active: true,
            }),
          });
          data = await response.json();

          if (response.ok) {
            toast({
              title: "Registrasi Berhasil",
              description: "Anda sekarang dapat masuk ke akun Anda.",
            });
            setActiveForm("login");
          } else {
            throw new Error(data.detail || "Registrasi gagal");
          }
          break;

        case "forgotPassword":
          response = await fetch(FASTAPI_ENDPOINT + "/auth/forgot-password", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: email,
            }),
          });

          if (response.ok) {
            toast({
              title: "Email Terkirim",
              description:
                "Silakan periksa email Anda untuk instruksi selanjutnya.",
            });
            setActiveForm("login");
          } else {
            throw new Error("Gagal mengirim email reset password");
          }
          break;
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Kesalahan",
        description:
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan yang tidak terduga",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderForm = () => {
    switch (activeForm) {
      case "login":
        return (
          <>
            <DialogHeader>
              <DialogTitle className="mb-2 text-2xl font-bold dark:text-white">
                Login ke Akun
              </DialogTitle>
              <p className="mb-6 text-gray-600 dark:text-gray-300">
                Selamat datang kembali! Silakan masukkan detail Anda.
              </p>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="username" className="dark:text-white">
                  Username
                </Label>
                <Input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                  className="mt-1 bg-gray-300 focus:border-purple-500 focus:ring-purple-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
                {errors.username && (
                  <p className="text-xs text-red-500 dark:text-red-400">
                    {errors.username}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="password" className="dark:text-white">
                  Kata Sandi
                </Label>
                <Input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Kata Sandi"
                  className="mt-1 bg-gray-300 focus:border-purple-500 focus:ring-purple-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
                {errors.password && (
                  <p className="text-xs text-red-500 dark:text-red-400">
                    {errors.password}
                  </p>
                )}
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <Checkbox id="remember" />
                  <span className="ml-2 text-sm dark:text-gray-300">
                    Ingat saya
                  </span>
                </label>
                <a
                  href="#"
                  onClick={() => setActiveForm("forgotPassword")}
                  className="text-sm text-purple-600 hover:underline dark:text-purple-400"
                >
                  Lupa kata sandi?
                </a>
              </div>
              <Captcha onValidate={setIsCaptchaValid} />
              <Button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800"
                disabled={isLoading || !isCaptchaValid}
              >
                {isLoading ? "Sedang Masuk..." : "Masuk"}
              </Button>
            </form>
            <p className="mt-6 text-sm text-center dark:text-gray-300">
              Belum punya akun?{" "}
              <a
                href="#"
                onClick={() => setActiveForm("register")}
                className="text-purple-600 hover:underline dark:text-purple-400"
              >
                Daftar
              </a>
            </p>
          </>
        );
      case "register":
        return (
          <>
            <DialogHeader>
              <DialogTitle className="mb-2 text-2xl font-bold dark:text-white">
                Buat Akun
              </DialogTitle>
              <p className="mb-6 text-gray-600 dark:text-gray-300">
                Silakan isi informasi Anda untuk mendaftar.
              </p>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="username" className="dark:text-white">
                  Nama Lengkap
                </Label>
                <Input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Nama Lengkap"
                  className="mt-1 bg-gray-300 focus:border-purple-500 focus:ring-purple-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
                {errors.username && (
                  <p className="text-xs text-red-500 dark:text-red-400">
                    {errors.username}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="email" className="dark:text-white">
                  Email
                </Label>
                <Input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="mt-1 bg-gray-300 focus:border-purple-500 focus:ring-purple-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
                {errors.email && (
                  <p className="text-xs text-red-500 dark:text-red-400">
                    {errors.email}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="password" className="dark:text-white">
                  Kata Sandi
                </Label>
                <Input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Kata Sandi"
                  className="mt-1 bg-gray-300 focus:border-purple-500 focus:ring-purple-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
                {errors.password && (
                  <p className="text-xs text-red-500 dark:text-red-400">
                    {errors.password}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="confirmPassword" className="dark:text-white">
                  Konfirmasi Kata Sandi
                </Label>
                <Input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Konfirmasi Kata Sandi"
                  className="mt-1 bg-gray-300 focus:border-purple-500 focus:ring-purple-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
                {errors.confirmPassword && (
                  <p className="text-xs text-red-500 dark:text-red-400">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
              <Captcha onValidate={setIsCaptchaValid} />
              <Button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800"
                disabled={isLoading || !isCaptchaValid}
              >
                {isLoading ? "Sedang Mendaftar..." : "Daftar"}
              </Button>
            </form>
            <p className="mt-6 text-sm text-center dark:text-gray-300">
              Sudah punya akun?{" "}
              <a
                href="#"
                onClick={() => setActiveForm("login")}
                className="text-purple-600 hover:underline dark:text-purple-400"
              >
                Masuk
              </a>
            </p>
          </>
        );
      case "forgotPassword":
        return (
          <>
            <DialogHeader>
              <DialogTitle className="mb-2 text-2xl font-bold dark:text-white">
                Lupa Kata Sandi
              </DialogTitle>
              <p className="mb-6 text-gray-600 dark:text-gray-300">
                Masukkan email Anda untuk mengatur ulang kata sandi.
              </p>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email" className="dark:text-white">
                  Email
                </Label>
                <Input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="mt-1 bg-gray-200 focus:border-purple-500 focus:ring-purple-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
                {errors.email && (
                  <p className="text-xs text-red-500 dark:text-red-400">
                    {errors.email}
                  </p>
                )}
              </div>
              <Captcha onValidate={setIsCaptchaValid} />
              <Button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800"
                disabled={isLoading || !isCaptchaValid}
              >
                {isLoading ? "Mengirim..." : "Kirim"}
              </Button>
            </form>
            <p className="mt-6 text-sm text-center dark:text-gray-300">
              Sudah ingat kata sandi Anda?{" "}
              <a
                href="#"
                onClick={() => setActiveForm("login")}
                className="text-purple-600 hover:underline dark:text-purple-400"
              >
                Masuk
              </a>
            </p>
          </>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100"
        >
          <LogIn className="w-4 h-4 mr-2" /> <span className="">Login</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-4xl p-0 m-4 overflow-hidden bg-white rounded-lg shadow-lg">
        <div className="flex flex-col bg-gray-200 md:flex-row">
          <div className="hidden w-1/2 p-8 text-white bg-purple-600 md:block">
            <div className="relative flex flex-col justify-center h-full">
              <div className="flex flex-col items-center">
                <QuotesLocale />
              </div>
            </div>
          </div>
          <div className="w-full p-8 bg-white md:w-1/2 dark:bg-gray-800">
            {renderForm()}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
