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
import { Loader2, CircleUser, Package } from "lucide-react";
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

import UserProfile from "./UserProfile";
import PropertyList02 from "./PropertyList";

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
}

interface User {
  name: string;
  email: string;
  password: string;
  role: string;
  is_active: boolean;
  profile: UserProfile;
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

const Dashboard: React.FC<DashboardProps> = ({ accessToken, userId }) => {
  const { toast } = useToast();
  const [username, setUsername] = useState<string>("");
  const [tokenFromCookie, setTokenFromCookie] = useState<string | null>(null);
  const [userIdFromCookie, setUserIdFromCookie] = useState<string | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [properties, setProperties] = useState<{
    items: PropertyList[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"profile" | "properties">(
    "profile"
  );

  console.log("Dash Username:", username);
  console.log("Dash Token dari Cookie:", tokenFromCookie);
  console.log("Dash User ID dari Cookie:", userIdFromCookie);

  useEffect(() => {
    const initializeAuth = () => {
      const accessTokenFromCookie = getCookie("access_token");
      const userIdFromCookie = getCookie("user_id");

      if (accessTokenFromCookie && userIdFromCookie) {
        setTokenFromCookie(accessTokenFromCookie);
        setUserIdFromCookie(userIdFromCookie);
        setUsername(getUsername() || "User");
        fetchUserData(userIdFromCookie, accessTokenFromCookie);
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
      console.log("Data pengguna yang diambil:", data);
      setUserData(data);
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
      console.log("Fetching properties from URL:", url); // Log tambahan
      const response = await fetch(url, {
        headers: {
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

  const handleLogout = () => {
    // Hapus cookies
    document.cookie =
      "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    document.cookie =
      "user_id=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    document.cookie =
      "username=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";

    // Reset state
    setUsername("");
    setTokenFromCookie(null);
    setUserIdFromCookie(null);

    // Tampilkan toast berhasil logout
    toast({
      title: "Logout Successful",
      variant: "warning",
      description: `Good bye, ${username}!`,
    });

    // Redirect setelah logout
    setTimeout(() => {
      window.location.href = "/";
    }, 2000);
  };

  return (
    <div className="container p-4 mx-auto">
      <div className="flex justify-start mt-6 mb-10 space-x-4">
        {/* <Button
          onClick={handleLogout}
          variant="destructive"
          className="text-white bg-red-600 hover:bg-red-700"
        >
          Logout
        </Button> */}

        {/* Breadcrumb */}
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
      {/* Side Menu */}
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
              {userData && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg md:text-xl lg:text-2xl">
                      Profil Pengguna
                    </CardTitle>
                    <CardDescription className="text-sm md:text-base">
                      Informasi profil Anda
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <UserProfile userData={userData} homedomain={homedomain} />
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

export default Dashboard;
