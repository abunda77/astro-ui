import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
// import RegionSelector from "./Region";
import { getAccessToken, getUserId } from "@/utils/auth";

const FASTAPI_LOGIN = import.meta.env.PUBLIC_FASTAPI_ENDPOINT;

interface ProfileDetailProps {
  userData: {
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
  homedomain: string;
}

const ProfileDetail: React.FC<ProfileDetailProps> = ({
  userData,
  homedomain,
}) => {
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = getAccessToken();
        const userId = getUserId();
        if (!token || !userId) {
          console.error("Token atau User ID tidak tersedia");
          return;
        }

        const url = `${FASTAPI_LOGIN}/profile/${userId}`;
        console.log("Fetching user profile from URL:", url);
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Data Profile Detail pengguna yang diambil:", data);
        setUserProfile(data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  return (
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
                userData.avatar
                  ? `${homedomain}/storage/${userData.avatar}`
                  : userData.remote_url
                    ? userData.remote_url
                    : "images/avatar-fallback.gif"
              }
              alt={`${userData.first_name} ${userData.last_name}`}
            />
            <AvatarFallback className="text-blue-700 bg-blue-200 dark:bg-blue-700 dark:text-blue-200">
              {userData.first_name?.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="space-y-2 md:space-y-3">
          <ProfileField
            label="Nama"
            value={`${userData.first_name} ${userData.last_name}`}
          />
          <ProfileField label="Telepon" value={userData.phone} />
          <ProfileField label="Email" value={userData.email} />
          <ProfileField label="WhatsApp" value={userData.whatsapp} />
          <ProfileField label="Alamat" value={userData.address} />
          <ProfileField
            label="Jenis Kelamin"
            value={
              userData.gender === "man"
                ? "Laki-laki"
                : userData.gender === "woman"
                  ? "Perempuan"
                  : "-"
            }
          />
          <ProfileField
            label="Tanggal Lahir"
            value={userData.birthday || "-"}
          />
        </div>
        <div className="space-y-2 md:space-y-3">
          <ProfileField label="Perusahaan" value={userData.company_name} />
          <ProfileField
            label="Biodata Perusahaan"
            value={userData.biodata_company}
          />
          <ProfileField label="Deskripsi Pekerjaan" value={userData.jobdesk} />
          <ProfileField
            label="Provinsi"
            value={userData.province?.name || "-"}
          />
          <ProfileField
            label="Kabupaten"
            value={userData.district?.name || "-"}
          />
          <ProfileField label="Kota" value={userData.city?.name || "-"} />
          <ProfileField label="Desa" value={userData.village?.name || "-"} />
          <div className="space-y-2 md:space-y-3">
            <span className="font-semibold text-gray-700 dark:text-gray-300">
              Media Sosial:
            </span>
            {userData.social_media ? (
              Object.entries(userData.social_media).map(
                ([platform, link]) =>
                  link && (
                    <div
                      key={platform}
                      className="flex justify-between text-xs md:text-sm"
                    >
                      <span className="font-semibold text-gray-700 dark:text-gray-300">
                        {platform.charAt(0).toUpperCase() + platform.slice(1)}:
                      </span>
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline dark:text-blue-400"
                      >
                        {link}
                      </a>
                    </div>
                  )
              )
            ) : (
              <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                Tidak ada data media sosial
              </div>
            )}
          </div>
        </div>
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

export default ProfileDetail;
