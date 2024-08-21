import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowDownIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Property {
  id: number;
  title: string;
  short_desc: string;
  price: number;
  province: { name: string };
  district: { name: string };
  city: { name: string };
  user: { name: string };
  images: { image_url: string; is_primary: boolean }[];
  created_at: string;
}

interface PropertyResponse {
  items: Property[];
}

const homedomain = import.meta.env.PUBLIC_HOME_DOMAIN;

const PostSection: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 4;
  const urlendpoint = import.meta.env.PUBLIC_FASTAPI_ENDPOINT;

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `${urlendpoint}/properties/?page=${currentPage}&size=${pageSize}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: PropertyResponse = await response.json();

        // Urutkan data berdasarkan created_at (terbaru ke terlama)
        const sortedProperties = data.items.sort((a, b) => {
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        });

        setProperties((prevProperties) => [
          ...prevProperties,
          ...sortedProperties,
        ]);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching properties:", error);
        setLoading(false);
      }
    };

    fetchProperties();
  }, [currentPage]);

  const getImageUrl = (property: Property) => {
    const primaryImage = property.images.find((img) => img.is_primary);

    return primaryImage
      ? `${homedomain}/storage/${primaryImage.image_url}`
      : "images/home_fallback.png";
  };

  const handleLoadMore = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  if (loading && currentPage === 1) {
    return (
      <div className="skeleton">
        <Skeleton className="w-[100px] h-[20px] rounded-md" />
      </div>
    );
  }

  return (
    <section className="text-gray-800 bg-gray-100 dark:bg-gray-800 dark:text-gray-100">
      <div className="container max-w-6xl p-6 mx-auto space-y-6 sm:space-y-12">
        {properties.length > 0 && (
          <a
            rel="noopener noreferrer"
            href={`/post/${properties[0].id}`}
            className="block max-w-sm gap-3 mx-auto bg-gray-50 sm:max-w-full group hover:no-underline focus:no-underline lg:grid lg:grid-cols-12 dark:bg-gray-900"
          >
            <img
              src={getImageUrl(properties[0])}
              alt={properties[0].title}
              className="object-cover w-full h-64 bg-gray-500 rounded sm:h-96 lg:col-span-7 dark:bg-gray-500"
            />
            <div className="p-6 space-y-2 lg:col-span-5">
              <h3 className="text-2xl font-semibold sm:text-4xl group-hover:underline group-focus:underline">
                {properties[0].title}
              </h3>
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {`${properties[0].province.name}, ${properties[0].district.name}, ${properties[0].city.name}`}
              </span>
              <p>{properties[0].short_desc}</p>
              <p> Created at : {properties[0].created_at}</p>
              <p>Post by: {properties[0].user.name}</p>
              <p className="font-bold">
                Price: Rp {properties[0].price.toLocaleString()}
              </p>
            </div>
          </a>
        )}
        <div className="grid justify-center grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {properties.slice(1).map((property, index) => (
            <a
              key={index}
              href={`/post/${property.id}`}
              className="max-w-sm mx-auto bg-gray-50 group hover:no-underline focus:no-underline dark:bg-gray-900"
            >
              <img
                role="presentation"
                className="object-cover w-full bg-gray-500 rounded h-44 dark:bg-gray-500"
                src={getImageUrl(property)}
                alt={property.title}
              />
              <div className="p-6 space-y-2">
                <h3 className="text-2xl font-semibold group-hover:underline group-focus:underline">
                  {property.title}
                </h3>
                <p> Created at : {property.created_at}</p>
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  {`${property.province.name}, ${property.district.name}, ${property.city.name}`}
                </span>
                <p>{property.short_desc}</p>
                <p>Post by: {property.user.name}</p>
                <p className="font-bold">
                  Price: Rp {property.price.toLocaleString()}
                </p>
              </div>
            </a>
          ))}
        </div>
        <div className="flex justify-center">
          <Button
            onClick={handleLoadMore}
            variant="outline"
            size="default"
            className="flex items-center px-6 py-3 text-sm text-gray-600 bg-gray-300 rounded-md hover:underline dark:bg-gray-900 dark:text-gray-400 animate-bounce"
            disabled={loading}
          >
            <span className="mr-2">
              {loading ? "Loading..." : "Load more properties..."}
            </span>
            <ArrowDownIcon className="w-5 h-5 animate-bounce" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PostSection;
