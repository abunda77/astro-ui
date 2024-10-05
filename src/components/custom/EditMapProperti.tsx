import React, { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircledIcon, CrossCircledIcon } from "@radix-ui/react-icons";
import { Loader2 } from "lucide-react";
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
  const autocompleteInputRef = useRef<HTMLInputElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const PUBLIC_GOOGLE_MAP = import.meta.env.PUBLIC_GOOGLE_MAP;

  const initializeMap = useCallback(() => {
    console.log("Initializing map...");
    if (
      !window.google ||
      !autocompleteInputRef.current ||
      !mapContainerRef.current ||
      mapRef.current
    ) {
      console.log("Map initialization conditions not met");
      return;
    }

    const defaultLocation = { lat: -6.2088, lng: 106.8456 }; // Jakarta coordinates
    console.log("Default location:", defaultLocation);

    mapRef.current = new window.google.maps.Map(mapContainerRef.current, {
      center: defaultLocation,
      zoom: 13,
    });
    console.log("Map created");

    autocompleteRef.current = new window.google.maps.places.Autocomplete(
      autocompleteInputRef.current,
      {
        types: ["address"],
      }
    );
    console.log("Autocomplete initialized");

    autocompleteRef.current.addListener("place_changed", () => {
      console.log("Place changed event triggered");
      const place = autocompleteRef.current?.getPlace();
      if (place?.geometry?.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const coordinates = `${lat},${lng}`;
        console.log("New coordinates:", coordinates);

        setEditedProperty((prev) => ({
          ...prev,
          coordinates,
          address: place.formatted_address || "",
        }));
        console.log("Updated edited property with new location");

        mapRef.current?.setCenter({ lat, lng });
        console.log("Map center updated");

        if (markerRef.current) {
          markerRef.current.setPosition({ lat, lng });
          console.log("Existing marker position updated");
        } else {
          markerRef.current = new window.google.maps.Marker({
            position: { lat, lng },
            map: mapRef.current,
          });
          console.log("New marker created");
        }
      } else {
        console.log("Place does not have valid geometry");
      }
    });
  }, []);

  useEffect(() => {
    console.log("useEffect for map initialization triggered");
    if (window.google) {
      console.log("Google Maps API already loaded");
      initializeMap();
    } else {
      console.log("Loading Google Maps API script");
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${PUBLIC_GOOGLE_MAP}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        console.log("Google Maps API script loaded");
        initializeMap();
      };
      document.head.appendChild(script);

      return () => {
        console.log("Cleaning up Google Maps API script");
        document.head.removeChild(script);
      };
    }
  }, [initializeMap, PUBLIC_GOOGLE_MAP]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    console.log(`Handling change for ${name}: ${value}`);
    setEditedProperty((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting form...");
    setIsLoading(true);
    try {
      await onSave(editedProperty);
      console.log("Property saved successfully");
      setAlertStatus("success");
    } catch (error) {
      console.error("Error saving property:", error);
      setAlertStatus("error");
    } finally {
      setIsLoading(false);
      console.log("Form submission completed");
    }
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
        {/* Hidden inputs */}
        {Object.entries(editedProperty).map(([key, value]) => (
          <Input
            key={key}
            type="hidden"
            name={key}
            value={value?.toString() || ""}
            onChange={handleChange}
          />
        ))}

        {/* Location Section */}
        <div className="relative p-6 rounded-lg dark:bg-gray-800">
          <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-gray-100">
            Lokasi
          </h3>
          <Button
            type="submit"
            className="absolute text-white bg-blue-500 top-4 right-4 hover:bg-blue-600 dark:text-gray-100 dark:bg-blue-700 dark:hover:bg-blue-800"
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

          <div className="grid gap-4 mb-4">
            <div className="flex flex-col space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Cari Lokasi
              </label>
              <input
                ref={autocompleteInputRef}
                type="text"
                placeholder="Masukkan alamat properti"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <ProfileInput
              label="Koordinat"
              name="coordinates"
              value={editedProperty.coordinates || ""}
              onChange={handleChange}
              type="text"
              placeholder="Koordinat akan terisi otomatis"
            />
          </div>

          <div
            ref={mapContainerRef}
            className="w-full h-[300px] rounded-lg"
          ></div>
        </div>
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
