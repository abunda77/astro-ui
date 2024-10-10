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
  address: string;
  coordinates: string;
  title: string;
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

const MapMultiPin: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null
  );
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [zoom, setZoom] = useState<number>(12);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({
    lat: -7.8185690999999995,
    lng: 110.39499769999999,
  });

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

  return (
    <APIProvider apiKey={PUBLIC_GOOGLE_MAP}>
      <div className="w-full h-screen">
        <Map
          zoom={zoom}
          center={mapCenter}
          mapId="9e8e34d21ff12101"
          gestureHandling="greedy"
          disableDefaultUI={true}
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
              <div>
                <h3 className="font-bold">{selectedProperty.title}</h3>
                <p>{selectedProperty.address}</p>
                <p>ID: {selectedProperty.id}</p>
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
