import React, { useEffect, useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import RegionSelector from "./Region";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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
import { getAccessToken, getUserId } from "@/utils/auth";

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
  handleCancelEdit: () => void;
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
  handleCancelEdit,
}) => {
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [remoteUrl, setRemoteUrl] = useState("");
  const [isCreatingProfile, setIsCreatingProfile] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [alertInfo, setAlertInfo] = useState({ type: "", message: "" });

  const initialProfileState: UserProfile = {
    user_id: getUserId() || 0,
    title: "mr",
    first_name: null,
    last_name: null,
    email: null,
    phone: null,
    whatsapp: null,
    address: null,
    province_id: null,
    district_id: null,
    city_id: null,
    village_id: null,
    gender: null,
    birthday: null,
    avatar: null,
    remote_url: null,
    company_name: null,
    biodata_company: null,
    jobdesk: null,
    social_media: null,
    id: 0,
    province: null,
    district: null,
    city: null,
    village: null,
  };

  const [newProfile, setNewProfile] =
    useState<UserProfile>(initialProfileState);

  useEffect(() => {
    const loadData = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setLoading(false);
      } catch (error) {
        console.error("Error loading profile data:", error);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleCreateProfile = () => {
    setIsCreatingProfile(true);
    console.log("Starting new profile creation");
  };

  const handleNewProfileInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewProfile((prev) => ({ ...prev, [name]: value }));
    console.log(`New profile input changed: ${name} = ${value}`);
  };

  const handleNewProfileRegionChange =
    (fieldName: string) => (code: string, name: string) => {
      setNewProfile((prev) => ({
        ...prev,
        [`${fieldName}_id`]: code,
        [fieldName]: { code, name, level: "" },
      }));
      console.log(
        `New profile region changed: ${fieldName} = ${code}, ${name}`
      );
    };

  const refreshBrowser = () => {
    setIsSaving(true);
    setTimeout(() => {
      window.location.reload();
      setIsSaving(false);
    }, 2000);
  };

  const handleNewProfileSave = async () => {
    try {
      console.log("Memulai penyimpanan profil baru");
      const token = getAccessToken();
      const userId = getUserId();
      console.log("Token yang digunakan:", token);
      console.log("ID Pengguna yang digunakan:", userId);

      const response = await fetch(
        `${import.meta.env.PUBLIC_FASTAPI_ENDPOINT}/profile`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ ...newProfile, user_id: userId }),
        }
      );

      if (!response.ok) {
        throw new Error("Gagal menyimpan profil baru");
      }

      const savedProfile = await response.json();
      console.log("Profil baru berhasil disimpan:", savedProfile);

      setAlertInfo({
        type: "success",
        message: "Profil berhasil disimpan",
      });

      setIsCreatingProfile(false);
      setNewProfile(initialProfileState);
      console.log("State direset setelah penyimpanan");

      if (savedProfile) {
        userProfile = savedProfile;
        console.log("Profil pengguna diperbarui:", userProfile);
        setShowSuccessAlert(true);
        setTimeout(() => setShowSuccessAlert(false), 1000);
        refreshBrowser();
      }
    } catch (error) {
      console.error("Kesalahan saat menyimpan profil baru:", error);
      setAlertInfo({
        type: "error",
        message: "Gagal membuat profil. Silakan coba lagi!",
      });
    } finally {
      console.log("Status profil baru:", newProfile);
      console.log("Status profil pengguna:", userProfile);
      console.log("Status pembuatan profil:", isCreatingProfile);
    }
  };

  const handleSaveAvatar = async (file: File, remoteUrl: string) => {
    const formData = new FormData();
    formData.append("title", file.name);
    formData.append("remote_url", remoteUrl);
    formData.append("upload_url", file);

    try {
      console.log("Starting avatar upload");
      const res = await fetch(
        `${import.meta.env.PUBLIC_HOME_DOMAIN}/api/test-uploads`,
        {
          method: "POST",
          body: formData,
        }
      );
      console.log("Data sent:", Object.fromEntries(formData));
      if (!res.ok) {
        console.log("Unsuccessful server response");
        const errorData = await res.json();
        console.log("Error data:", errorData);
        throw new Error("Unsuccessful server response");
      }

      const data = await res.json();
      console.log("Data received:", JSON.stringify(data, null, 2));

      const uploadUrl = data.data.upload_url;
      if (uploadUrl) {
        console.log("Upload URL found:", uploadUrl);
        handleInputChange({
          target: {
            name: "avatar",
            value: uploadUrl,
          },
        } as React.ChangeEvent<HTMLInputElement>);

        console.log("Avatar updated successfully");
      } else {
        console.log("Upload URL not found in data:", data);
        console.error("Unexpected data structure:", data);
      }
    } catch (error) {
      console.error("Error uploading avatar:", error);
    }
  };

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
      <Card className="w-full max-w-4xl mx-auto shadow-xl bg-gradient-to-br from-blue-100 to-purple-200 dark:from-gray-600 dark:to-purple-900 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-blue-600 dark:text-blue-400">
            Buat Profil Baru
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {showSuccessAlert && (
            <Alert className="mb-4">
              <AlertTitle>Sukses!</AlertTitle>
              <AlertDescription>
                Profil baru berhasil disimpan.
              </AlertDescription>
            </Alert>
          )}
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="first_name"
                className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Nama Depan
              </label>
              <Input
                id="first_name"
                name="first_name"
                placeholder="Nama Depan"
                value={newProfile.first_name || ""}
                onChange={handleNewProfileInputChange}
                required
              />
            </div>
            <div>
              <label
                htmlFor="last_name"
                className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Nama Belakang
              </label>
              <Input
                id="last_name"
                name="last_name"
                placeholder="Nama Belakang"
                value={newProfile.last_name || ""}
                onChange={handleNewProfileInputChange}
                required
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="gender"
                className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Jenis Kelamin
              </label>
              <Select
                onValueChange={(value) =>
                  setNewProfile((prev) => ({
                    ...prev,
                    gender: value as "man" | "woman",
                  }))
                }
                required
              >
                <SelectTrigger id="gender">
                  <SelectValue placeholder="Pilih Jenis Kelamin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="man">Laki-laki</SelectItem>
                  <SelectItem value="woman">Perempuan</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label
                htmlFor="whatsapp"
                className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Nomor WhatsApp
              </label>
              <Input
                id="whatsapp"
                name="whatsapp"
                placeholder="e.g., +62 123-456-7890"
                pattern="^\+\d{1,3}\s\d{1,4}-\d{1,4}-\d{4}$"
                value={newProfile.whatsapp || ""}
                className="appearance-none !border-t-red-500 placeholder:text-red-300 placeholder:opacity-100 focus:!border-t-red-500 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                onChange={handleNewProfileInputChange}
                required
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Email
              </label>
              <Input
                id="email"
                name="email"
                placeholder="Email"
                type="email"
                value={newProfile.email || ""}
                onChange={handleNewProfileInputChange}
                required
              />
            </div>
            <div>
              <label
                htmlFor="phone"
                className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Nomor Telepon
              </label>
              <Input
                id="phone"
                name="phone"
                placeholder="e.g., +62 123-456-7890"
                pattern="^\+\d{1,3}\s\d{1,4}-\d{1,4}-\d{4}$"
                // placeholder="Nomor Telepon"
                className="appearance-none !border-t-red-500 placeholder:text-red-300 placeholder:opacity-100 focus:!border-t-red-500 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                value={newProfile.phone || ""}
                onChange={handleNewProfileInputChange}
                required
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="address"
                className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Alamat
              </label>
              <Textarea
                id="address"
                name="address"
                placeholder="Alamat"
                value={newProfile.address || ""}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  handleNewProfileInputChange(e)
                }
              />
            </div>
            <div>
              <RegionSelector
                selectedProvince={newProfile.province?.code || ""}
                selectedDistrict={newProfile.district?.code || ""}
                selectedCity={newProfile.city?.code || ""}
                selectedVillage={newProfile.village?.code || ""}
                onProvinceChange={handleNewProfileRegionChange("province")}
                onDistrictChange={handleNewProfileRegionChange("district")}
                onCityChange={handleNewProfileRegionChange("city")}
                onVillageChange={handleNewProfileRegionChange("village")}
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="birthday"
                className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Tanggal Lahir
              </label>
              <Input
                id="birthday"
                name="birthday"
                type="date"
                placeholder="Tanggal Lahir"
                value={newProfile.birthday || ""}
                onChange={handleNewProfileInputChange}
              />
            </div>
            <div>
              <label
                htmlFor="company_name"
                className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Nama Perusahaan
              </label>
              <Input
                id="company_name"
                name="company_name"
                placeholder="Nama Perusahaan"
                value={newProfile.company_name || ""}
                onChange={handleNewProfileInputChange}
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="biodata_company"
                className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Biodata Perusahaan
              </label>
              <Input
                id="biodata_company"
                name="biodata_company"
                placeholder="Biodata Perusahaan"
                value={newProfile.biodata_company || ""}
                onChange={handleNewProfileInputChange}
              />
            </div>
            <div>
              <label
                htmlFor="jobdesk"
                className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Jobdesk
              </label>
              <Input
                id="jobdesk"
                name="jobdesk"
                placeholder="Jobdesk"
                value={newProfile.jobdesk || ""}
                onChange={handleNewProfileInputChange}
              />
            </div>
          </div>

          <div className="flex flex-col space-y-2">
            <Button
              onClick={() => {
                handleNewProfileSave();
                // refreshBrowser();
              }}
              className="w-full px-4 py-2 font-bold text-white transition duration-300 bg-blue-500 rounded hover:bg-blue-600"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                "Simpan Profil"
              )}
            </Button>
            <Button
              onClick={() => setNewProfile(initialProfileState)}
              className="w-full px-4 py-2 font-bold text-blue-500 transition duration-300 bg-white border border-blue-500 rounded hover:bg-blue-100"
            >
              Reset Input
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

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
                </div>
              )}
            </div>
            <div className="space-y-2 md:space-y-3">
              {isEditingProfile ? (
                <>
                  <ProfileSelect
                    label="Gelar"
                    name="title"
                    value={editedProfile?.title || ""}
                    onChange={(value) =>
                      handleInputChange({
                        target: {
                          name: "title",
                          value: value,
                        },
                      } as React.ChangeEvent<HTMLInputElement>)
                    }
                    options={[
                      { value: "mr", label: "Tuan" },
                      { value: "mrs", label: "Nyonya" },
                    ]}
                  />
                  <ProfileInput
                    type="text"
                    label="Nama Depan"
                    name="first_name"
                    value={editedProfile?.first_name || ""}
                    onChange={handleInputChange}
                  />
                  <ProfileInput
                    type="text"
                    label="Nama Belakang"
                    name="last_name"
                    value={editedProfile?.last_name || ""}
                    onChange={handleInputChange}
                  />
                  <ProfileInput
                    type="text"
                    label="Telepon"
                    name="phone"
                    value={editedProfile?.phone || ""}
                    onChange={handleInputChange}
                  />
                  <ProfileInput
                    type="text"
                    label="Email"
                    name="email"
                    value={editedProfile?.email || ""}
                    onChange={handleInputChange}
                  />
                  <ProfileInput
                    type="text"
                    label="WhatsApp"
                    name="whatsapp"
                    value={editedProfile?.whatsapp || ""}
                    onChange={handleInputChange}
                  />
                  <ProfileInput
                    type="text"
                    label="Alamat"
                    name="address"
                    value={editedProfile?.address || ""}
                    onChange={handleInputChange}
                  />

                  <ProfileInput
                    label="Tanggal Lahir"
                    name="birthday"
                    type="date"
                    value={editedProfile?.birthday || ""}
                    onChange={handleInputChange}
                  />

                  <ProfileSelect
                    label="Jenis Kelamin"
                    name="gender"
                    value={editedProfile?.gender || ""}
                    onChange={(value: string) =>
                      handleInputChange({
                        target: { name: "gender", value },
                      } as React.ChangeEvent<HTMLInputElement>)
                    }
                    options={[
                      { value: "man", label: "Laki-laki" },
                      { value: "woman", label: "Perempuan" },
                    ]}
                  />
                  <ProfileInput
                    label="Perusahaan"
                    type="text"
                    name="company_name"
                    value={editedProfile?.company_name || ""}
                    onChange={handleInputChange}
                  />
                  <ProfileInput
                    label="Biodata Perusahaan"
                    type="text"
                    name="biodata_company"
                    value={editedProfile?.biodata_company || ""}
                    onChange={handleInputChange}
                  />
                  <ProfileInput
                    type="text"
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
  type: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
const ProfileInput: React.FC<ProfileInputProps> = ({
  label,
  name,
  value,
  type,
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
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
    />
  </div>
);

interface ProfileSelectProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}

const ProfileSelect: React.FC<ProfileSelectProps> = ({
  label,
  name,
  value,
  onChange,
  options,
}) => (
  <div className="flex flex-col space-y-1">
    <label
      htmlFor={name}
      className="text-sm font-medium text-gray-700 dark:text-gray-300"
    >
      {label}
    </label>
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
        <SelectValue placeholder={`Pilih ${label}`} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  </div>
);

export default UserProfile;
