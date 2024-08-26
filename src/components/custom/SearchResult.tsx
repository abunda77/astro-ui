import React, { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useOutsideClick } from "@/hooks/use-outside-click";
import debounce from "lodash/debounce";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Loader2 } from "lucide-react";
import { SearchIcon } from "lucide-react";

interface Property {
  id: number;
  title: string;
  short_desc: string;
  price: number;
  province: { name: string };
  district: { name: string };
  village: { name: string };
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
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const pageSize = 8;
  const urlendpoint = import.meta.env.PUBLIC_FASTAPI_ENDPOINT;
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useOutsideClick(suggestionsRef, () => setShowSuggestions(false));

  const fetchSuggestions = useCallback(
    debounce(async (term: string, location: string) => {
      if (term.length >= 3 || location.length >= 3) {
        try {
          const response = await fetch(
            `${urlendpoint}/properties/search/?keyword=${term}&location=${location}`
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
    fetchSuggestions(searchTerm, searchLocation);
  }, [searchTerm, searchLocation, fetchSuggestions]);

  const fetchProperties = useCallback(async () => {
    if (searchTerm.length >= 3 || searchLocation.length >= 3) {
      try {
        setLoading(true);
        setNoResults(false);
        const url = `${urlendpoint}/properties/search/?page=${currentPage}&size=${pageSize}&keyword=${searchTerm}&location=${searchLocation}`;
        const response = await fetch(url);
        console.log(response);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: PropertyResponse = await response.json();
        const sortedProperties = data.items.sort((a, b) => {
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        });
        if (sortedProperties.length === 0 && currentPage === 1) {
          setNoResults(true);
        }
        setProperties((prevProperties) => [
          ...prevProperties,
          ...sortedProperties,
        ]);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching properties:", error);
        setLoading(false);
        setNoResults(true);
      }
    }
  }, [currentPage, searchTerm, searchLocation, urlendpoint, pageSize]);

  const getImageUrl = (property: Property) => {
    const primaryImage = property.images.find((img) => img.is_primary);
    return primaryImage
      ? `${homedomain}/storage/${primaryImage.image_url}`
      : "images/home_fallback.png";
  };

  const handleLoadMore = () => {
    setCurrentPage((prevPage) => prevPage + 1);
    fetchProperties();
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
  };

  const handleClear = () => {
    setSearchTerm("");
    setSearchLocation("");
    setProperties([]);
    setNoResults(false);
    setCurrentPage(1);
  };

  return (
    <div className="container relative z-20 px-4 mx-auto sm:px-6 sm:-mt-[100px]">
      <div className="max-w-sm p-4 mx-auto bg-white rounded-lg shadow-lg sm:max-w-2xl sm:p-6">
        <h3 className="mb-3 text-lg font-semibold text-center text-gray-800 sm:text-3xl">
          Cari Property Idaman Kamu
        </h3>
        <div className="relative flex flex-col sm:flex-row">
          <input
            type="text"
            placeholder="Cari kata kunci atau lokasi (min. 3 karakter)"
            className="w-full h-10 px-3 py-1 mb-2 text-sm text-gray-700 bg-gray-300 border-gray-100 rounded-md dark:bg-gray-300 sm:mb-0 sm:rounded-r-none sm:text-base sm:px-4 sm:py-3"
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
          />
          <Button
            className="w-full px-4 py-2 text-sm font-medium text-gray-200 transition duration-300 bg-green-600 rounded-md dark:text-gray-100 dark:bg-green-700 sm:w-auto sm:rounded-l-none hover:bg-green-700 dark:hover:bg-green-600 sm:text-base sm:px-8 sm:py-3"
            onClick={handleSearch}
            disabled={loading}
          >
            {" "}
            <SearchIcon className="w-4 h-4 mr-1" />
            {loading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              "Search"
            )}
          </Button>
          <Button
            className="w-full px-4 py-2 mt-2 text-sm font-medium text-gray-700 transition duration-300 border border-gray-700 rounded-md dark:text-gray-100 sm:w-auto sm:mt-0 sm:ml-2 bg-gray-50 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-500 sm:text-base"
            onClick={handleClear}
          >
            Clear
          </Button>
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
        <div className="mt-2 text-xs text-center text-gray-600 sm:text-sm">
          Popular: Apartemen, Rumah, Villa, Tanah
        </div>
      </div>

      {/* Hasil Searching */}
      {properties.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold text-center text-gray-800 sm:text-xl">
            Hasil Pencarian
          </h3>
          <div className="flex flex-wrap justify-center p-4 ">
            {properties.map((property) => (
              <div
                className="w-full p-4 m-2 border border-gray-300 rounded-lg shadow-md sm:w-[calc(50%-1rem)] md:w-[calc(33.333%-1rem)] lg:w-[calc(25%-1rem)] xl:w-[calc(20%-1rem)] transition duration-300 ease-in-out hover:shadow-lg hover:border-blue-500 dark:border-gray-700 dark:hover:border-blue-400 dark:bg-gray-800"
                key={property.id}
              >
                <a href={`/post/${property.id}`}>
                  <div className="block">
                    <div className="overflow-hidden rounded-lg">
                      <img
                        src={getImageUrl(property)}
                        alt={property.title}
                        className="object-cover w-full h-40 transition duration-300 ease-in-out transform hover:scale-105"
                      />
                    </div>
                    <p className="mt-2 text-lg font-semibold text-gray-800 transition duration-300 ease-in-out dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400">
                      {property.title}
                    </p>
                    <p className="text-sm text-gray-500 transition duration-300 ease-in-out dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                      {property.address}
                    </p>
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
      {noResults && (
        <Alert
          variant="destructive"
          className="max-w-sm p-4 mx-auto bg-red-100 border-none shadow-lg sm:max-w-2xl sm:p-6"
        >
          <AlertCircle className="w-4 h-4" />
          <AlertTitle>Tidak Ditemukan</AlertTitle>
          <AlertDescription>
            Maaf, tidak ada hasil yang sesuai dengan pencarian Anda. Silakan
            coba kata kunci lain.
          </AlertDescription>
        </Alert>
      )}
      {loading && (
        <div className="mt-4 text-center">
          <p>Loading...</p>
        </div>
      )}
    </div>
  );
};

export default SearchResult;
