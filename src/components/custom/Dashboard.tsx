import React, { useEffect, useState } from "react";
import "@/styles/globals.css";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  isAuthenticated,
  getUsername,
  removeCookie,
  getAccessToken,
  getUserId,
  setAccessToken,
  setUserId,
  getCookie,
} from "@/utils/auth";
import {
  Loader2,
  CircleUser,
  Package,
  Mail,
  Phone,
  MessageCircle,
  EyeOff,
  Eye,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import PropertyList02 from "./PropertyList";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import RefreshBrowser from "./RefreshBrowser";
import { Loader, Placeholder } from "rsuite";

const FASTAPI_LOGIN = import.meta.env.PUBLIC_FASTAPI_ENDPOINT;
const homedomain = import.meta.env.PUBLIC_HOME_DOMAIN;

interface UserProfile {
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
  social_media: string | null;
  // social_media: {
  //   facebook: string | null;
  //   twitter: string | null;
  //   instagram: string | null;
  //   linkedin: string | null;
  //   youtube: string | null;
  //   tiktok: string | null;
  //   snapchat: string | null;
  //   pinterest: string | null;
  //   reddit: string | null;
  //   zoom: string | null;
  // };
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
}

interface PropertyList {
  user_id: number | null;
  category_id: number | null;
  title: string | null;
  short_desc: string | null;
  description: string | null;
  price: number | null;
  period: string | null;
  address: string | null;
  province_id: string | null;
  district_id: string | null;
  city_id: string | null;
  village_id: string | null;
  coordinates: string | null;
  nearby: string | null;
  ads: string | null;
  status: string | null;
  views_count: number | null;
  meta_title: string | null;
  meta_description: string | null;
  keywords: string | null;
  id: number | null;
  created_at: string | null;
  updated_at: string | null;
  facility: {
    certificate: string | null;
    electricity: number | null;
    line_phone: string | null;
    internet: string | null;
    road_width: string | null;
    water_source: string | null;
    hook: string | null;
    condition: string | null;
    security: string | null;
    wastafel: string | null;
    id: number;
  };
  specification: {
    land_size: number | null;
    building_size: number | null;
    bedroom: number | null;
    carport: string | null;
    bathroom: number | null;
    dining_room: string | null;
    living_room: string | null;
    floors: number | null;
    id: number;
  };
  images: {
    image_url: string;
    remote_image_url: string | null;
    is_primary: boolean;
    id: number;
  }[];
  province: {
    code: string;
    name: string;
    level: string;
  };
  district: {
    code: string;
    name: string;
    level: string;
  };
  city: {
    code: string;
    name: string;
    level: string;
  };
  village: {
    code: string;
    name: string;
    level: string;
  };
}

interface DashboardProps {
  accessToken?: string;
  userId?: string;
}

interface User {
  name: string;
  email: string;
  password: string;
  role: string;
  is_active: boolean;
  profile: UserProfile;
}

const Dashboard: React.FC<DashboardProps> = ({ accessToken, userId }) => {
  const { toast } = useToast();
  const [username, setUsername] = useState<string>("");
  const [tokenFromCookie, setTokenFromCookie] = useState<string | null>(null);
  const [userIdFromCookie, setUserIdFromCookie] = useState<string | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [properties, setProperties] = useState<{
    items: PropertyList[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"profile" | "properties">(
    "profile"
  );
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
    const initializeAuth = () => {
      const accessTokenFromCookie = getCookie("access_token");
      const userIdFromCookie = getCookie("user_id");

      if (accessTokenFromCookie && userIdFromCookie) {
        setTokenFromCookie(accessTokenFromCookie);
        setUserIdFromCookie(userIdFromCookie);
        setUsername(getUsername() || "User");
        fetchUserData(userIdFromCookie, accessTokenFromCookie);
        fetchUserProfile(userIdFromCookie, accessTokenFromCookie);
        fetchProperties(accessTokenFromCookie, userIdFromCookie);
      } else {
        toast({
          title: "Peringatan",
          description: "Anda belum login!",
          duration: 3000,
        });
        setTimeout(() => {
          window.location.href = "/loginpage";
        }, 3000);
      }
    };

    initializeAuth();
  }, [toast]);

  const fetchUserData = async (userId: string, token: string) => {
    try {
      const response = await fetch(`${FASTAPI_LOGIN}/users/${userId}`, {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const data = await response.json();
      console.log("Data User yang diambil:", data);
      setUserData(data);
      setUserProfile(data.profile);
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast({
        title: "Error",
        description: "Gagal mengambil data pengguna",
        variant: "destructive",
      });
    }
  };

  const fetchProperties = async (token: string, userId: string) => {
    try {
      const url = `${FASTAPI_LOGIN}/properties/user/${userId}`;
      console.log("Fetching properties from URL:", url);
      const response = await fetch(url, {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Data properti yang diambil:", data);
      setProperties(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching properties:", error);
    }
  };

  const fetchUserProfile = async (token: string, userId: string) => {
    try {
      const url = `${FASTAPI_LOGIN}/profile/${token}`;
      console.log("Fetching user profile from URL:", url);
      console.log("Token untuk mengambil profil pengguna:", userId);
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${userId}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Data profil pengguna yang diambil:", data);
      setUserProfile(data);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const handleLogout = () => {
    document.cookie =
      "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    document.cookie =
      "user_id=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    document.cookie =
      "username=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";

    setUsername("");
    setTokenFromCookie(null);
    setUserIdFromCookie(null);

    toast({
      title: "Logout Successful",
      variant: "warning",
      description: `Good bye, ${username}!`,
    });

    setTimeout(() => {
      window.location.href = "/";
    }, 2000);
  };

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

  const cleanUrl = (url: string | null) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    if (url.startsWith("/")) return `${homedomain}/storage/${url}`;
    const cleanedUrl = `${homedomain}/storage/${url.replace(/[",/\\]/g, "")}`;
    console.log("URL gambar yang dibersihkan:", cleanedUrl);
    return cleanedUrl;
  };

  return (
    <div className="container p-4 mx-auto">
      <div className="flex justify-start mt-6 mb-10 space-x-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Beranda</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Dashboard</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="flex flex-col md:flex-row">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="flex flex-row w-full p-2 mt-2 space-x-2 overflow-x-auto bg-transparent rounded-lg md:p-4 md:mt-6 md:space-x-2 dark:bg-transparent md:overflow-x-visible">
            <TabsTrigger
              value="profile"
              className="flex items-center justify-start px-2 py-1 text-xs text-left text-gray-800 transition-colors duration-200 bg-white md:px-4 md:py-2 md:text-sm lg:text-base hover:bg-yellow-300 dark:hover:bg-yellow-700 dark:text-gray-200 dark:bg-gray-800 whitespace-nowrap"
            >
              <CircleUser className="w-4 h-4 mr-1 md:w-5 md:h-5 md:mr-3" />
              Profil Pengguna
            </TabsTrigger>
            <TabsTrigger
              value="properties"
              className="flex items-center justify-start px-2 py-1 text-xs text-left text-gray-800 transition-colors duration-200 bg-white md:px-4 md:py-2 md:text-sm lg:text-base hover:bg-yellow-300 dark:hover:bg-yellow-700 dark:text-gray-200 dark:bg-gray-800 whitespace-nowrap"
            >
              <Package className="w-4 h-4 mr-1 md:w-5 md:h-5 md:mr-3" />
              Daftar Properti
            </TabsTrigger>
          </TabsList>
          <div className="w-full mt-4">
            <TabsContent value="profile">
              {userProfile && (
                <Card className="max-w-full p-4 rounded-lg shadow-lg md:p-6 bg-gradient-to-br from-blue-100 to-purple-200 dark:from-gray-800 dark:to-purple-900">
                  <CardHeader className="mb-4 md:mb-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="text-xl font-bold text-blue-800 md:text-2xl dark:text-blue-300">
                          Profil Pengguna
                        </CardTitle>
                        <CardDescription className="text-lg font-semibold text-blue-700 md:text-xl dark:text-blue-300">
                          Selamat datang kembali, {userProfile.first_name}{" "}
                          {userProfile.last_name}
                        </CardDescription>
                      </div>
                      <RefreshBrowser className="text-xs md:text-sm" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 md:space-y-6">
                    {alertInfo && (
                      <Alert
                        variant={
                          alertInfo.type === "success"
                            ? "success"
                            : "destructive"
                        }
                      >
                        <Terminal className="w-4 h-4" />
                        <AlertTitle>
                          {alertInfo.type === "success"
                            ? "Berhasil!"
                            : "Kesalahan!"}
                        </AlertTitle>
                        <AlertDescription>{alertInfo.message}</AlertDescription>
                      </Alert>
                    )}
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
                              {userProfile.email}
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
                                    Password Saat Ini
                                  </label>
                                  <Input
                                    type={
                                      showCurrentPassword ? "text" : "password"
                                    }
                                    className="bg-gray-300 pr-10"
                                    placeholder="Kata sandi saat ini"
                                    value={currentPassword}
                                    onChange={(e) =>
                                      setCurrentPassword(e.target.value)
                                    }
                                  />
                                  <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 mt-6"
                                    onClick={() =>
                                      setShowCurrentPassword(
                                        !showCurrentPassword
                                      )
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
                                    onChange={(e) =>
                                      setNewPassword(e.target.value)
                                    }
                                  />
                                  <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 mt-6"
                                    onClick={() =>
                                      setShowNewPassword(!showNewPassword)
                                    }
                                  >
                                    {showNewPassword ? (
                                      <EyeOff className="w-5 h-5 text-gray-400" />
                                    ) : (
                                      <Eye className="w-5 h-5 text-gray-400" />
                                    )}
                                  </button>
                                </div>
                                {passwordError && (
                                  <p className="text-xs text-red-500">
                                    {passwordError}
                                  </p>
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
                              {userData?.role}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-xs md:text-sm">
                            <span className="font-semibold text-gray-700 dark:text-gray-300">
                              Status:
                            </span>
                            <Badge
                              variant={
                                userData?.is_active ? "default" : "secondary"
                              }
                              className={`text-xs md:text-sm ${
                                userData?.is_active
                                  ? "dark:text-white bg-green-500 dark:bg-green-700"
                                  : "bg-gray-500 dark:bg-gray-700"
                              }`}
                            >
                              {userData?.is_active ? "Aktif" : "Tidak Aktif"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-lg shadow-md md:p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                      <div className="flex items-center justify-between mb-3 md:mb-4">
                        <h3 className="text-base font-semibold text-blue-700 md:text-lg dark:text-blue-300">
                          Profil
                        </h3>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs text-white hover:text-gray-200 dark:text-gray-100 bg-blue-500 md:text-sm hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800"
                        >
                          Edit
                        </Button>
                      </div>
                      <div className="grid gap-4 md:grid-cols-[0.5fr_1.25fr_1.25fr]">
                        <div className="flex flex-col items-start">
                          <Avatar className="w-20 h-20 mb-3 md:w-24 md:h-24 md:mb-4 ring-2 ring-blue-300 dark:ring-blue-600">
                            <AvatarImage
                              src={cleanUrl(userProfile.avatar)}
                              alt={`${userProfile.first_name} ${userProfile.last_name}`}
                            />
                            <AvatarFallback className="text-blue-700 bg-blue-200 dark:bg-blue-700 dark:text-blue-200">
                              {userProfile.first_name
                                ? userProfile.first_name.charAt(0)
                                : "U"}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                        <div className="space-y-2 md:space-y-3">
                          <ProfileField
                            label="Nama"
                            value={`${userProfile.first_name || ""} ${userProfile.last_name || ""}`}
                          />
                          <ProfileField
                            label="Telepon"
                            value={userProfile.phone}
                          />
                          <ProfileField
                            label="Email"
                            value={userProfile.email}
                          />
                          <ProfileField
                            label="WhatsApp"
                            value={userProfile.whatsapp}
                          />
                          <ProfileField
                            label="Alamat"
                            value={userProfile.address}
                          />
                          <ProfileField
                            label="Jenis Kelamin"
                            value={
                              userProfile.gender === "man"
                                ? "Laki-laki"
                                : userProfile.gender === "woman"
                                  ? "Perempuan"
                                  : "-"
                            }
                          />
                          <ProfileField
                            label="Tanggal Lahir"
                            value={userProfile.birthday || "-"}
                          />
                        </div>
                        <div className="space-y-2 md:space-y-3">
                          <ProfileField
                            label="Perusahaan"
                            value={userProfile.company_name}
                          />
                          <ProfileField
                            label="Biodata Perusahaan"
                            value={userProfile.biodata_company}
                          />
                          <ProfileField
                            label="Deskripsi Pekerjaan"
                            value={userProfile.jobdesk}
                          />
                          <ProfileField
                            label="Provinsi"
                            value={userProfile.province?.name || "-"}
                          />
                          <ProfileField
                            label="Kabupaten"
                            value={userProfile.district?.name || "-"}
                          />
                          <ProfileField
                            label="Kota"
                            value={userProfile.city?.name || "-"}
                          />
                          <ProfileField
                            label="Desa"
                            value={userProfile.village?.name || "-"}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            <TabsContent value="properties">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg md:text-xl lg:text-2xl">
                    Daftar Properti
                  </CardTitle>
                  <CardDescription className="text-sm md:text-base">
                    Properti yang Anda miliki
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PropertyList02
                    properties={properties?.items || null}
                    isLoading={isLoading}
                    homedomain={homedomain}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

interface ProfileFieldProps {
  label: string;
  value: string | null | undefined;
}
const ProfileField: React.FC<ProfileFieldProps> = ({ label, value }) => (
  <div className="flex justify-between text-xs md:text-sm">
    <span className="font-semibold text-gray-700 dark:text-gray-300">
      {label}:
    </span>
    <span className="text-gray-600 break-all dark:text-gray-400">
      {value || "-"}
    </span>
  </div>
);
export default Dashboard;
