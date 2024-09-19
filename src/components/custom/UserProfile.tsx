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
import { Mail, MessageCircle, Phone, CircleUser } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface UserProfileProps {
  userData: {
    name: string;
    email: string;
    password: string;
    role: string;
    is_active: boolean;
    profile: {
      first_name: string | null;
      last_name: string | null;
      phone: string | null;
      email: string | null;
      whatsapp: string | null;
      company_name: string | null;
      avatar: string | null;
      remote_url: string | null;
      biodata_company: string | null;
      jobdesk: string | null;
    };
  };
  homedomain: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ userData, homedomain }) => {
  const [isLoading, setIsLoading] = useState(true);

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
        {/* Informasi Pengguna */}
        <div className="p-4 rounded-lg shadow-md md:p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <h3 className="text-base font-semibold text-blue-700 md:text-lg dark:text-blue-300">
              Informasi Pengguna
            </h3>
            <Button
              variant="outline"
              size="sm"
              className="text-xs text-white bg-blue-500 md:text-sm hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800"
            >
              Edit
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
                <span className="text-gray-600 dark:text-gray-400">
                  **********
                </span>
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
                      ? "bg-blue-500 dark:bg-blue-700"
                      : "bg-gray-500 dark:bg-gray-700"
                  }`}
                >
                  {userData.is_active ? "Aktif" : "Tidak Aktif"}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Profil */}
        <div className="p-4 rounded-lg shadow-md md:p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <h3 className="text-base font-semibold text-blue-700 md:text-lg dark:text-blue-300">
              Profil
            </h3>
            <Button
              variant="outline"
              size="sm"
              className="text-xs text-white bg-blue-500 md:text-sm hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800"
            >
              Edit
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-[0.5fr_1.25fr_1.25fr]">
            <div className="flex flex-col items-start">
              <Avatar className="w-20 h-20 mb-3 md:w-24 md:h-24 md:mb-4 ring-2 ring-blue-300 dark:ring-blue-600">
                <AvatarImage
                  src={
                    userData.profile.avatar
                      ? `${homedomain}/storage/${userData.profile.avatar}`
                      : userData.profile.remote_url
                        ? userData.profile.remote_url
                        : "images/avatar-fallback.gif"
                  }
                  alt={userData.name}
                />
                <AvatarFallback className="text-blue-700 bg-blue-200 dark:bg-blue-700 dark:text-blue-200">
                  {userData.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="space-y-2 md:space-y-3">
              <div className="flex justify-between text-xs md:text-sm">
                <span className="font-semibold text-gray-700 dark:text-gray-300">
                  Nama:
                </span>
                <span className="text-gray-600 break-all dark:text-gray-400">
                  {userData.profile.first_name} {userData.profile.last_name}
                </span>
              </div>
              <div className="flex justify-between text-xs md:text-sm">
                <span className="font-semibold text-gray-700 dark:text-gray-300">
                  Telepon:
                </span>
                <span className="text-gray-600 break-all dark:text-gray-400">
                  {userData.profile.phone}
                </span>
              </div>
              <div className="flex justify-between text-xs md:text-sm">
                <span className="font-semibold text-gray-700 dark:text-gray-300">
                  Email:
                </span>
                <span className="text-gray-600 break-all dark:text-gray-400">
                  {userData.profile.email}
                </span>
              </div>
              <div className="flex justify-between text-xs md:text-sm">
                <span className="font-semibold text-gray-700 dark:text-gray-300">
                  WhatsApp:
                </span>
                <span className="text-gray-600 break-all dark:text-gray-400">
                  {userData.profile.whatsapp}
                </span>
              </div>
            </div>
            <div className="space-y-2 md:space-y-3">
              <div className="flex justify-between text-xs md:text-sm">
                <span className="font-semibold text-gray-700 dark:text-gray-300">
                  Perusahaan:
                </span>
                <span className="text-gray-600 break-all dark:text-gray-400">
                  {userData.profile.company_name}
                </span>
              </div>
              <div className="flex justify-between text-xs md:text-sm">
                <span className="font-semibold text-gray-700 dark:text-gray-300">
                  Biodata Perusahaan:
                </span>
                <span className="text-gray-600 break-all dark:text-gray-400">
                  {userData.profile.biodata_company}
                </span>
              </div>
              <div className="flex justify-between text-xs md:text-sm">
                <span className="font-semibold text-gray-700 dark:text-gray-300">
                  Deskripsi Pekerjaan:
                </span>
                <span className="text-gray-600 break-all dark:text-gray-400">
                  {userData.profile.jobdesk}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfile;
