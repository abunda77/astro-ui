import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

const certificates = [
  { key: "shm", value: "SHM (Sertifikat Hak Milik)" },
  { key: "shgb", value: "SHGB (Sertifikat Hak Guna Bangunan)" },
  { key: "shp", value: "SHP (Sertifikat Hak Pakai)" },
  { key: "shgu", value: "SHGU (Sertifikat Hak Guna Usaha)" },
  {
    key: "shmsrs",
    value: "SHMSRS (Sertifikat Hak Milik atas Satuan Rumah Susun)",
  },
  { key: "sta", value: "STA (Sertifikat Tanah Adat)" },
];

const linePhoneOptions = [
  { key: "yes", value: "Ya" },
  { key: "no", value: "Tidak" },
  { key: "progress", value: "Dalam Proses" },
];

const hookOptions = [
  { key: "yes", value: "Ya" },
  { key: "no", value: "Tidak" },
];

const conditionOptions = [
  { key: "very_good", value: "Sangat Baik" },
  { key: "good", value: "Baik" },
  { key: "semi_good", value: "Cukup Baik" },
  { key: "average", value: "Rata-rata" },
  { key: "not_good", value: "Kurang Baik" },
  { key: "bad", value: "Buruk" },
  { key: "very_bad", value: "Sangat Buruk" },
];

const securityOptions = [
  { key: "yes", value: "Ya" },
  { key: "no", value: "Tidak" },
];

const wastafelOptions = [
  { key: "yes", value: "Ya" },
  { key: "no", value: "Tidak" },
];

const internetOptions = [
  { key: "telkom_indihome", value: "Telkom IndiHome" },
  { key: "firstmedia", value: "First Media" },
  { key: "biznet", value: "Biznet" },
  { key: "myrepublic", value: "MyRepublic" },
  { key: "cbn", value: "CBN" },
  { key: "mncplay", value: "MNC Play" },
  { key: "xl_home", value: "XL Home" },
  { key: "oxygen", value: "Oxygen.id" },
  { key: "iconnet", value: "Icon+" },
  { key: "transvision", value: "Transvision" },
  { key: "megavision", value: "Megavision" },
  { key: "other", value: "Lainnya" },
];

const waterSourceOptions = [
  { key: "pam", value: "PAM (Perusahaan Air Minum)" },
  { key: "pdam", value: "PDAM (Perusahaan Daerah Air Minum)" },
  { key: "sumur_bor", value: "Sumur Bor" },
  { key: "sumur_gali", value: "Sumur Gali" },
  { key: "mata_air", value: "Mata Air" },
  { key: "sungai", value: "Sungai" },
  { key: "air_hujan", value: "Air Hujan" },
  { key: "air_kemasan", value: "Air Kemasan" },
  { key: "air_isi_ulang", value: "Air Isi Ulang" },
  { key: "embung", value: "Embung" },
  { key: "danau", value: "Danau" },
  { key: "waduk", value: "Waduk" },
  { key: "desalinasi", value: "Desalinasi Air Laut" },
  { key: "lainnya", value: "Lainnya" },
];

interface FacilityInputProps {
  label: string;
  name: string;
  value: string | number | null;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  type: string;
  options?: Array<{ key: string; value: string }>;
  suffix?: string;
}

const FacilityInput: React.FC<FacilityInputProps> = ({
  label,
  name,
  value,
  onChange,
  type,
  options,
  suffix,
}) => (
  <div className="flex flex-col space-y-1">
    <label
      htmlFor={name}
      className="text-sm font-medium text-gray-700 dark:text-gray-300"
    >
      {label}
    </label>
    <div className="flex items-center">
      {type === "select" ? (
        <select
          id={name}
          name={name}
          value={value as string}
          onChange={onChange}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          {options?.map((option) => (
            <option key={option.key} value={option.key}>
              {option.value}
            </option>
          ))}
        </select>
      ) : (
        <Input
          type={type}
          id={name}
          name={name}
          value={value as string}
          onChange={onChange}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      )}
      {suffix && (
        <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
          {suffix}
        </span>
      )}
    </div>
  </div>
);

interface Facility {
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
}

interface EditFacilityProps {
  facility: Facility;
  onSave: (updatedFacility: Partial<Facility>) => Promise<void>;
  onClose: () => void;
}

const EditFacility: React.FC<EditFacilityProps> = ({
  facility,
  onSave,
  onClose,
}) => {
  const [editedFacility, setEditedFacility] =
    useState<Partial<Facility>>(facility);
  const [alertStatus, setAlertStatus] = useState<"success" | "error" | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditedFacility((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSave(editedFacility);
      setAlertStatus("success");
      // Refresh Drawer content
      setEditedFacility({ ...editedFacility });
    } catch (error) {
      setAlertStatus("error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {alertStatus === "success" && (
        <Alert variant="success">
          <CheckCircledIcon className="w-4 h-4" />
          <AlertTitle>Berhasil!</AlertTitle>
          <AlertDescription>
            Perubahan fasilitas properti berhasil disimpan.
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
        <Card className="bg-gray-200 dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-gray-100">
              Fasilitas Properti
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <FacilityInput
                label="Sertifikat"
                name="certificate"
                value={editedFacility.certificate || ""}
                onChange={handleChange}
                type="select"
                options={certificates}
              />
              <FacilityInput
                label="Listrik (Watt)"
                name="electricity"
                value={editedFacility.electricity || ""}
                onChange={handleChange}
                type="number"
                suffix="kWh"
              />
              <FacilityInput
                label="Jaringan Telepon"
                name="line_phone"
                value={editedFacility.line_phone || ""}
                onChange={handleChange}
                type="select"
                options={linePhoneOptions}
              />
              <FacilityInput
                label="Internet"
                name="internet"
                value={editedFacility.internet || ""}
                onChange={handleChange}
                type="select"
                options={internetOptions}
              />
              <FacilityInput
                label="Lebar Jalan"
                name="road_width"
                value={editedFacility.road_width || ""}
                onChange={handleChange}
                type="text"
                suffix="m2"
              />
              <FacilityInput
                label="Sumber Air"
                name="water_source"
                value={editedFacility.water_source || ""}
                onChange={handleChange}
                type="select"
                options={waterSourceOptions}
              />
              <FacilityInput
                label="Hook Jalan"
                name="hook"
                value={editedFacility.hook || ""}
                onChange={handleChange}
                type="select"
                options={hookOptions}
              />
              <FacilityInput
                label="Kondisi"
                name="condition"
                value={editedFacility.condition || ""}
                onChange={handleChange}
                type="select"
                options={conditionOptions}
              />
              <FacilityInput
                label="Keamanan"
                name="security"
                value={editedFacility.security || ""}
                onChange={handleChange}
                type="select"
                options={securityOptions}
              />
              <FacilityInput
                label="Wastafel"
                name="wastafel"
                value={editedFacility.wastafel || ""}
                onChange={handleChange}
                type="select"
                options={wastafelOptions}
              />
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

export default EditFacility;
