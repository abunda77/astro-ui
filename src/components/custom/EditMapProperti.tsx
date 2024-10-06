import React, { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircledIcon, CrossCircledIcon } from "@radix-ui/react-icons";
import { Loader2 } from "lucide-react";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";

// Improved type definitions
type AlertStatus = "success" | "error" | null;

interface LatLng {
  lat: number;
  lng: number;
}

interface PropertyList {
  coordinates: string;
  address?: string;
  [key: string]: string | undefined;
}

interface PlaceJSON {
  formattedAddress: string;
  location?: LatLng;
}

interface ProfileInputProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
}

interface EditPropertiProps {
  property: PropertyList;
  onSave: (updatedProperty: Partial<PropertyList>) => Promise<void>;
  onClose: () => void;
}

// Extracted to a separate component for better reusability
const ProfileInput: React.FC<ProfileInputProps> = ({
  label,
  name,
  value,
  onChange,
  type = "text",
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

// Extracted alert component for reusability
const StatusAlert: React.FC<{ status: AlertStatus }> = ({ status }) => {
  if (!status) return null;

  const isSuccess = status === "success";
  return (
    <Alert variant={isSuccess ? "success" : "destructive"}>
      {isSuccess ? (
        <CheckCircledIcon className="w-4 h-4" />
      ) : (
        <CrossCircledIcon className="w-4 h-4" />
      )}
      <AlertTitle>{isSuccess ? "Berhasil!" : "Error!"}</AlertTitle>
      <AlertDescription>
        {isSuccess
          ? "Perubahan properti berhasil disimpan."
          : "Terjadi kesalahan saat menyimpan perubahan."}
      </AlertDescription>
    </Alert>
  );
};

const EditProperti: React.FC<EditPropertiProps> = ({
  property,
  onSave,
  onClose,
}) => {
  const [editedProperty, setEditedProperty] =
    useState<Partial<PropertyList>>(property);
  const [alertStatus, setAlertStatus] = useState<AlertStatus>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [markerPosition, setMarkerPosition] = useState<LatLng>(() => ({
    lat: property.coordinates
      ? parseFloat(property.coordinates.split(",")[0])
      : -6.2088,
    lng: property.coordinates
      ? parseFloat(property.coordinates.split(",")[1])
      : 106.8456,
  }));

  const mapRef = useRef<google.maps.Map | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const PUBLIC_GOOGLE_MAP = import.meta.env.PUBLIC_GOOGLE_MAP || "";

  const updateEditedProperty = useCallback(
    (position: LatLng, address?: string) => {
      setEditedProperty((prev) => ({
        ...prev,
        coordinates: `${position.lat},${position.lng}`,
        ...(address && { address }),
      }));
    },
    []
  );

  const handleMarkerDragEnd = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        const newPosition = { lat: e.latLng.lat(), lng: e.latLng.lng() };
        setMarkerPosition(newPosition);
        updateEditedProperty(newPosition);
      }
    },
    [updateEditedProperty]
  );

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  useEffect(() => {
    const initAutocomplete = async () => {
      try {
        await google.maps.importLibrary("places");
        const input = document.getElementById(
          "place-autocomplete-input"
        ) as HTMLInputElement;
        if (!input) return;

        const autocomplete = new google.maps.places.Autocomplete(input, {
          fields: ["formatted_address", "geometry"],
        });

        autocompleteRef.current = autocomplete;

        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          if (place.geometry && place.geometry.location) {
            const newPosition = {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
            };
            setMarkerPosition(newPosition);
            updateEditedProperty(newPosition, place.formatted_address);

            if (mapRef.current) {
              mapRef.current.setCenter(newPosition);
              mapRef.current.setZoom(17);
            }
          }
        });
      } catch (error) {
        console.error("Error initializing autocomplete:", error);
      }
    };

    initAutocomplete();
  }, [updateEditedProperty]);

  const handleChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const { name, value } = e.target;
      setEditedProperty((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSave(editedProperty);
      setAlertStatus("success");
    } catch (error) {
      console.error("Error saving property:", error);
      setAlertStatus("error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <APIProvider apiKey={PUBLIC_GOOGLE_MAP}>
      <form onSubmit={handleSubmit} className="space-y-8">
        <StatusAlert status={alertStatus} />

        <div className="grid gap-8">
          {Object.entries(editedProperty).map(([key, value]) => (
            <Input
              key={key}
              type="hidden"
              name={key}
              value={value?.toString() || ""}
              onChange={handleChange}
            />
          ))}

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
                <Input
                  type="text"
                  id="place-autocomplete-input"
                  name="place-autocomplete"
                  placeholder="Masukkan alamat atau nama tempat"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              <ProfileInput
                label="Koordinat"
                name="coordinates"
                value={editedProperty.coordinates || ""}
                onChange={handleChange}
                placeholder="Koordinat akan terisi otomatis"
              />
            </div>

            <Map
              zoom={13}
              center={markerPosition}
              mapId="4504f8b37365c3d0"
              className="w-full h-[300px] rounded-lg"
            >
              <Marker
                position={markerPosition}
                draggable={true}
                onDragEnd={handleMarkerDragEnd}
              />
            </Map>
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
    </APIProvider>
  );
};

export default EditProperti;
