import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import PropertyList from "@/components/custom/PropertyList";

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

interface AddPropertiProps {
  onSave: (newProperty: Partial<PropertyList>) => Promise<void>;
  onClose: () => void;
}

const AddDetailProperti: React.FC<AddPropertiProps> = ({ onSave, onClose }) => {
  const [newProperty, setNewProperty] = useState<Partial<PropertyList>>({});
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
    setNewProperty((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSave(newProperty);
      setAlertStatus("success");
      setNewProperty({});
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

  const period = [
    { key: "onetime", value: "Sekali" },
    { key: "monthly", value: "Bulanan" },
    { key: "yearly", value: "Tahunan" },
    { key: "weekly", value: "Mingguan" },
  ];

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Tambah Properti Baru</CardTitle>
        <CardDescription>Masukkan detail properti baru Anda</CardDescription>
      </CardHeader>
      <CardContent>
        {alertStatus === "success" && (
          <Alert variant="success">
            <CheckCircledIcon className="w-4 h-4" />
            <AlertTitle>Berhasil!</AlertTitle>
            <AlertDescription>Properti berhasil ditambahkan.</AlertDescription>
          </Alert>
        )}
        {alertStatus === "error" && (
          <Alert variant="destructive">
            <CrossCircledIcon className="w-4 h-4" />
            <AlertTitle>Error!</AlertTitle>
            <AlertDescription>
              Gagal menambahkan properti. Silakan coba lagi.
            </AlertDescription>
          </Alert>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <ProfileInput
            label="Judul"
            name="title"
            value={newProperty.title || ""}
            type="text"
            onChange={handleChange}
            placeholder="Masukkan judul properti"
          />
          <ProfileInput
            label="Deskripsi Singkat"
            name="short_desc"
            value={newProperty.short_desc || ""}
            type="text"
            onChange={handleChange}
            placeholder="Masukkan deskripsi singkat"
          />
          <div className="flex flex-col space-y-1">
            <label
              htmlFor="description"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Deskripsi Lengkap
            </label>
            <textarea
              id="description"
              name="description"
              value={newProperty.description || ""}
              onChange={handleChange}
              placeholder="Masukkan deskripsi lengkap"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              rows={4}
            />
          </div>
          <ProfileInput
            label="Harga"
            name="price"
            value={newProperty.price?.toString() || ""}
            type="number"
            onChange={handleChange}
            placeholder="Masukkan harga properti"
          />
          <div className="flex flex-col space-y-1">
            <label
              htmlFor="category_id"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Kategori
            </label>
            <select
              id="category_id"
              name="category_id"
              value={newProperty.category_id?.toString() || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="">Pilih Kategori</option>
              {categories.map((category) => (
                <option key={category.key} value={category.key}>
                  {category.value}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col space-y-1">
            <label
              htmlFor="ads"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Jenis Iklan
            </label>
            <select
              id="ads"
              name="ads"
              value={newProperty.ads || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="">Pilih Jenis Iklan</option>
              {ads.map((ad) => (
                <option key={ad.key} value={ad.key}>
                  {ad.value}
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
              value={newProperty.status || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="">Pilih Status</option>
              {status.map((s) => (
                <option key={s.key} value={s.key}>
                  {s.value}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col space-y-1">
            <label
              htmlFor="period"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Periode
            </label>
            <select
              id="period"
              name="period"
              value={newProperty.period || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="">Pilih Periode</option>
              {period.map((period) => (
                <option key={period.key} value={period.key}>
                  {period.value}
                </option>
              ))}
            </select>
          </div>
          <RegionSelector
            selectedProvince={newProperty.province_id || ""}
            selectedCity={newProperty.city_id || ""}
            selectedDistrict={newProperty.district_id || ""}
            selectedVillage={newProperty.village_id || ""}
            onProvinceChange={(value) =>
              handleChange({
                target: { name: "province_id", value },
              } as React.ChangeEvent<HTMLSelectElement>)
            }
            onCityChange={(value) =>
              handleChange({
                target: { name: "city_id", value },
              } as React.ChangeEvent<HTMLSelectElement>)
            }
            onDistrictChange={(value) =>
              handleChange({
                target: { name: "district_id", value },
              } as React.ChangeEvent<HTMLSelectElement>)
            }
            onVillageChange={(value) =>
              handleChange({
                target: { name: "village_id", value },
              } as React.ChangeEvent<HTMLSelectElement>)
            }
          />
          <ProfileInput
            label="Alamat"
            name="address"
            value={newProperty.address || ""}
            type="text"
            onChange={handleChange}
            placeholder="Masukkan alamat lengkap"
          />
          <ProfileInput
            label="Koordinat"
            name="coordinates"
            value={newProperty.coordinates || ""}
            type="text"
            onChange={handleChange}
            placeholder="Masukkan koordinat (contoh: -6.123,106.456)"
          />
          <ProfileInput
            label="Jumlah Dilihat"
            name="views_count"
            value={newProperty.views_count?.toString() || "0"}
            type="number"
            onChange={handleChange}
            placeholder="Masukkan jumlah dilihat"
          />
          <ProfileInput
            label="Meta Title"
            name="meta_title"
            value={newProperty.meta_title || ""}
            type="text"
            onChange={handleChange}
            placeholder="Masukkan meta title"
          />
          <ProfileInput
            label="Meta Description"
            name="meta_description"
            value={newProperty.meta_description || ""}
            type="text"
            onChange={handleChange}
            placeholder="Masukkan meta description"
          />
          <ProfileInput
            label="Keywords"
            name="keywords"
            value={newProperty.keywords || ""}
            type="text"
            onChange={handleChange}
            placeholder="Masukkan keywords (pisahkan dengan koma)"
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : null}
            Simpan Properti
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddDetailProperti;
