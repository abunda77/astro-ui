import React, { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useOutsideClick } from "@/hooks/use-outside-click";
import debounce from "lodash/debounce";

interface Property {
  id: number;
  title: string;
  short_desc: string;
  price: number;
  province: { name: string };
  district: { name: string };
  address: string;
  category_id: number;
  city: { name: string };
  user: { name: string };
  images: { image_url: string; is_primary: boolean }[];
  created_at: string;
}

interface PropertyResponse {
  items: Property[];
}

interface Suggestion {
  id: string;
  value: string;
}

const homedomain = import.meta.env.PUBLIC_HOME_DOMAIN;

const SearchResult: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const pageSize = 8;
  const urlendpoint = import.meta.env.PUBLIC_FASTAPI_ENDPOINT;
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useOutsideClick(suggestionsRef, () => setShowSuggestions(false));

  const fetchSuggestions = useCallback(
    debounce(async (term: string) => {
      if (term.length >= 3) {
        try {
          const response = await fetch(
            `${urlendpoint}/properties/search/?keyword=${term}`
          );
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setSuggestions(data);
          setShowSuggestions(true);
        } catch (error) {
          console.error("Error fetching suggestions:", error);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 1000),
    []
  );

  useEffect(() => {
    fetchSuggestions(searchTerm);
  }, [searchTerm, fetchSuggestions]);

  const fetchProperties = useCallback(async () => {
    if (searchTerm.length >= 3) {
      try {
        setLoading(true);
        const url = `${urlendpoint}/properties/search/?page=${currentPage}&size=${pageSize}&keyword=${searchTerm}`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: PropertyResponse = await response.json();
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
    }
  }, [currentPage, searchTerm]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const getImageUrl = (property: Property) => {
    const primaryImage = property.images.find((img) => img.is_primary);
    return primaryImage
      ? `${homedomain}/storage/${primaryImage.image_url}`
      : "images/home_fallback.png";
  };

  const handleLoadMore = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handleSearch = () => {
    if (searchTerm.length >= 3) {
      setCurrentPage(1);
      setProperties([]);
      fetchProperties();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
    setCurrentPage(1);
    setProperties([]);
    fetchProperties();
  };

  return (
    <div
      className="container relative z-20 px-4 mx-auto sm:px-6 headshot-generator-container"
      style={{ marginTop: "-50px" }}
    >
      <div className="max-w-sm p-4 mx-auto bg-white rounded-lg shadow-lg sm:max-w-none headshot-generator-card">
        <h3 className="mb-3 text-lg font-semibold text-center text-gray-800 sm:text-xl headshot-generator-title">
          Cari Property Idaman Kamu
        </h3>
        <div className="relative flex flex-col sm:flex-row">
          <input
            type="text"
            placeholder="Cari kata kunci atau lokasi (min. 3 karakter)"
            className="w-full px-3 py-2 mb-2 text-sm border-2 border-gray-300 rounded-md sm:mb-0 sm:rounded-r-none focus:outline-none focus:border-blue-500 headshot-generator-input"
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
          />
          <button
            className="w-full px-4 py-2 text-sm font-medium text-white transition duration-300 bg-blue-600 rounded-md sm:w-auto sm:rounded-l-none hover:bg-blue-700 headshot-generator-button"
            onClick={handleSearch}
          >
            Search
          </button>
          {showSuggestions && suggestions.length > 0 && (
            <div
              ref={suggestionsRef}
              className="absolute left-0 right-0 z-10 mt-1 bg-white border border-gray-300 rounded-md shadow-lg top-full"
            >
              {suggestions.map((suggestion) => (
                <div
                  key={suggestion.id}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSuggestionClick(suggestion.value)}
                >
                  {suggestion.value}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="mt-2 text-xs text-center text-gray-600 sm:text-sm headshot-generator-popular">
          Popular: Apartemen, Rumah, Villa, Tanah
        </div>
      </div>

      {searchTerm.length >= 3 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold text-center text-gray-800 sm:text-xl">
            Hasil Pencarian
          </h3>
          <div className="flex flex-wrap justify-center">
            {properties.map((property) => (
              <div
                className="w-full p-4 sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5"
                key={property.id}
              >
                <a href={`/post/${property.id}`}>
                  <div className="block">
                    <div className="overflow-hidden rounded-lg">
                      <img
                        src={getImageUrl(property)}
                        alt={property.title}
                        className="object-cover w-full h-40"
                      />
                    </div>
                    <p className="mt-2 text-lg font-semibold text-gray-800">
                      {property.title}
                    </p>
                    <p className="text-sm text-gray-500">{property.address}</p>
                  </div>
                </a>
              </div>
            ))}
          </div>
          {properties.length >= pageSize && (
            <div className="mt-4 text-center">
              <button
                className="px-4 py-2 text-sm font-medium text-white transition duration-300 bg-blue-600 rounded-md hover:bg-blue-700"
                onClick={handleLoadMore}
              >
                Load More
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchResult;
