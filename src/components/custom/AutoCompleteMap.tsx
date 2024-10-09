import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  APIProvider,
  Map,
  Marker,
  ControlPosition,
  MapControl,
} from "@vis.gl/react-google-maps";
import { Input } from "@/components/ui/input";

interface LatLng {
  lat: number;
  lng: number;
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

const AutoCompleteMap: React.FC = () => {
  const [markerPosition, setMarkerPosition] = useState<LatLng>({
    lat: -7.8185690999999995,
    lng: 110.39499769999999,
  });
  const [formattedAddress, setFormattedAddress] = useState<string>("");
  const [zoom, setZoom] = useState<number>(13);
  const mapRef = useRef<google.maps.Map | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const PUBLIC_GOOGLE_MAP = import.meta.env.PUBLIC_GOOGLE_MAP || "";

  const handleMarkerDragEnd = useCallback((e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const newPosition = { lat: e.latLng.lat(), lng: e.latLng.lng() };
      setMarkerPosition(newPosition);

      // Mendapatkan alamat berformat dari koordinat baru
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: newPosition }, (results, status) => {
        if (status === "OK" && results?.[0]) {
          setFormattedAddress(results[0].formatted_address);
        }
      });
    }
  }, []);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormattedAddress(value);
  };

  const handleZoomChange = (newZoom: number) => {
    setZoom(newZoom);
    if (mapRef.current) {
      mapRef.current.setZoom(newZoom);
    }
  };

  return (
    <APIProvider apiKey={PUBLIC_GOOGLE_MAP}>
      <div className="flex flex-col h-screen">
        <div className="p-4 space-y-4">
          <Input
            type="text"
            id="place-autocomplete-input"
            placeholder="Cari lokasi..."
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formattedAddress}
            onChange={handleInputChange}
          />
          <Input
            type="hidden"
            placeholder="Alamat terformat..."
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formattedAddress}
            onChange={handleInputChange}
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
          >
            <Marker
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
    </APIProvider>
  );
};

export default AutoCompleteMap;
