import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface PropertyList {
  user_id: number | null;
  category_id: number | null;
  title: string | null;
  short_desc: string | null;
  description: string | null;
  price: number | null;
  period: string | null;
  address: string | null;
  province_id: string | null;
  district_id: string | null;
  city_id: string | null;
  village_id: string | null;
  coordinates: string | null;
  nearby: string | null;
  ads: string | null;
  status: string | null;
  views_count: number | null;
  meta_title: string | null;
  meta_description: string | null;
  keywords: string | null;
  id: number | null;
  created_at: string | null;
  updated_at: string | null;
  facility: {
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
  };
  specification: {
    land_size: number | null;
    building_size: number | null;
    bedroom: number | null;
    carport: string | null;
    bathroom: number | null;
    dining_room: string | null;
    living_room: string | null;
    floors: number | null;
    id: number;
  };
  images: {
    image_url: string;
    remote_image_url: string | null;
    is_primary: boolean;
    id: number;
  }[];
  province: {
    code: string;
    name: string;
    level: string;
  };
  district: {
    code: string;
    name: string;
    level: string;
  };
  city: {
    code: string;
    name: string;
    level: string;
  };
  village: {
    code: string;
    name: string;
    level: string;
  };
}

interface PropertyResponse {
  items: PropertyList[];
}

const FASTAPI_ENDPOINT = import.meta.env.PUBLIC_FASTAPI_ENDPOINT;

const PropertyList02: React.FC = () => {
  const [properties, setProperties] = useState<PropertyList[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const pageSize = 8;

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setIsLoading(true);
        const url = `${FASTAPI_ENDPOINT}/properties/?page=${currentPage}&size=${pageSize}`;
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: PropertyResponse = await response.json();
        console.log("Response JSON:", data); // Menambahkan console log untuk response JSON

        const sortedProperties = data.items.sort((a, b) => {
          return (
            new Date(b.created_at || "").getTime() -
            new Date(a.created_at || "").getTime()
          );
        });

        setProperties((prevProperties) => [
          ...prevProperties,
          ...sortedProperties,
        ]);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching properties:", error);
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, [currentPage]);

  const filteredProperties = selectedUserId
    ? properties.filter((property) => property.user_id === selectedUserId)
    : properties.filter((property) => property.user_id === 1231);

  if (isLoading && currentPage === 1) {
    return <Skeleton className="w-full h-48" />;
  }

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold">Daftar Properti</h2>
      <div className="mb-4">
        <label htmlFor="userIdFilter" className="mr-2">
          Filter berdasarkan User ID:
        </label>
        <input
          type="number"
          id="userIdFilter"
          value={selectedUserId || ""}
          onChange={(e) => setSelectedUserId(Number(e.target.value) || null)}
          className="px-2 py-1 border rounded"
        />
      </div>
      {filteredProperties.map((property) => (
        <Card key={property.id} className="p-4 mb-4 shadow-sm">
          <CardHeader>
            <CardTitle>{property.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-2">{property.short_desc}</p>
            <p className="mb-1">
              Harga: Rp {property.price?.toLocaleString("id-ID")}
            </p>
            <p>Lokasi: {property.address}</p>
            <p>User ID: {property.user_id}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PropertyList02;
