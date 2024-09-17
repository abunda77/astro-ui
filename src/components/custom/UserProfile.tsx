import React from "react";
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
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // Simulasi loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <Card className="max-w-4xl p-6 mx-auto rounded-lg shadow-lg bg-gradient-to-br from-blue-400 via-violet-400 to-purple-600 dark:from-gray-600 dark:to-gray-400">
        <CardHeader className="mb-6">
          <Skeleton className="w-48 h-8 mb-2 animate-pulse" />
          <Skeleton className="w-64 h-6 animate-pulse" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
            <Skeleton className="w-full h-8 mb-4 animate-pulse" />
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-4">
                <Skeleton className="w-full h-6 animate-pulse" />
              </div>
              <div className="space-y-4">
                <Skeleton className="w-full h-6 animate-pulse" />
              </div>
            </div>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
            <Skeleton className="w-full h-8 mb-4 animate-pulse" />
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex flex-col items-center">
                <Skeleton className="w-24 h-24 mb-4 rounded-full animate-pulse" />
                <Skeleton className="w-32 h-6 mb-2 animate-pulse" />
                <Skeleton className="w-40 h-6 mb-2 animate-pulse" />
                <Skeleton className="h-6 mb-2 w-36 animate-pulse" />
                <Skeleton className="h-6 w-44 animate-pulse" />
              </div>
              <div className="space-y-2">
                <Skeleton className="w-full h-6 animate-pulse" />
              </div>
            </div>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
            <Skeleton className="w-full h-8 mb-4 animate-pulse" />
            <div className="space-y-2">
              <Skeleton className="w-full h-6 animate-pulse" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-4xl p-6 mx-auto rounded-lg shadow-lg bg-gradient-to-br from-blue-400 via-violet-400 to-purple-600 dark:from-gray-600 dark:to-gray-400">
      <CardHeader className="mb-6">
        <CardTitle className="text-2xl font-bold text-white">
          Dashboard
        </CardTitle>
        <CardDescription className="text-xl font-semibold text-gray-200">
          Selamat datang kembali, {userData.name}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Informasi Pengguna */}
        <div className="p-6 bg-gray-200 rounded-lg shadow-md dark:bg-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Informasi Pengguna
            </h3>
            <Button
              variant="destructive"
              size="sm"
              className="text-white bg-red-600 hover:bg-red-700"
            >
              Edit
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-4">
              <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300">
                <span className="font-semibold">Email:</span>
                <span className="break-all">{userData.email}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300">
                <span className="font-semibold">Password:</span>
                <span>**********</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300">
                <span className="font-semibold">Peran:</span>
                <span>{userData.role}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-700 dark:text-gray-300">
                <span className="font-semibold">Status:</span>
                <Badge
                  className={userData.is_active ? "bg-green-500" : "bg-red-500"}
                >
                  {userData.is_active ? (
                    <span className="text-green-100 dark:text-green-400">
                      Aktif
                    </span>
                  ) : (
                    <span className="text-red-100 dark:text-red-400">
                      Tidak Aktif
                    </span>
                  )}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Profil */}
        <div className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Profil
            </h3>
            <Button
              variant="destructive"
              size="sm"
              className="text-white bg-red-600 hover:bg-red-700"
            >
              Edit
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col items-center">
              <Avatar className="w-24 h-24 mb-4">
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
                <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="text-center">
                <p className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                  <CircleUser className="w-4 h-4 mr-2" />
                  {userData.profile.first_name} {userData.profile.last_name}
                </p>
                <p className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                  <Phone className="w-4 h-4 mr-2" />
                  {userData.profile.phone}
                </p>
                <p className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                  <Mail className="w-4 h-4 mr-2" />
                  {userData.profile.email}
                </p>
                <p className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  {userData.profile.whatsapp}
                </p>
              </div>
            </div>

            {/* Company Section */}
          </div>
        </div>

        {/* Informasi Perusahaan */}
        <div className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Informasi Perusahaan
            </h3>
            <Button
              variant="destructive"
              size="sm"
              className="text-white bg-red-600 hover:bg-red-700"
            >
              Edit
            </Button>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <span className="font-semibold">Perusahaan:</span>{" "}
              {userData.profile.company_name}
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <span className="font-semibold">Biodata Perusahaan:</span>{" "}
              {userData.profile.biodata_company}
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <span className="font-semibold">Deskripsi Pekerjaan:</span>{" "}
              {userData.profile.jobdesk}
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end mt-6"></CardFooter>
    </Card>
  );
};

export default UserProfile;
