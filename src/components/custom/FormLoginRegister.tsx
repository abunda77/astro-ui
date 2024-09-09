import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const FormLoginRegister: React.FC = () => {
  const [isLoginForm, setIsLoginForm] = useState(true);

  const toggleForm = () => {
    setIsLoginForm(!isLoginForm);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-500">
      <div className="w-full max-w-4xl overflow-hidden bg-white rounded-lg shadow-lg">
        <div className="flex flex-col md:flex-row">
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
                <form className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      type="email"
                      id="email"
                      placeholder="Email"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="password">Kata Sandi</Label>
                    <Input
                      type="password"
                      id="password"
                      placeholder="Kata Sandi"
                      className="mt-1"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="flex items-center">
                      <Checkbox id="remember" />
                      <span className="ml-2 text-sm">Ingat saya</span>
                    </label>
                    <a
                      href="#"
                      className="text-sm text-purple-600 hover:underline"
                    >
                      Lupa kata sandi?
                    </a>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    Masuk
                  </Button>
                </form>
                <p className="mt-6 text-sm text-center">
                  Belum punya akun?{" "}
                  <a
                    href="#"
                    onClick={toggleForm}
                    className="text-purple-600 hover:underline"
                  >
                    Daftar
                  </a>
                </p>
              </>
            ) : (
              <>
                <h2 className="mb-2 text-2xl font-bold">Buat Akun</h2>
                <p className="mb-6 text-gray-600">
                  Silakan isi informasi Anda untuk mendaftar.
                </p>
                <form className="space-y-4">
                  <div>
                    <Label htmlFor="fullName">Nama Lengkap</Label>
                    <Input
                      type="text"
                      id="fullName"
                      placeholder="Nama Lengkap"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      type="email"
                      id="email"
                      placeholder="Email"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="password">Kata Sandi</Label>
                    <Input
                      type="password"
                      id="password"
                      placeholder="Kata Sandi"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword">
                      Konfirmasi Kata Sandi
                    </Label>
                    <Input
                      type="password"
                      id="confirmPassword"
                      placeholder="Konfirmasi Kata Sandi"
                      className="mt-1"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    Daftar
                  </Button>
                </form>
                <p className="mt-6 text-sm text-center">
                  Sudah punya akun?{" "}
                  <a
                    href="#"
                    onClick={toggleForm}
                    className="text-purple-600 hover:underline"
                  >
                    Masuk
                  </a>
                </p>
              </>
            )}
          </div>
          <div className="hidden w-1/2 p-8 text-white bg-purple-600 md:block">
            <div className="flex flex-col justify-center h-full">
              <h2 className="mb-4 text-3xl font-bold">
                {isLoginForm ? "Halo, Teman!" : "Selamat Datang Kembali!"}
              </h2>
              <p className="mb-8">
                {isLoginForm
                  ? "Silakan isi informasi Anda untuk membuat akun dan mulai perjalanan bersama kami."
                  : "Untuk tetap terhubung dengan kami, silakan login dengan informasi pribadi Anda."}
              </p>
              <Button
                onClick={toggleForm}
                className="transition-colors bg-transparent border-2 border-white hover:bg-white hover:text-purple-600"
              >
                {isLoginForm ? "Daftar" : "Masuk"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormLoginRegister;
