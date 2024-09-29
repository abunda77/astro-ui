import React, { useEffect, useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import RegionSelector from "./Region";
import { Skeleton } from "@/components/ui/skeleton";
import { DatePicker } from "rsuite";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@material-tailwind/react";
import { Loader2 } from "lucide-react";
import { Uploader, Button as RsuiteButton } from "rsuite";

interface UserProfile {
  user_id: number;
  title: "mr" | "mrs";
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
interface UserProfileProps {
  userProfile: UserProfile | null;
  isEditingProfile: boolean;
  editedProfile: UserProfile | null;
  handleEditProfile: () => void;
  handleSaveProfile: () => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRegionChange: (
    fieldName: string
  ) => (code: string, name: string) => void;
  cleanUrl: (url: string | null) => string;
  profileFetchCompleted: boolean;
  handleCancelEdit: () => void; // Tambahkan properti handleCancelEdit
  handleSaveAvatar: (file: File, remoteUrl: string) => Promise<void>;
}

const UserProfile: React.FC<UserProfileProps> = ({
  userProfile,
  isEditingProfile,
  editedProfile,
  handleEditProfile,
  handleSaveProfile,
  handleInputChange,
  handleRegionChange,
  cleanUrl,
  profileFetchCompleted,
  handleCancelEdit, // Tambahkan properti handleCancelEdit
}) => {
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [remoteUrl, setRemoteUrl] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        // Simulasikan pemuatan data
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setLoading(false);
      } catch (error) {
        console.error("Error memuat data profil:", error);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="p-4 rounded-lg shadow-md md:p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <Skeleton className="h-6 mb-2 w-36 md:w-48 md:h-8 animate-pulse" />
        <Skeleton className="w-48 h-4 md:w-64 md:h-6 animate-pulse" />
      </div>
    );
  }

  if (!userProfile || Object.keys(userProfile).length === 0) {
    return (
      <div className="flex items-center justify-center h-64 max-w-full p-4 rounded-lg shadow-lg md:p-6 bg-gradient-to-br from-blue-100 to-purple-200 dark:from-gray-800 dark:to-purple-900">
        <Button
          variant="outline"
          size="lg"
          className="text-white bg-blue-500 hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800"
        >
          Buat Profil Baru
        </Button>
      </div>
    );
  }

  {
    /* Save Avatar */
  }
  const handleSaveAvatar = async (file: File, remoteUrl: string) => {
    const formData = new FormData();
    formData.append("title", file.name);
    formData.append("remote_url", remoteUrl);
    formData.append("upload_url", file);

    try {
      console.log("Memulai proses unggah avatar");
      const res = await fetch(
        `${import.meta.env.PUBLIC_HOME_DOMAIN}/api/test-uploads`,
        {
          method: "POST",
          body: formData,
        }
      );
      console.log("Data yang dikirim:", Object.fromEntries(formData));
      if (!res.ok) {
        console.log("Respon server tidak berhasil: ");
        const errorData = await res.json();
        console.log("Data error:", errorData);
        throw new Error("Respon server tidak berhasil");
      }

      const data = await res.json();
      console.log("Data yang diterima:", JSON.stringify(data, null, 2));

      // Mengambil nilai dari key upload_url di dalam objek data
      const uploadUrl = data.data.upload_url;
      if (data && data.data && data.data.upload_url) {
        console.log("Upload URL ditemukan:", uploadUrl);
        handleInputChange({
          target: {
            name: "avatar",
            value: uploadUrl,
          },
        } as React.ChangeEvent<HTMLInputElement>);

        // Update state editedProfile jika diperlukan
        console.log("Avatar berhasil diperbarui");
      } else {
        console.log("Upload URL tidak ditemukan dalam data:", data);
        console.error("Struktur data tidak sesuai yang diharapkan:", data);
      }

      console.log("Avatar berhasil diperbarui");
    } catch (error) {
      console.error("Error mengunggah:", error);
    }
  };

  return (
    <>
      {userProfile && (
        <div className="p-4 rounded-lg shadow-md md:p-6 bg-gradient-to-br from-blue-100 to-purple-200 dark:from-gray-800 dark:to-purple-900 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <h3 className="text-base font-semibold text-blue-700 md:text-lg dark:text-blue-300">
              Profil
            </h3>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="text-xs text-white bg-blue-500 hover:text-gray-200 dark:text-gray-100 md:text-sm hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800"
                onClick={
                  isEditingProfile ? handleSaveProfile : handleEditProfile
                }
              >
                {isEditingProfile ? "Simpan" : "Edit"}
              </Button>
              {isEditingProfile && (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs text-white bg-red-500 hover:text-gray-200 dark:text-gray-100 md:text-sm hover:bg-red-600 dark:bg-red-700 dark:hover:bg-red-800"
                  onClick={handleCancelEdit}
                >
                  Clear
                </Button>
              )}
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-[0.5fr_1.25fr_1.25fr]">
            <div className="flex flex-col items-center">
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
              {isEditingProfile && (
                <div className="flex flex-col space-y-2">
                  <Input
                    type="file"
                    id="avatar"
                    name="avatar"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        await handleSaveAvatar(file, remoteUrl);
                      }
                    }}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                  {/* <Button
                    onClick={async () => {
                      if (file) {
                        await handleSaveAvatar(file, remoteUrl);
                      } else {
                        await handleSaveProfile();
                      }
                    }}
                    className="w-full"
                  >
                    Unggah Avatar
                  </Button> */}
                </div>
              )}
            </div>
            <div className="space-y-2 md:space-y-3">
              {isEditingProfile ? (
                <>
                  {/* <Input
                    name="avatar"
                    value={editedProfile?.avatar || ""}
                    // onChange={handleInputChange}
                    // readOnly
                  /> */}
                  {/* <Input
                    name="remote_url"
                    value={editedProfile?.remote_url || ""}
                    onChange={handleInputChange}
                    readOnly
                  /> */}
                  <div className="flex flex-col space-y-1">
                    <label
                      htmlFor="title"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Gelar
                    </label>
                    <Select
                      value={editedProfile?.title || ""}
                      onValueChange={(value) =>
                        handleInputChange({
                          target: { name: "title", value },
                        } as React.ChangeEvent<HTMLInputElement>)
                      }
                    >
                      <SelectTrigger className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        <SelectValue placeholder="Pilih Gelar" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Pilih Gelar</SelectLabel>
                          <SelectItem value="mr">Sdr.</SelectItem>
                          <SelectItem value="mrs">Sdri.</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <ProfileInput
                    label="Nama Depan"
                    name="first_name"
                    value={editedProfile?.first_name || ""}
                    onChange={handleInputChange}
                  />
                  <ProfileInput
                    label="Nama Belakang"
                    name="last_name"
                    value={editedProfile?.last_name || ""}
                    onChange={handleInputChange}
                  />
                  <ProfileInput
                    label="Telepon"
                    name="phone"
                    value={editedProfile?.phone || ""}
                    onChange={handleInputChange}
                  />
                  <ProfileInput
                    label="Email"
                    name="email"
                    value={editedProfile?.email || ""}
                    onChange={handleInputChange}
                  />
                  <ProfileInput
                    label="WhatsApp"
                    name="whatsapp"
                    value={editedProfile?.whatsapp || ""}
                    onChange={handleInputChange}
                  />
                  <ProfileInput
                    label="Alamat"
                    name="address"
                    value={editedProfile?.address || ""}
                    onChange={handleInputChange}
                  />

                  <DatePicker
                    format="yyyy-MM-dd HH:mm:ss"
                    value={
                      editedProfile?.birthday
                        ? new Date(editedProfile.birthday)
                        : null
                    }
                    onChange={(value) =>
                      handleInputChange({
                        target: {
                          name: "birthday",
                          value: value ? value.toISOString() : "",
                        },
                      } as React.ChangeEvent<HTMLInputElement>)
                    }
                  />

                  <Select
                    value={editedProfile?.gender || ""}
                    onValueChange={(value) =>
                      handleInputChange({
                        target: { name: "gender", value },
                      } as React.ChangeEvent<HTMLInputElement>)
                    }
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Pilih Jenis Kelamin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Jenis Kelamin</SelectLabel>
                        <SelectItem value="man">Laki-laki</SelectItem>
                        <SelectItem value="woman">Perempuan</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <ProfileInput
                    label="Perusahaan"
                    name="company_name"
                    value={editedProfile?.company_name || ""}
                    onChange={handleInputChange}
                  />
                  <ProfileInput
                    label="Biodata Perusahaan"
                    name="biodata_company"
                    value={editedProfile?.biodata_company || ""}
                    onChange={handleInputChange}
                  />
                  <ProfileInput
                    label="Deskripsi Pekerjaan"
                    name="jobdesk"
                    value={editedProfile?.jobdesk || ""}
                    onChange={handleInputChange}
                  />

                  <RegionSelector
                    selectedProvince={editedProfile?.province?.code || ""}
                    selectedDistrict={editedProfile?.district?.code || ""}
                    selectedCity={editedProfile?.city?.code || ""}
                    selectedVillage={editedProfile?.village?.code || ""}
                    onProvinceChange={handleRegionChange("province")}
                    onDistrictChange={handleRegionChange("district")}
                    onCityChange={handleRegionChange("city")}
                    onVillageChange={handleRegionChange("village")}
                  />
                </>
              ) : (
                <>
                  <ProfileField
                    label="Nama"
                    value={`${userProfile.title === "mr" ? "Sdr." : userProfile.title === "mrs" ? "Sdri." : ""} ${userProfile.first_name || ""} ${userProfile.last_name || ""}`}
                  />
                  <ProfileField label="Telepon" value={userProfile.phone} />
                  <ProfileField label="Email" value={userProfile.email} />
                  <ProfileField label="WhatsApp" value={userProfile.whatsapp} />
                  <ProfileField label="Alamat" value={userProfile.address} />
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
                </>
              )}
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
      )}
    </>
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

interface ProfileInputProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
const ProfileInput: React.FC<ProfileInputProps> = ({
  label,
  name,
  value,
  onChange,
}) => (
  <div className="flex flex-col space-y-1">
    <label
      htmlFor={name}
      className="text-sm font-medium text-gray-700 dark:text-gray-300"
    >
      {label}
    </label>
    <Input
      type="text"
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
    />
  </div>
);
export default UserProfile;
