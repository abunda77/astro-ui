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
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const PUBLIC_GOOGLE_MAP = import.meta.env.PUBLIC_GOOGLE_MAP;

  let map: google.maps.Map;
  let marker: google.maps.marker.AdvancedMarkerElement;
  let infoWindow: google.maps.InfoWindow;

  const initMap = useCallback(async () => {
    const { Map } = (await google.maps.importLibrary(
      "maps"
    )) as google.maps.MapsLibrary;
    const { AdvancedMarkerElement } = (await google.maps.importLibrary(
      "marker"
    )) as google.maps.MarkerLibrary;
    const { PlaceAutocompleteElement } = (await google.maps.importLibrary(
      "places"
    )) as google.maps.PlacesLibrary & { PlaceAutocompleteElement: any };

    map = new Map(mapContainerRef.current as HTMLElement, {
      center: { lat: -6.2088, lng: 106.8456 },
      zoom: 13,
      mapId: "4504f8b37365c3d0",
      mapTypeControl: false,
    });

    const placeAutocomplete = new PlaceAutocompleteElement();
    placeAutocomplete.id = "place-autocomplete-input";

    const card = document.createElement("div");
    card.id = "place-autocomplete-card";
    card.appendChild(placeAutocomplete);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(card);

    marker = new AdvancedMarkerElement({
      map,
    });

    infoWindow = new google.maps.InfoWindow({});

    placeAutocomplete.addEventListener(
      "gmp-placeselect",
      async ({ place }: { place: google.maps.places.Place }) => {
        await place.fetchFields({
          fields: ["displayName", "formattedAddress", "location"],
        });

        if (place.viewport) {
          map.fitBounds(place.viewport);
        } else if (place.location) {
          map.setCenter(place.location);
          map.setZoom(17);
        }

        let content =
          '<div id="infowindow-content">' +
          '<span id="place-displayname" class="title">' +
          place.displayName +
          "</span><br />" +
          '<span id="place-address">' +
          place.formattedAddress +
          "</span>" +
          "</div>";

        if (place.location) {
          updateInfoWindow(content, place.location);
          marker.position = place.location;
        }

        setEditedProperty((prev) => ({
          ...prev,
          coordinates: `${place.location?.lat},${place.location?.lng}`,
          address: place.formattedAddress || "",
        }));
      }
    );
  }, []);

  useEffect(() => {
    const loadGoogleMapsScript = () => {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${PUBLIC_GOOGLE_MAP}&libraries=places,marker&callback=initMap`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    };

    if (!window.google) {
      loadGoogleMapsScript();
    } else {
      initMap();
    }

    return () => {
      const script = document.querySelector(
        'script[src^="https://maps.googleapis.com/maps/api/js"]'
      );
      if (script) {
        document.head.removeChild(script);
      }
    };
  }, [initMap, PUBLIC_GOOGLE_MAP]);

  const updateInfoWindow = (content: string, center: google.maps.LatLng) => {
    infoWindow.setContent(content);
    infoWindow.setPosition(center);
    infoWindow.open({
      map,
      anchor: marker,
      shouldFocus: false,
    });
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setEditedProperty((prev) => ({
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
    } catch (error) {
      console.error("Error saving property:", error);
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
