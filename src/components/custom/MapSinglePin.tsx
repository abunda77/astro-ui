import React, { useState, useCallback, useEffect } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
  useAdvancedMarkerRef,
  MapControl,
  ControlPosition,
} from "@vis.gl/react-google-maps";

interface Property {
  id: number;
  title: string;
  price: number;
  address: string;
  coordinates: string;
}

interface MapSinglePinProps {
  properties: Property[];
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
          background: "rgba(255,255,255,0.8)", // Meningkatkan kontras
          borderRadius: "4px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          display: "flex",
          flexFlow: "column nowrap",
        }}
      >
        <label htmlFor={"zoom"}>Kontrol Zoom</label>
        <input
          id={"zoom"}
          type={"range"}
          min={1}
          max={20} // Mengurangi max zoom untuk performa lebih baik
          step={1}
          value={zoom}
          onChange={(ev) => onZoomChange(ev.target.valueAsNumber)}
        />
      </div>
    </MapControl>
  );
};

const MapSinglePin: React.FC<MapSinglePinProps> = ({ properties }) => {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null
  );
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [zoom, setZoom] = useState<number>(14); // Default zoom yang lebih masuk akal
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({
    lat: -6.9783846,
    lng: 107.6387835,
  });
  const [error, setError] = useState<string | null>(null);

  const PUBLIC_GOOGLE_MAP = import.meta.env.PUBLIC_GOOGLE_MAP;

  useEffect(() => {
    if (!PUBLIC_GOOGLE_MAP) {
      setError("API key Google Maps tidak ditemukan");
      return;
    }

    if (properties.length > 0) {
      const firstPropertyCoords = parseCoordinates(properties[0].coordinates);
      if (firstPropertyCoords) {
        setMapCenter(firstPropertyCoords);
      }
    }
  }, [properties, PUBLIC_GOOGLE_MAP]);

  const handleMarkerClick = useCallback((property: Property) => {
    setSelectedProperty(property);
  }, []);

  const parseCoordinates = (
    coordinatesString: string
  ): { lat: number; lng: number } | null => {
    try {
      const [lat, lng] = coordinatesString.split(",").map(Number);
      if (isNaN(lat) || isNaN(lng)) {
        throw new Error("Koordinat tidak valid");
      }
      return { lat, lng };
    } catch (err) {
      console.error("Error parsing coordinates:", err);
      return null;
    }
  };

  const handleZoomChange = useCallback((newZoom: number) => {
    setZoom(newZoom);
  }, []);

  const handleMapDrag = useCallback((e: google.maps.Map) => {
    const center = e.getCenter();
    if (center) {
      setMapCenter({
        lat: center.lat(),
        lng: center.lng(),
      });
    }
  }, []);

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <APIProvider apiKey={PUBLIC_GOOGLE_MAP}>
      <div className="relative w-full h-96">
        <Map
          zoom={zoom}
          center={mapCenter}
          mapId="9e8e34d21ff12101"
          gestureHandling="greedy"
          disableDefaultUI={true}
          draggable={true}
          onDragend={(e) => handleMapDrag(e.map)}
          zoomControl={false}
          streetViewControl={false}
          mapTypeControl={false}
          fullscreenControl={false}
          scrollwheel={true}
        >
          {properties.map((property) => {
            const position = parseCoordinates(property.coordinates);
            if (!position) {
              console.warn(`Invalid coordinates for property ${property.id}`);
              return null;
            }

            return (
              <AdvancedMarker
                key={property.id}
                position={position}
                onClick={() => handleMarkerClick(property)}
                ref={markerRef}
                title={property.title}
              />
            );
          })}

          {selectedProperty && marker && (
            <InfoWindow
              anchor={marker}
              position={parseCoordinates(selectedProperty.coordinates)}
              onCloseClick={() => setSelectedProperty(null)}
            >
              <div className="w-64 p-2 sm:w-80 md:w-96">
                <div className="flex flex-col gap-2">
                  <p className="text-xs sm:text-sm md:text-base">
                    ID: {selectedProperty.id}
                  </p>
                  <h2 className="text-sm font-bold truncate sm:text-base md:text-lg">
                    {selectedProperty.title}
                  </h2>
                  <p className="text-xs sm:text-sm md:text-base">
                    Harga: Rp{" "}
                    {selectedProperty.price?.toLocaleString("id-ID") || "N/A"}
                  </p>
                  <p className="text-xs sm:text-sm md:text-base">
                    {selectedProperty.address}
                  </p>
                </div>
              </div>
            </InfoWindow>
          )}

          <CustomZoomControl
            controlPosition={ControlPosition.TOP_LEFT}
            zoom={zoom}
            onZoomChange={handleZoomChange}
          />
        </Map>
      </div>
    </APIProvider>
  );
};

export default MapSinglePin;
