import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import PropertyList from "@/components/custom/PropertyList";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircledIcon, CrossCircledIcon } from "@radix-ui/react-icons";
import { Loader2 } from "lucide-react";
import RegionSelector from "@/components/custom/Region";

interface ProfileInputProps {
  label: string;
  name: string;
  value: string;
  type: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

const ProfileInput: React.FC<ProfileInputProps> = ({
  label,
  name,
  value,
  type,
  onChange,
  placeholder,
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
      placeholder={placeholder}
      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
    />
  </div>
);

interface EditPropertiProps {
  property: PropertyList;
  onSave: (updatedProperty: Partial<PropertyList>) => Promise<void>;
  onClose: () => void;
}

const EditProperti: React.FC<EditPropertiProps> = ({
  property,
  onSave,
  onClose,
}) => {
  const [editedProperty, setEditedProperty] =
    useState<Partial<PropertyList>>(property);
  const [alertStatus, setAlertStatus] = useState<"success" | "error" | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setEditedProperty((prev: Partial<PropertyList>) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSave(editedProperty);
      setAlertStatus("success");
      // Refresh Drawer content
      setEditedProperty({ ...editedProperty });
    } catch (error) {
      setAlertStatus("error");
    } finally {
      setIsLoading(false);
    }
  };

  const categories = [
    { key: 11, value: "Home" },
    { key: 12, value: "Apartment" },
    { key: 13, value: "Kavling" },
    { key: 14, value: "Office" },
    { key: 15, value: "Warehouse" },
  ];
  const ads = [
    { key: "sell", value: "Dijual" },
    { key: "rent", value: "Disewakan" },
  ];

  const status = [
    { key: "active", value: "Aktif" },
    { key: "sold", value: "Terjual" },
    { key: "rented", value: "Disewakan" },
    { key: "inactive", value: "Tidak Aktif" },
  ];

  interface SelectInputProps {
    label: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    options: { key: string | number; value: string }[];
    placeholder?: string;
  }

  const SelectInput: React.FC<SelectInputProps> = ({
    label,
    name,
    value,
    onChange,
    options,
    placeholder,
  }) => (
    <div className="flex flex-col space-y-1">
      <label
        htmlFor={name}
        className="text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        {label}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.key.toString()} value={option.key.toString()}>
            {option.value}
          </option>
        ))}
      </select>
    </div>
  );

  const periods = [
    { key: "onetime", value: "Sekali" },
    { key: "monthly", value: "Bulanan" },
    { key: "yearly", value: "Tahunan" },
    { key: "weekly", value: "Mingguan" },
  ];

  const handleRegionChange = (level: string, code: string, name: string) => {
    setEditedProperty((prev) => ({
      ...prev,
      [`${level}_id`]: code,
      [`${level}_name`]: name,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {alertStatus === "success" && (
        <Alert variant="success">
          <CheckCircledIcon className="w-4 h-4" />
          <AlertTitle>Berhasil!</AlertTitle>
          <AlertDescription>
            Perubahan properti berhasil disimpan.
          </AlertDescription>
        </Alert>
      )}
      {alertStatus === "error" && (
        <Alert variant="destructive">
          <CrossCircledIcon className="w-4 h-4" />
          <AlertTitle>Error!</AlertTitle>
          <AlertDescription>
            Terjadi kesalahan saat menyimpan perubahan.
          </AlertDescription>
        </Alert>
      )}
      <div className="grid gap-8">
        {/* Informasi Utama */}
        <Card className="bg-gray-200 dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-gray-100">
              Informasi Utama
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <ProfileInput
                label="Judul"
                name="title"
                value={editedProperty.title || ""}
                onChange={handleChange}
                type="text"
                placeholder="Judul properti"
              />
              <ProfileInput
                label="Deskripsi Singkat"
                name="short_desc"
                value={editedProperty.short_desc || ""}
                onChange={handleChange}
                type="text"
                placeholder="Deskripsi singkat properti"
              />
              <div className="sm:col-span-2" style={{ width: "50%" }}>
                <label
                  htmlFor="description"
                  className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Deskripsi
                </label>
                <Textarea
                  id="description"
                  name="description"
                  value={editedProperty.description || ""}
                  onChange={handleChange}
                  placeholder="Deskripsi lengkap properti"
                  className="w-full min-h-[100px] dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div className="sm:col-span-2" style={{ width: "50%" }}>
                <SelectInput
                  label="Kategori"
                  name="category_id"
                  value={editedProperty.category_id?.toString() || ""}
                  onChange={handleChange}
                  options={categories}
                  placeholder="Pilih kategori"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button
              type="submit"
              className="text-white bg-blue-500 hover:bg-blue-600 dark:text-gray-100 dark:bg-blue-700 dark:hover:bg-blue-800"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                "Simpan Perubahan"
              )}
            </Button>
          </CardFooter>
        </Card>

        {/* Harga dan Periode */}
        <Card className="bg-gray-200 dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-gray-100">
              Harga dan Periode
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <ProfileInput
                label="Harga"
                name="price"
                value={
                  editedProperty.price
                    ? `Rp. ${Number(editedProperty.price).toLocaleString("id-ID")}`
                    : ""
                }
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, "");
                  setEditedProperty((prev) => ({
                    ...prev,
                    price: value ? parseInt(value, 10) : undefined,
                  }));
                }}
                type="text"
                placeholder="Harga properti"
              />
              <div className="sm:col-span-2 " style={{ width: "50%" }}>
                <SelectInput
                  label="Periode"
                  name="period"
                  value={editedProperty.period || ""}
                  onChange={handleChange}
                  options={periods}
                  placeholder="Pilih periode"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button
              type="submit"
              className="text-white bg-blue-500 hover:bg-blue-600 dark:text-gray-100 dark:bg-blue-700 dark:hover:bg-blue-800"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                "Simpan Perubahan"
              )}
            </Button>
          </CardFooter>
        </Card>

        {/* Lokasi */}
        <Card className="bg-gray-200 dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-gray-100">
              Lokasi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div
                className="sm:col-span-2 lg:col-span-3"
                style={{ width: "30%" }}
              >
                <ProfileInput
                  label="Alamat"
                  name="address"
                  value={editedProperty.address || ""}
                  onChange={handleChange}
                  type="text"
                  placeholder="Alamat lengkap properti"
                />
              </div>
              <RegionSelector
                selectedProvince={editedProperty.province_id || ""}
                selectedDistrict={editedProperty.district_id || ""}
                selectedCity={editedProperty.city_id || ""}
                selectedVillage={editedProperty.village_id || ""}
                onProvinceChange={(code, name) =>
                  handleRegionChange("province", code, name)
                }
                onDistrictChange={(code, name) =>
                  handleRegionChange("district", code, name)
                }
                onCityChange={(code, name) =>
                  handleRegionChange("city", code, name)
                }
                onVillageChange={(code, name) =>
                  handleRegionChange("village", code, name)
                }
              />
              {/* <ProfileInput
                label="Koordinat"
                name="coordinates"
                value={editedProperty.coordinates || ""}
                onChange={handleChange}
                type="text"
                placeholder="Koordinat lokasi"
              /> */}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button
              type="submit"
              className="text-white bg-blue-500 hover:bg-blue-600 dark:text-gray-100 dark:bg-blue-700 dark:hover:bg-blue-800"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                "Simpan Perubahan"
              )}
            </Button>
          </CardFooter>
        </Card>

        {/* Informasi Tambahan */}
        <Card className="bg-gray-200 dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-gray-100">
              Informasi Tambahan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <ProfileInput
                label="Tempat Terdekat"
                name="nearby"
                value={editedProperty.nearby || ""}
                onChange={handleChange}
                type="text"
                placeholder="Tempat terdekat"
              />
              <div className="flex flex-col space-y-1">
                <label
                  htmlFor="ads"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Iklan
                </label>
                <select
                  id="ads"
                  name="ads"
                  value={editedProperty.ads || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="">Pilih jenis iklan</option>
                  {ads.map((option) => (
                    <option key={option.key} value={option.key}>
                      {option.value}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col space-y-1">
                <label
                  htmlFor="status"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={editedProperty.status || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="">Pilih status</option>
                  {status.map((option) => (
                    <option key={option.key} value={option.key}>
                      {option.value}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button
              type="submit"
              className="text-white bg-blue-500 hover:bg-blue-600 dark:text-gray-100 dark:bg-blue-700 dark:hover:bg-blue-800"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                "Simpan Perubahan"
              )}
            </Button>
          </CardFooter>
        </Card>

        {/* SEO */}
        <Card className="bg-gray-200 dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-gray-100">
              SEO
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <ProfileInput
                label="Meta Title"
                name="meta_title"
                value={editedProperty.meta_title || ""}
                onChange={handleChange}
                type="text"
                placeholder="Meta title untuk SEO"
              />
              <ProfileInput
                label="Meta Description"
                name="meta_description"
                value={editedProperty.meta_description || ""}
                onChange={handleChange}
                type="text"
                placeholder="Meta description untuk SEO"
              />
              <div className="sm:col-span-2" style={{ width: "50%" }}>
                <ProfileInput
                  label="Kata Kunci"
                  name="keywords"
                  value={editedProperty.keywords || ""}
                  onChange={handleChange}
                  type="text"
                  placeholder="Kata kunci untuk SEO (pisahkan dengan koma)"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button
              type="submit"
              className="text-white bg-blue-500 hover:bg-blue-600 dark:text-gray-100 dark:bg-blue-700 dark:hover:bg-blue-800"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                "Simpan Perubahan"
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="flex justify-center pt-6 space-x-4 border-t dark:border-gray-700">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="text-gray-900 bg-gray-200 hover:bg-gray-300 dark:text-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600"
        >
          Batal
        </Button>
      </div>
    </form>
  );
};

export default EditProperti;
