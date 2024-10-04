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

interface Specification {
  land_size: number | null;
  building_size: number | null;
  bedroom: number | null;
  carport: string | null;
  bathroom: number | null;
  dining_room: string | null;
  living_room: string | null;
  floors: number | null;
  id: number;
}

interface EditSpecificationProps {
  specification: Specification;
  onSave: (updatedSpecification: Partial<Specification>) => Promise<void>;
  onClose: () => void;
}

interface SpecificationInputProps {
  label: string;
  name: keyof Specification;
  value: string | number | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type: string;
  suffix?: string;
}

const SpecificationInput: React.FC<SpecificationInputProps> = ({
  label,
  name,
  value,
  onChange,
  type,
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
      <Input
        type={type}
        id={name}
        name={name}
        value={value ?? ""}
        onChange={onChange}
        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
      />
      {suffix && (
        <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
          {suffix}
        </span>
      )}
    </div>
  </div>
);

const EditSpecification: React.FC<EditSpecificationProps> = ({
  specification,
  onSave,
  onClose,
}) => {
  const [editedSpecification, setEditedSpecification] =
    useState<Specification>(specification);
  const [alertStatus, setAlertStatus] = useState<"success" | "error" | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedSpecification((prev) => ({
      ...prev,
      [name]: value === "" ? null : name === "id" ? parseInt(value, 10) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSave(editedSpecification);
      setAlertStatus("success");
    } catch (error) {
      setAlertStatus("error");
      console.error("Error saving specification:", error);
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
            Perubahan spesifikasi properti berhasil disimpan.
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
              Spesifikasi Properti
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <SpecificationInput
                label="Luas Tanah"
                name="land_size"
                value={editedSpecification.land_size}
                onChange={handleChange}
                type="number"
                suffix="m²"
              />
              <SpecificationInput
                label="Luas Bangunan"
                name="building_size"
                value={editedSpecification.building_size}
                onChange={handleChange}
                type="number"
                suffix="m²"
              />
              <SpecificationInput
                label="Jumlah Kamar Tidur"
                name="bedroom"
                value={editedSpecification.bedroom}
                onChange={handleChange}
                type="number"
              />
              <SpecificationInput
                label="Carport"
                name="carport"
                value={editedSpecification.carport}
                onChange={handleChange}
                type="text"
              />
              <SpecificationInput
                label="Jumlah Kamar Mandi"
                name="bathroom"
                value={editedSpecification.bathroom}
                onChange={handleChange}
                type="number"
              />
              <SpecificationInput
                label="Ruang Makan"
                name="dining_room"
                value={editedSpecification.dining_room}
                onChange={handleChange}
                type="text"
              />
              <SpecificationInput
                label="Ruang Tamu"
                name="living_room"
                value={editedSpecification.living_room}
                onChange={handleChange}
                type="text"
              />
              <SpecificationInput
                label="Jumlah Lantai"
                name="floors"
                value={editedSpecification.floors}
                onChange={handleChange}
                type="number"
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

export default EditSpecification;
