import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, EyeOff, Eye } from "lucide-react";

interface UserCredentialProps {
  userData: any;
  isEditing: boolean;
  showCurrentPassword: boolean;
  showNewPassword: boolean;
  currentPassword: string;
  newPassword: string;
  passwordError: string | null;
  isSaving: boolean;
  setIsEditing: (isEditing: boolean) => void;
  setCurrentPassword: (password: string) => void;
  setNewPassword: (password: string) => void;
  setShowCurrentPassword: (show: boolean) => void;
  setShowNewPassword: (show: boolean) => void;
  handleSave: () => void;
  handleCancel: () => void;
}

const UserCredential: React.FC<UserCredentialProps> = ({
  userData,
  isEditing,
  showCurrentPassword,
  showNewPassword,
  currentPassword,
  newPassword,
  passwordError,
  isSaving,
  setIsEditing,
  setCurrentPassword,
  setNewPassword,
  setShowCurrentPassword,
  setShowNewPassword,
  handleSave,
  handleCancel,
}) => {
  return (
    <div className="p-4 rounded-lg shadow-md md:p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-3 md:mb-4">
        <h3 className="text-base font-semibold text-blue-700 md:text-lg dark:text-blue-300">
          Informasi Pengguna
        </h3>
        <Button
          variant="outline"
          size="sm"
          className="text-xs text-white bg-blue-500 hover:text-gray-200 dark:text-gray-100 md:text-sm hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800"
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
              {userData?.email}
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
                    type={showCurrentPassword ? "text" : "password"}
                    className="pr-10 bg-gray-300"
                    placeholder="Kata sandi saat ini"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 mt-6"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
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
                    className="pr-10 bg-gray-300"
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
                    className="text-xs text-white bg-blue-500 hover:text-gray-200 dark:text-gray-100 md:text-sm hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800"
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
              variant={userData?.is_active ? "default" : "secondary"}
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
  );
};

export default UserCredential;
