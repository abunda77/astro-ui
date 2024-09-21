import React from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface ProfileDetailProps {
  userData: {
    name: string;
    profile: {
      avatar: string | null;
      remote_url: string | null;
      first_name: string | null;
      last_name: string | null;
      phone: string | null;
      email: string | null;
      whatsapp: string | null;
      address: string | null;
      gender: "man" | "woman" | null;
      birthday: string | null;
      company_name: string | null;
      biodata_company: string | null;
      jobdesk: string | null;
      province: { name: string } | null;
      district: { name: string } | null;
      city: { name: string } | null;
      village: { name: string } | null;
      social_media: {
        [key: string]: string | null;
      } | null;
    };
  };
  homedomain: string;
}

const ProfileDetail: React.FC<ProfileDetailProps> = ({
  userData,
  homedomain,
}) => {
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
          <ProfileField
            label="Nama"
            value={`${userData.profile.first_name} ${userData.profile.last_name}`}
          />
          <ProfileField label="Telepon" value={userData.profile.phone} />
          <ProfileField label="Email" value={userData.profile.email} />
          <ProfileField label="WhatsApp" value={userData.profile.whatsapp} />
          <ProfileField label="Alamat" value={userData.profile.address} />
          <ProfileField
            label="Jenis Kelamin"
            value={
              userData.profile.gender === "man"
                ? "Laki-laki"
                : userData.profile.gender === "woman"
                  ? "Perempuan"
                  : "-"
            }
          />
          <ProfileField
            label="Tanggal Lahir"
            value={userData.profile.birthday || "-"}
          />
        </div>
        <div className="space-y-2 md:space-y-3">
          <ProfileField
            label="Perusahaan"
            value={userData.profile.company_name}
          />
          <ProfileField
            label="Biodata Perusahaan"
            value={userData.profile.biodata_company}
          />
          <ProfileField
            label="Deskripsi Pekerjaan"
            value={userData.profile.jobdesk}
          />
          <ProfileField
            label="Provinsi"
            value={userData.profile.province?.name || "-"}
          />
          <ProfileField
            label="Kabupaten"
            value={userData.profile.district?.name || "-"}
          />
          <ProfileField
            label="Kota"
            value={userData.profile.city?.name || "-"}
          />
          <ProfileField
            label="Desa"
            value={userData.profile.village?.name || "-"}
          />
          <div className="space-y-2 md:space-y-3">
            <span className="font-semibold text-gray-700 dark:text-gray-300">
              Media Sosial:
            </span>
            {userData.profile.social_media ? (
              Object.entries(userData.profile.social_media).map(
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
