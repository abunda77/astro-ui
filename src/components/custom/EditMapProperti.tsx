import React, { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircledIcon, CrossCircledIcon } from "@radix-ui/react-icons";
import { Loader2 } from "lucide-react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  ControlPosition,
  MapControl,
} from "@vis.gl/react-google-maps";

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

interface EditMapPropertiProps {
  property: PropertyList;
  onSave: (updatedProperty: Partial<PropertyList>) => Promise<void>;
  onClose: () => void;
}

type CustomZoomControlProps = {
  controlPosition: ControlPosition;
  zoom: number;
  onZoomChange: (zoom: number) => void;
};

const CustomZoomControl = ({
  controlPosition,
  zoom,
  onZoomChange,
}: CustomZoomControlProps) => {
  return (
    <MapControl position={controlPosition}>
      <div
        style={{
          margin: "10px",
          padding: "1em",
          background: "rgba(255,255,255,0.4)",
          display: "flex",
          flexFlow: "column nowrap",
        }}
      >
        <label htmlFor={"zoom"}>Ini adalah kontrol zoom kustom!</label>
        <input
          id={"zoom"}
          type={"range"}
          min={1}
          max={18}
          step={"any"}
          value={zoom}
          onChange={(ev) => onZoomChange(ev.target.valueAsNumber)}
        />
      </div>
    </MapControl>
  );
};

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

const EditMapProperti: React.FC<EditMapPropertiProps> = ({
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
  const [formattedAddress, setFormattedAddress] = useState<string>(
    property.address || ""
  );
  const [zoom, setZoom] = useState<number>(13);

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

        // Mendapatkan alamat berformat dari koordinat baru
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ location: newPosition }, (results, status) => {
          if (status === "OK" && results?.[0]) {
            setFormattedAddress(results[0].formatted_address);
            updateEditedProperty(newPosition, results[0].formatted_address);
          }
        });
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
          componentRestrictions: { country: "ID" }, // Menambahkan pembatasan untuk Indonesia
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
            setFormattedAddress(place.formatted_address || "");

            if (mapRef.current) {
              mapRef.current.setCenter(newPosition);
              mapRef.current.setZoom(17);
              setZoom(17);
            }
          }
        });
      } catch (error) {
        console.error("Error initializing autocomplete:", error);
      }
    };

    initAutocomplete();
  }, []);

  const handleInputChange = (
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

  const handleZoomChange = (newZoom: number) => {
    setZoom(newZoom);
    if (mapRef.current) {
      mapRef.current.setZoom(newZoom);
    }
  };

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
              <Input
                type="text"
                id="place-autocomplete-input"
                placeholder="Cari lokasi..."
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formattedAddress}
                onChange={handleInputChange}
              />
              <Input
                type="text"
                name="address"
                value={formattedAddress}
                onChange={handleInputChange}
                readOnly
              />
              <Input
                type="text"
                name="coordinates"
                value={editedProperty.coordinates || ""}
                readOnly
              />
            </div>

            <div className="flex-grow">
              <Map
                zoom={zoom}
                center={markerPosition}
                mapId="9e8e34d21ff12101"
                gestureHandling="greedy"
                disableDefaultUI={true}
                // onLoad={onMapLoad}
                className="w-full h-[300px] rounded-lg"
              >
                <AdvancedMarker
                  position={markerPosition}
                  draggable={true}
                  onDragEnd={handleMarkerDragEnd}
                />
                <CustomZoomControl
                  controlPosition={ControlPosition.TOP_LEFT}
                  zoom={zoom}
                  onZoomChange={handleZoomChange}
                />
              </Map>
            </div>
          </div>
        </div>

        {/* Hidden inputs */}
        {Object.entries(editedProperty).map(([key, value]) => (
          <Input
            key={key}
            type="hidden"
            name={key}
            value={value?.toString() || ""}
            onChange={handleInputChange}
          />
        ))}

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

export default EditMapProperti;
