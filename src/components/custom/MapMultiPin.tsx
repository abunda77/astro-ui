import React, { useState, useEffect, useCallback } from "react";
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
// Tambahkan interface props
interface MapMultiPinProps {
  properties?: Property[]; // Gunakan optional (?) karena komponen juga dipanggil tanpa props
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
          max={22}
          step={"any"}
          value={zoom}
          onChange={(ev) => onZoomChange(ev.target.valueAsNumber)}
        />
      </div>
    </MapControl>
  );
};

const MapMultiPin: React.FC<MapMultiPinProps> = ({
  properties: propProperties,
}) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null
  );
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [zoom, setZoom] = useState<number>(16);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>(
    () => {
      // Default ke pusat Bandung jika tidak ada koordinat yang tersedia
      const defaultCenter = {
        lat: -6.9783846, // Latitude pusat Bandung
        lng: 107.6387835, // Longitude pusat Bandung
      };

      return defaultCenter;
    }
  );

  const PUBLIC_GOOGLE_MAP = import.meta.env.PUBLIC_GOOGLE_MAP || "";
  const PUBLIC_FASTAPI_ENDPOINT = import.meta.env.PUBLIC_FASTAPI_ENDPOINT || "";

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch(
          `${PUBLIC_FASTAPI_ENDPOINT}/properties/maps`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log("Data properti:", data);
        setProperties(data);

        // Set map center based on the first property's coordinates
        if (data.length > 0) {
          const firstPropertyCoords = parseCoordinates(data[0].coordinates);
          if (firstPropertyCoords) {
            setMapCenter(firstPropertyCoords);
          }
        }
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
    };

    fetchProperties();
  }, []);

  const handleMarkerClick = useCallback((property: Property) => {
    setSelectedProperty(property);
  }, []);

  const parseCoordinates = (
    coordinatesString: string
  ): { lat: number; lng: number } | null => {
    const [lat, lng] = coordinatesString.split(",").map(Number);
    return isNaN(lat) || isNaN(lng) ? null : { lat, lng };
  };

  const handleZoomChange = (newZoom: number) => {
    setZoom(newZoom);
  };

  // ... existing code ...
  const handleMapDrag = (e: google.maps.Map) => {
    const center = e.getCenter();
    if (center) {
      setMapCenter({
        lat: center.lat(),
        lng: center.lng(),
      });
    }
  };
  // ... existing code ...

  return (
    <APIProvider apiKey={PUBLIC_GOOGLE_MAP}>
      <div className="w-full h-96">
        <Map
          zoom={zoom}
          center={mapCenter}
          mapId="9e8e34d21ff12101"
          gestureHandling="greedy"
          disableDefaultUI={true}
          draggable={true}
          onDragend={(e) => handleMapDrag(e.map)}
          zoomControl={true}
          streetViewControl={false}
          mapTypeControl={false}
          fullscreenControl={false}
          scrollwheel={true}
        >
          {properties.map((property) => {
            const position = parseCoordinates(property.coordinates);
            if (!position) return null;

            return (
              <AdvancedMarker
                key={property.id}
                position={position}
                onClick={() => handleMarkerClick(property)}
                ref={markerRef}
              />
            );
          })}

          {selectedProperty && (
            <InfoWindow
              anchor={marker}
              position={parseCoordinates(selectedProperty.coordinates)}
              onCloseClick={() => setSelectedProperty(null)}
            >
              <div className="w-64 sm:w-80 md:w-96">
                <div className="flex flex-col gap-2">
                  <p className="text-xs sm:text-sm md:text-base">
                    ID: {selectedProperty.id}
                  </p>
                  <h2 className="text-sm font-bold truncate sm:text-base md:text-lg">
                    {selectedProperty.title}
                  </h2>
                  <p className="text-xs sm:text-sm md:text-base">
                    Harga: Rp {selectedProperty.price?.toLocaleString()}
                  </p>
                  <p className="text-xs sm:text-sm md:text-base">
                    {selectedProperty.address}
                  </p>
                  <p className="text-xs sm:text-sm md:text-base">
                    Koordinat: {selectedProperty.coordinates}
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

export default MapMultiPin;
