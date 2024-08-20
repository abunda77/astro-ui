import React, { useState, useEffect } from "react";

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
}

interface PropertyResponse {
  items: Property[];
}

const homedomain = import.meta.env.PUBLIC_HOME_DOMAIN;

const PostSection: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const urlendpoint = import.meta.env.PUBLIC_FASTAPI_ENDPOINT;
  console.log("PostSection loaded: ", urlendpoint);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        console.log("Fetching properties from API...");

        const response = await fetch(
          `${urlendpoint}/properties/?page=1&size=10`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        console.log("Response received, parsing JSON...");
        const data: PropertyResponse = await response.json();
        console.log("Properties fetched successfully.");
        setProperties(data.items);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching properties:", error);
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const getImageUrl = (property: Property) => {
    const primaryImage = property.images.find((img) => img.is_primary);

    return primaryImage
      ? `${homedomain}/storage/${primaryImage.image_url}`
      : "images/home_fallback.png";
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <section className="text-gray-100 bg-gray-800 dark:bg-gray-100 dark:text-gray-800">
      <div className="container max-w-6xl p-6 mx-auto space-y-6 sm:space-y-12">
        {properties.length > 0 && (
          <a
            rel="noopener noreferrer"
            // href={`${urlendpoint}/properties/${properties[0].id}`}
            href={`/post/${properties[0].id}`}
            className="block max-w-sm gap-3 mx-auto bg-gray-900 sm:max-w-full group hover:no-underline focus:no-underline lg:grid lg:grid-cols-12 dark:bg-gray-50"
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
              <span className="text-xs text-gray-400 dark:text-gray-600">
                {`${properties[0].province.name}, ${properties[0].district.name}, ${properties[0].city.name}`}
              </span>
              <p>{properties[0].short_desc}</p>
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
              //   rel="noopener noreferrer"
              //   href={`${urlendpoint}/properties/${properties[1].id}`}
              //   href={`/post/${property.title}/${property.id}`}
              href={`/post/${property.id}`}
              className="max-w-sm mx-auto bg-gray-900 group hover:no-underline focus:no-underline dark:bg-gray-50"
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
                <span className="text-xs text-gray-400 dark:text-gray-600">
                  {`${property.province.name}, ${property.district.name}, ${property.city.name}`}
                </span>
                <p>{property.short_desc}</p>
                <p>Post by: {properties[0].user.name}</p>
                <p className="font-bold">
                  Price: Rp {property.price.toLocaleString()}
                </p>
              </div>
            </a>
          ))}
        </div>
        <div className="flex justify-center">
          <button
            type="button"
            className="px-6 py-3 text-sm text-gray-400 bg-gray-900 rounded-md hover:underline dark:bg-gray-50 dark:text-gray-600"
          >
            Load more properties...
          </button>
        </div>
      </div>
    </section>
  );
};

export default PostSection;
