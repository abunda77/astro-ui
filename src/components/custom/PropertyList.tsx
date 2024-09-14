import React from "react";
import PropertyCard from "@/components/custom/PropertyCard";

interface Property {
  id: number | null;
  title: string | null;
  short_desc: string | null;
  price: number | null;
  address: string | null;
  images: {
    image_url: string;
    is_primary: boolean;
  }[];
}

interface PropertyListProps {
  properties: Property[];
}

const PropertyList: React.FC<PropertyListProps> = ({ properties }) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="mb-4 text-xl font-semibold">Daftar Properti</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </div>
  );
};

export default PropertyList;
