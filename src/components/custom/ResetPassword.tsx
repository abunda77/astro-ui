import "@/styles/globals.css";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import QuotesLocale from "@/components/custom/QuotesLocal";
import { toast } from "@/components/ui/use-toast";

const FASTAPI_ENDPOINT = import.meta.env.PUBLIC_FASTAPI_ENDPOINT;

const ResetPassword: React.FC = () => {
  const [urlParams, setUrlParams] = useState<URLSearchParams | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setUrlParams(params);
    setToken(params.get("token"));
  }, []);

  useEffect(() => {
    if (token) {
      console.log("Nilai token:", token);
    }
  }, [token]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Kata sandi tidak cocok",
        variant: "destructive",
      });
      return;
    }

    if (!token) {
      console.log("Token tidak ditemukan atau tidak valid");
      toast({
        title: "Error",
        description: "Token tidak valid atau hilang.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(FASTAPI_ENDPOINT + "/auth/reset-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: token,
          new_password: password,
        }),
      });

      if (!response.ok) {
        if (response.status === 400) {
          const errorData = await response.json();
          throw new Error(
            errorData.detail || "Gagal mengatur ulang kata sandi"
          );
        }
        throw new Error("Gagal mengatur ulang kata sandi");
      }

      toast({
        title: "Berhasil",
        description: "Kata sandi berhasil diatur ulang",
      });

      // Redirect ke halaman login setelah berhasil
      setTimeout(() => {
        window.location.href = "/loginpage";
      }, 1000);
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Terjadi masalah saat mengatur ulang kata sandi Anda",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Render formulir
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-800 via-blue-300 to-white">
      <div className="w-full max-w-4xl m-4 overflow-hidden bg-white rounded-lg shadow-lg">
        <div className="flex flex-col md:flex-row">
          <div className="hidden w-1/2 p-8 text-white bg-purple-600 md:block">
            <div className="relative flex flex-col justify-center h-full">
              <QuotesLocale />
              <h2 className="mb-4 text-3xl font-bold mt-36">
                Atur Ulang Kata Sandi
              </h2>
              <p className="mb-8">
                Silakan isi informasi Anda untuk mengatur ulang kata sandi Anda.
              </p>
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
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <Label htmlFor="password">Kata Sandi Baru</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Kata Sandi Baru"
                  className="mt-1 bg-gray-200 focus:border-purple-500 focus:ring-purple-500"
                  required
                />
              </div>
              <div>
                <Label htmlFor="confirmPassword">Konfirmasi Kata Sandi</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Konfirmasi Kata Sandi"
                  className="mt-1 bg-gray-200 focus:border-purple-500 focus:ring-purple-500"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700"
                disabled={isLoading}
              >
                {isLoading ? "Mengatur Ulang..." : "Atur Ulang Kata Sandi"}
              </Button>
            </form>
            <div className="mt-6 text-center">
              <a
                href="/"
                className="mr-4 text-sm font-medium text-purple-600 hover:text-purple-800"
              >
                Beranda
              </a>
              <a
                href="/loginpage"
                className="text-sm font-medium text-purple-600 hover:text-purple-800"
              >
                Masuk
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
