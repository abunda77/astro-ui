import React, { useEffect, useState } from "react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  MessageCircle,
  Phone,
  CircleUser,
  Loader2,
  Terminal,
  Eye,
  EyeOff,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getAccessToken } from "@/utils/auth";
import ProfileDetail from "./ProfileDetail";

interface UserProfileProps {
  userData: {
    name: string;
    email: string;
    password: string;
    role: string;
    is_active: boolean;
    profile: {
      user_id: number;
      title: string;
      first_name: string | null;
      last_name: string | null;
      email: string | null;
      phone: string | null;
      whatsapp: string | null;
      address: string | null;
      province_id: string | null;
      district_id: string | null;
      city_id: string | null;
      village_id: string | null;
      gender: "man" | "woman" | null;
      birthday: string | null;
      avatar: string | null;
      remote_url: string | null;
      company_name: string | null;
      biodata_company: string | null;
      jobdesk: string | null;
      social_media: {
        facebook: string | null;
        twitter: string | null;
        instagram: string | null;
        linkedin: string | null;
        youtube: string | null;
        tiktok: string | null;
        snapchat: string | null;
        pinterest: string | null;
        reddit: string | null;
        zoom: string | null;
      };
      id: number;
      province: {
        code: string;
        name: string;
        level: string;
      } | null;
      district: {
        code: string;
        name: string;
        level: string;
      } | null;
      city: {
        code: string;
        name: string;
        level: string;
      } | null;
      village: {
        code: string;
        name: string;
        level: string;
      } | null;
    };
  };
  homedomain: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ userData, homedomain }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [alertInfo, setAlertInfo] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Simulasikan pemuatan data
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setIsLoading(false);
      } catch (error) {
        console.error("Error memuat data pengguna:", error);
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  const handleSave = async () => {
    if (newPassword.length < 6) {
      setPasswordError(
        "Kata sandi baru harus terdiri dari minimal 6 karakter."
      );
      return;
    }

    setIsSaving(true);

    try {
      const accessToken = getAccessToken();
      console.log("access_token:", accessToken);
      console.log("current_password:", currentPassword);
      console.log("new_password:", newPassword);

      const response = await fetch(
        `${import.meta.env.PUBLIC_FASTAPI_ENDPOINT}/auth/change-password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            current_password: currentPassword,
            new_password: newPassword,
          }),
        }
      );

      if (response.ok) {
        setAlertInfo({
          type: "success",
          message: "Kata sandi berhasil diubah",
        });
        setIsEditing(false);
        setPasswordError(null);
      } else {
        throw new Error("Gagal mengubah kata sandi");
      }
    } catch (error) {
      setAlertInfo({
        type: "error",
        message: "Gagal mengubah kata sandi. Silakan coba lagi.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setCurrentPassword("");
    setNewPassword("");
    setPasswordError(null);
  };

  if (isLoading) {
    return (
      <Card className="max-w-full p-4 rounded-lg shadow-lg md:p-6 bg-gradient-to-br from-blue-100 to-purple-200 dark:from-gray-800 dark:to-purple-900">
        <CardHeader className="mb-4 md:mb-6">
          <Skeleton className="h-6 mb-2 w-36 md:w-48 md:h-8 animate-pulse" />
          <Skeleton className="w-48 h-4 md:w-64 md:h-6 animate-pulse" />
        </CardHeader>
        <CardContent className="space-y-4 md:space-y-6">
          <div className="p-4 bg-gray-200 rounded-lg shadow-md md:p-6 dark:bg-gray-800">
            <Skeleton className="w-full h-6 mb-3 md:h-8 md:mb-4 animate-pulse" />
            <div className="grid gap-3 md:gap-4 md:grid-cols-2">
              <div className="space-y-3 md:space-y-4">
                <Skeleton className="w-full h-4 md:h-6 animate-pulse" />
              </div>
              <div className="space-y-3 md:space-y-4">
                <Skeleton className="w-full h-4 md:h-6 animate-pulse" />
              </div>
            </div>
          </div>
          <div className="p-4 bg-gray-200 rounded-lg shadow-md md:p-6 dark:bg-gray-800">
            <Skeleton className="w-full h-6 mb-3 md:h-8 md:mb-4 animate-pulse" />
            <div className="grid gap-3 md:gap-4 md:grid-cols-3">
              <div className="flex flex-col items-center">
                <Skeleton className="w-20 h-20 mb-3 rounded-full md:w-24 md:h-24 md:mb-4 animate-pulse" />
                <Skeleton className="h-4 mb-2 w-28 md:w-32 md:h-6 animate-pulse" />
                <Skeleton className="w-32 h-4 mb-2 md:w-40 md:h-6 animate-pulse" />
                <Skeleton className="h-4 mb-2 w-30 md:w-36 md:h-6 animate-pulse" />
                <Skeleton className="h-4 w-36 md:w-44 md:h-6 animate-pulse" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Skeleton className="w-full h-4 md:h-6 animate-pulse" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isProfileEmpty =
    !userData.profile ||
    Object.values(userData.profile).every((value) => value === null);

  if (isProfileEmpty) {
    return (
      <Card className="flex items-center justify-center h-64 max-w-full p-4 rounded-lg shadow-lg md:p-6 bg-gradient-to-br from-blue-100 to-purple-200 dark:from-gray-800 dark:to-purple-900">
        <Button
          variant="outline"
          size="lg"
          className="text-white bg-blue-500 hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800"
        >
          Buat Profile
        </Button>
      </Card>
    );
  }

  return (
    <Card className="max-w-full p-4 rounded-lg shadow-lg md:p-6 bg-gradient-to-br from-blue-100 to-purple-200 dark:from-gray-800 dark:to-purple-900">
      <CardHeader className="mb-4 md:mb-6">
        <CardTitle className="text-xl font-bold text-blue-800 md:text-2xl dark:text-blue-300">
          Profil Pengguna
        </CardTitle>
        <CardDescription className="text-lg font-semibold text-blue-700 md:text-xl dark:text-blue-300">
          Selamat datang kembali, {userData.name}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 md:space-y-6">
        {alertInfo && (
          <Alert
            variant={alertInfo.type === "success" ? "success" : "destructive"}
          >
            <Terminal className="w-4 h-4" />
            <AlertTitle>
              {alertInfo.type === "success" ? "Berhasil!" : "Kesalahan!"}
            </AlertTitle>
            <AlertDescription>{alertInfo.message}</AlertDescription>
          </Alert>
        )}
        {/* Informasi Pengguna */}
        <div className="p-4 rounded-lg shadow-md md:p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <h3 className="text-base font-semibold text-blue-700 md:text-lg dark:text-blue-300">
              Informasi Pengguna
            </h3>
            <Button
              variant="outline"
              size="sm"
              className="text-xs text-white hover:text-gray-200 dark:text-gray-100 bg-blue-500 md:text-sm hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? "Clear" : "Edit"}
            </Button>
          </div>
          <div className="grid gap-3 md:gap-4 md:grid-cols-2">
            <div className="space-y-3 md:space-y-4">
              <div className="flex justify-between text-xs md:text-sm">
                <span className="font-semibold text-gray-700 dark:text-gray-300">
                  Email:
                </span>
                <span className="text-gray-600 break-all dark:text-gray-400">
                  {userData.email}
                </span>
              </div>
              <div className="flex justify-between text-xs md:text-sm">
                <span className="font-semibold text-gray-700 dark:text-gray-300">
                  Password:
                </span>
                {isEditing ? (
                  <div className="space-y-2">
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Password Sekarang
                      </label>
                      <Input
                        type={showCurrentPassword ? "text" : "password"}
                        className="bg-gray-300 pr-10"
                        placeholder="Kata sandi saat ini"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 flex items-center pr-3 mt-6"
                        onClick={() =>
                          setShowCurrentPassword(!showCurrentPassword)
                        }
                      >
                        {showCurrentPassword ? (
                          <EyeOff className="w-5 h-5 text-gray-400" />
                        ) : (
                          <Eye className="w-5 h-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Password Baru
                      </label>
                      <Input
                        type={showNewPassword ? "text" : "password"}
                        className="bg-gray-300 pr-10"
                        placeholder="Kata sandi baru"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 flex items-center pr-3 mt-6"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? (
                          <EyeOff className="w-5 h-5 text-gray-400" />
                        ) : (
                          <Eye className="w-5 h-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                    {passwordError && (
                      <p className="text-xs text-red-500">{passwordError}</p>
                    )}
                    <div className="flex space-x-2">
                      <Button
                        onClick={handleSave}
                        className="text-xs text-white hover:text-gray-200 dark:text-gray-100 bg-blue-500 md:text-sm hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800"
                        disabled={isSaving}
                      >
                        {isSaving ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Menyimpan...
                          </>
                        ) : (
                          "Simpan"
                        )}
                      </Button>
                      <Button
                        onClick={handleCancel}
                        variant="default"
                        className="text-xs"
                      >
                        Batal
                      </Button>
                    </div>
                  </div>
                ) : (
                  <span className="text-gray-600 dark:text-gray-400">
                    **********
                  </span>
                )}
              </div>
            </div>
            <div className="space-y-3 md:space-y-4">
              <div className="flex justify-between text-xs md:text-sm">
                <span className="font-semibold text-gray-700 dark:text-gray-300">
                  Peran:
                </span>
                <span className="text-gray-600 dark:text-gray-400">
                  {userData.role}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs md:text-sm">
                <span className="font-semibold text-gray-700 dark:text-gray-300">
                  Status:
                </span>
                <Badge
                  variant={userData.is_active ? "default" : "secondary"}
                  className={`text-xs md:text-sm ${
                    userData.is_active
                      ? "dark:text-white bg-green-500 dark:bg-green-700"
                      : "bg-gray-500 dark:bg-gray-700"
                  }`}
                >
                  {userData.is_active ? "Aktif" : "Tidak Aktif"}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Ganti bagian Profil dengan komponen ProfileDetail */}
        <ProfileDetail userData={userData} homedomain={homedomain} />
      </CardContent>
    </Card>
  );
};

export default UserProfile;
