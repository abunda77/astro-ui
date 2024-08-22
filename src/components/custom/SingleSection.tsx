import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import DotPattern from "@/components/magicui/dot-pattern";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface Property {
  user_id: number;
  category_id: number;
  title: string;
  short_desc: string;
  description: string;
  price: number;
  period: string;
  address: string;
  province_id: string;
  district_id: string;
  city_id: string;
  village_id: string;
  coordinates: string;
  nearby: string;
  ads: string;
  status: string;
  views_count: number;
  meta_title: string | null;
  meta_description: string | null;
  keywords: string;
  id: number;
  created_at: string;
  updated_at: string;
  facility: {
    certificate: string;
    electricity: number;
    line_phone: string;
    internet: string;
    road_width: string;
    water_source: string;
    hook: string | null;
    condition: string | null;
    security: string | null;
    wastafel: string | null;
    id: number;
  };
  specification: {
    land_size: number | null;
    building_size: number;
    bedroom: number;
    carport: string | null;
    bathroom: number;
    dining_room: string | null;
    living_room: string | null;
    floors: number;
    id: number;
  };
  images: {
    image_url: string;
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
  user: {
    name: string;
    email: string;
    password: string;
    role: string;
    is_active: boolean;
    id: number;
    created_at: string;
    updated_at: string;
    profile: {
      first_name: string;
      last_name: string;
      phone: string;
      email: string;
      whatsapp: string;
      company_name: string;
      avatar: string;
      biodata_company: string;
      jobdesk: string;
    };
  };
}

interface PropertyResponse {
  items: Property[];
}
const homedomain = import.meta.env.PUBLIC_HOME_DOMAIN;
const getImageUrl = (property: Property) => {
  const primaryImage = property.images.find((img) => img.is_primary);

  return primaryImage
    ? `${homedomain}/storage/${primaryImage.image_url}`
    : "images/home_fallback.png";
};

interface SingleSectionProps {
  property: Property;
}
const SingleSection: React.FC<SingleSectionProps> = ({ property }) => {
  if (!property) {
    return <div>Property not found</div>;
  }

  const renderValue = (value: any) => {
    if (value === null || value === undefined) {
      return <span>Data kosong</span>;
    }
    return value;
  };

  return (
    <div className="p-5 mx-auto text-gray-100 bg-gray-200 sm:p-10 md:p-16 dark:bg-gray-700 dark:text-gray-800">
      <div className="flex flex-col max-w-3xl mx-auto overflow-hidden rounded">
        <DotPattern
          width={20}
          height={20}
          cx={1}
          cy={1}
          cr={1}
          className={cn(
            "[mask-image:radial-gradient(300px_circle_at_center,white,transparent)]"
          )}
        />
        <img
          src={getImageUrl(property)}
          alt={renderValue(property.title) || "Property Image"} // Provide a default alt text
          className="w-full bg-gray-500 h-60 sm:h-96 dark:bg-gray-500"
        />
        <div className="p-6 pb-12 m-4 mx-auto -mt-16 space-y-6 bg-gray-900 lg:max-w-2xl sm:px-10 sm:mx-12 lg:rounded-md dark:bg-gray-50">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold sm:text-3xl">
                {renderValue(property.title)}
              </h1>
              <p className="text-xs text-gray-400 dark:text-gray-600">
                By
                <span className="text-xs hover:underline">
                  {renderValue(property.user?.name) || "Unknown User"}
                </span>
              </p>
            </div>
            <Avatar className="w-32 h-32 mb-4">
              <AvatarImage
                src={renderValue(
                  `${homedomain}/storage/${property.user.profile.avatar}`
                )}
                alt={renderValue(property.user.name)}
              />
              <AvatarFallback>{property.user.name.charAt(0)}</AvatarFallback>
            </Avatar>
          </div>
          <div className="text-gray-100 dark:text-gray-800">
            <p>{renderValue(property.short_desc)}</p>
            <p className="mt-4 font-bold">
              Harga: Rp {renderValue(property.price)?.toLocaleString() || "N/A"}
            </p>
            <p>Address: {renderValue(property.address) || "N/A"}</p>
            <p>
              Location:{" "}
              {property.province && property.district && property.city
                ? `${property.province.name}, ${property.district.name}, ${property.city.name}`
                : "N/A"}
            </p>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Specifications</h2>
            <ul>
              {property.specification ? (
                <>
                  <li>
                    Land Size:{" "}
                    {renderValue(property.specification.land_size) || "N/A"} m²
                  </li>
                  <li>
                    Building Size:{" "}
                    {renderValue(property.specification.building_size) || "N/A"}{" "}
                    m²
                  </li>
                  <li>
                    Bedrooms:{" "}
                    {renderValue(property.specification.bedroom) || "N/A"}
                  </li>
                  <li>
                    Bathrooms:{" "}
                    {renderValue(property.specification.bathroom) || "N/A"}
                  </li>
                  <li>
                    Floors:{" "}
                    {renderValue(property.specification.floors) || "N/A"}
                  </li>
                </>
              ) : (
                <li>No specifications available</li>
              )}
            </ul>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Facilities</h2>
            <ul>
              {property.facility ? (
                <>
                  <li>
                    Certificate:{" "}
                    {renderValue(property.facility.certificate) || "N/A"}
                  </li>
                  <li>
                    Electricity:{" "}
                    {renderValue(property.facility.electricity) || "N/A"} VA
                  </li>
                  <li>
                    Internet: {renderValue(property.facility.internet) || "N/A"}
                  </li>
                  <li>
                    Water Source:{" "}
                    {renderValue(property.facility.water_source) || "N/A"}
                  </li>
                </>
              ) : (
                <li>No facilities available</li>
              )}
            </ul>
          </div>
          <div>
            <h2 className="mb-2 text-xl font-semibold">Description</h2>
            <p>
              {renderValue(property.description) || "No description available"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleSection;
