import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

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

interface PropertyListProps {
  properties: PropertyList[] | null;
  isLoading: boolean;
  homedomain: string;
}

const PropertyList: React.FC<PropertyListProps> = ({
  properties,
  isLoading,
  homedomain,
}) => {
  const getImageUrl = (property: PropertyList) => {
    if (property.images && property.images.length > 0) {
      const primaryImage = property.images.find((img) => img.is_primary);
      let imageUrl;
      if (primaryImage) {
        imageUrl = primaryImage.image_url || primaryImage.remote_image_url;
      } else {
        imageUrl =
          property.images[0].image_url || property.images[0].remote_image_url;
      }
      if (imageUrl) {
        imageUrl = imageUrl.startsWith("/") ? imageUrl.substring(1) : imageUrl;
        imageUrl = imageUrl.replace(/[",/\\]/g, "");
        return `${homedomain}/storage/${imageUrl}`;
      }
    }
    return `${homedomain}/images/home_fallback.png`;
  };

  if (isLoading) {
    return (
      <Card className="max-w-4xl p-6 mx-auto rounded-lg shadow-lg bg-gradient-to-br from-blue-400 via-violet-400 to-purple-600 dark:from-gray-600 dark:to-gray-400">
        <CardHeader className="mb-6">
          <Skeleton className="w-48 h-8 mb-2 animate-pulse" />
          <Skeleton className="w-64 h-6 animate-pulse" />
        </CardHeader>
        <CardContent className="space-y-6">
          {[1, 2, 3].map((index) => (
            <div
              key={index}
              className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800"
            >
              <Skeleton className="w-full h-8 mb-4 animate-pulse" />
              <Skeleton className="w-full h-6 mb-2 animate-pulse" />
              <Skeleton className="w-3/4 h-6 mb-2 animate-pulse" />
              <Skeleton className="w-1/2 h-6 mb-4 animate-pulse" />
              <Skeleton className="w-full h-40 rounded animate-pulse" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-4xl p-6 mx-auto rounded-lg shadow-lg bg-gradient-to-br from-blue-400 via-violet-400 to-purple-600 dark:from-gray-600 dark:to-gray-400">
      <CardHeader className="mb-6">
        <CardTitle className="text-2xl font-bold text-white">
          Data Properti
        </CardTitle>
        <CardDescription className="text-xl font-semibold text-gray-200">
          Daftar properti yang tersedia
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {properties && properties.length > 0 ? (
          properties.map((property) => (
            <Card
              key={property.id}
              className="flex items-center p-4 bg-white rounded-lg shadow-md dark:bg-gray-800"
            >
              <img
                src={getImageUrl(property)}
                alt={property.title || "Gambar Properti"}
                className="object-cover w-20 h-20 mr-4 rounded-full"
              />
              <div className="flex-grow">
                <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-gray-200">
                  {property.title || "Tidak ada judul"}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {property.short_desc || "Tidak ada deskripsi singkat"}
                </p>
              </div>
              <Button className="text-white bg-red-600 hover:bg-red-700">
                Edit
              </Button>
            </Card>
          ))
        ) : (
          <Card className="p-4 bg-white rounded-lg shadow-md dark:bg-gray-800">
            <p className="text-gray-600 dark:text-gray-400">
              Tidak ada data properti yang tersedia.
            </p>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};

export default PropertyList;
