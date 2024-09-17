import "@/styles/globals.css";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Captcha from "@/components/custom/Captcha";
import QuotesLocale from "@/components/custom/QuotesLocal";
import { toast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { setCookie, setUserId, setAccessToken } from "@/utils/auth";

const FASTAPI_ENDPOINT = import.meta.env.PUBLIC_FASTAPI_ENDPOINT;

const FormLoginRegister: React.FC = () => {
  const [isLoginForm, setIsLoginForm] = useState(false);
  const [isCaptchaValid, setIsCaptchaValid] = useState(false);
  const [isForgotPasswordForm, setIsForgotPasswordForm] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    setTimeout(() => setIsPageLoading(false), 2000);
  }, []);

  const toggleForm = () => {
    setIsLoginForm(!isLoginForm);
    setIsForgotPasswordForm(false);
  };

  const toggleForgotPasswordForm = () => {
    setIsForgotPasswordForm(!isForgotPasswordForm);
    setIsLoginForm(false);
  };

  const handleCaptchaValidation = (isValid: boolean) => {
    setIsCaptchaValid(isValid);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(FASTAPI_ENDPOINT + "/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send reset password email");
      }

      toast({
        title: "Email Terkirim",
        description: "Silakan periksa email Anda untuk instruksi selanjutnya.",
      });

      // Redirect to login page after success
      setTimeout(() => {
        setIsForgotPasswordForm(false);
        setIsLoginForm(true);
      }, 3000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Terjadi masalah saat mengirim email reset password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      const response = await fetch(FASTAPI_ENDPOINT + "/auth/login", {
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
        setAccessToken(data.access_token);
        setUserId(data.user_id);
        setCookie("username", username, 7);
        setCookie("access_token", data.access_token, 7);
        setCookie("user_id", data.user_id.toString(), 7);

        console.log("Access Token A:", data.access_token);
        console.log("User ID A:", data.user_id);

        toast({
          title: "Login Berhasil",
          description: `Selamat datang kembali, ${username}!`,
        });

        // Menggunakan window.location.href untuk mengarahkan ke dashboard
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 8000);
      } else {
        toast({
          title: "Login Gagal",
          description: data.detail || "Terjadi kesalahan. Silakan coba lagi.",
          variant: "destructive",
          action: <ToastAction altText="Coba lagi">Coba lagi</ToastAction>,
        });
      }

      console.log("Logging in:", { username, password });
    } catch (error) {
      console.error("Login error:", error);
      setErrors({
        ...errors,
        username: "Username tidak valid",
        password: "Password tidak valid",
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
      const response = await fetch(FASTAPI_ENDPOINT + "/auth/register", {
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

      const data = await response.json();

      if (response.ok) {
        console.log("Registrasi berhasil:", data);
        toast({
          title: "Registrasi Berhasil",
          description: "Anda sekarang dapat masuk ke akun Anda.",
          action: <ToastAction altText="Tutup">Tutup</ToastAction>,
        });

        setTimeout(() => {
          setIsLoginForm(true);
        }, 3000);
      } else {
        throw new Error(data.detail || "Registrasi gagal");
      }
    } catch (error: unknown) {
      console.error("Kesalahan registrasi:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Kesalahan tidak diketahui";

      toast({
        title: "Registrasi Gagal",
        description: errorMessage,
        variant: "destructive",
        action: <ToastAction altText="Tutup">Tutup</ToastAction>,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    };

    if (!username.trim()) {
      newErrors.username = "Username harus diisi";
      isValid = false;
    }

    if (!isLoginForm) {
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

    if (!password.trim()) {
      newErrors.password = "Password harus diisi";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-violet-100 to-indigo-300 dark:from-gray-900 dark:via-purple-900 dark:to-gray-950">
      <div className="w-full max-w-4xl m-4 overflow-hidden bg-white rounded-lg shadow-lg">
        <div className="flex flex-col md:flex-row">
          <div className="hidden w-1/2 p-8 text-white bg-purple-600 md:block">
            <div className="relative flex flex-col justify-center h-full">
              <QuotesLocale />
              <h2 className="mb-4 text-3xl font-bold mt-36">
                {isLoginForm
                  ? "Selamat Datang Kembali!"
                  : isForgotPasswordForm
                    ? "Lupa Kata Sandi?"
                    : "Halo, Teman!"}
              </h2>
              <p className="mb-8">
                {isLoginForm
                  ? "Untuk tetap terhubung dengan kami, silakan login dengan informasi pribadi Anda."
                  : isForgotPasswordForm
                    ? "Jangan khawatir, kami akan membantu Anda mengatur ulang kata sandi Anda."
                    : "Silakan isi informasi Anda untuk membuat akun dan mulai perjalanan bersama kami."}
              </p>
              <Button
                onClick={toggleForm}
                className="transition-colors bg-transparent border-2 border-white hover:bg-white hover:text-purple-600"
              >
                {isLoginForm ? "Daftar" : "Masuk"}
              </Button>
            </div>
          </div>
          <div className="w-full p-8 md:w-1/2">
            <div className="mb-8">
              <img
                src="/images/logo.png"
                alt="Bosque Properti"
                className="h-8"
              />
            </div>
            {isLoginForm ? (
              <>
                <h2 className="mb-2 text-2xl font-bold">Login ke Akun</h2>
                <p className="mb-6 text-gray-600">
                  Selamat datang kembali! Silakan masukkan detail Anda.
                </p>
                <form id="login" className="space-y-4" onSubmit={handleLogin}>
                  <div>
                    <Label htmlFor="username">Username</Label>
                    <Input
                      type="text"
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Username"
                      className="mt-1 bg-gray-200 focus:border-purple-500 focus:ring-purple-500"
                    />
                    {errors.username && (
                      <p className="text-xs text-red-500">{errors.username}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="password">Kata Sandi</Label>
                    <Input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Kata Sandi"
                      className="mt-1 bg-gray-200 focus:border-purple-500 focus:ring-purple-500"
                    />
                    {errors.password && (
                      <p className="text-xs text-red-500">{errors.password}</p>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="flex items-center">
                      <Checkbox id="remember" />
                      <span className="ml-2 text-sm">Ingat saya</span>
                    </label>
                    <a
                      href="#forgot-password"
                      onClick={toggleForgotPasswordForm}
                      className="text-sm text-purple-600 hover:underline"
                    >
                      Lupa kata sandi?
                    </a>
                  </div>
                  <Captcha onValidate={handleCaptchaValidation} />
                  <Button
                    type="submit"
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    disabled={!isCaptchaValid || isLoading}
                  >
                    {isLoading ? "Sedang Masuk..." : "Masuk"}
                  </Button>
                </form>
                <p className="mt-6 text-sm text-center">
                  Belum punya akun?{" "}
                  <a
                    href="#register"
                    onClick={toggleForm}
                    className="text-purple-600 hover:underline"
                  >
                    Daftar
                  </a>
                </p>
              </>
            ) : isForgotPasswordForm ? (
              <>
                <h2 className="mb-2 text-2xl font-bold">Lupa Kata Sandi</h2>
                <p className="mb-6 text-gray-600">
                  Masukkan email Anda untuk mengatur ulang kata sandi.
                </p>
                <form
                  id="forgot-password"
                  className="space-y-4"
                  onSubmit={handleForgotPassword}
                >
                  <div>
                    <Label htmlFor="forgotPasswordEmail">Email</Label>
                    <Input
                      type="email"
                      id="forgotPasswordEmail"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email"
                      className="mt-1 bg-gray-200 focus:border-purple-500 focus:ring-purple-500"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    disabled={isLoading}
                  >
                    {isLoading ? "Mengirim..." : "Kirim Link Reset Password"}
                  </Button>
                </form>
                <p className="mt-6 text-sm text-center">
                  Ingat kata sandi Anda?{" "}
                  <a
                    href="#login"
                    onClick={() => setIsForgotPasswordForm(false)}
                    className="text-purple-600 hover:underline"
                  >
                    Kembali ke Login
                  </a>
                </p>
              </>
            ) : (
              <>
                <h2 className="mb-2 text-2xl font-bold">Buat Akun</h2>
                <p className="mb-6 text-gray-600">
                  Silakan isi informasi Anda untuk mendaftar.
                </p>
                <form
                  id="register"
                  className="space-y-4"
                  onSubmit={handleRegister}
                >
                  <div>
                    <Label htmlFor="fullName">Nama Lengkap</Label>
                    <Input
                      type="text"
                      id="fullName"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Nama Lengkap"
                      className="mt-1 bg-gray-200 focus:border-purple-500 focus:ring-purple-500"
                    />
                    {errors.username && (
                      <p className="text-xs text-red-500">{errors.username}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email"
                      className="mt-1 bg-gray-200 focus:border-purple-500 focus:ring-purple-500"
                    />
                    {errors.email && (
                      <p className="text-xs text-red-500">{errors.email}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="password">Kata Sandi</Label>
                    <Input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Kata Sandi"
                      className="mt-1 bg-gray-200 focus:border-purple-500 focus:ring-purple-500"
                    />
                    {errors.password && (
                      <p className="text-xs text-red-500">{errors.password}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword">
                      Konfirmasi Kata Sandi
                    </Label>
                    <Input
                      type="password"
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Konfirmasi Kata Sandi"
                      className="mt-1 bg-gray-200 focus:border-purple-500 focus:ring-purple-500"
                    />
                  </div>
                  <Captcha onValidate={handleCaptchaValidation} />
                  <Button
                    type="submit"
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    disabled={!isCaptchaValid || isLoading}
                  >
                    {isLoading ? "Sedang Mendaftar..." : "Daftar"}
                  </Button>
                </form>
                <p className="mt-6 text-sm text-center">
                  Sudah punya akun?{" "}
                  <a
                    href="#login"
                    onClick={toggleForm}
                    className="text-purple-600 hover:underline"
                  >
                    Masuk
                  </a>
                </p>
              </>
            )}
            <p className="mt-6 text-sm text-center">
              <a href="/" className="text-purple-600 hover:underline">
                Kembali ke Beranda
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormLoginRegister;
