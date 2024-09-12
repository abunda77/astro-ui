import React, { useState, useEffect, useRef, useCallback } from "react";

import { Button, Spinner } from "@material-tailwind/react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useOutsideClick } from "@/hooks/use-outside-click";
import debounce from "lodash/debounce";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { X, Loader2 } from "lucide-react";
import {
  SearchIcon,
  ALargeSmall,
  LocateIcon,
  Check,
  Clock,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Highlight } from "rsuite";

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

  const customerLogos3 = [
    { name: "BJB", logo: "images/bjb.webp" },
    { name: "mega", logo: "images/bankmega.webp" },
    { name: "Bca", logo: "images/bca.webp" },
    { name: "bcasyariah", logo: "images/bcasyariah.webp" },
    { name: "bni", logo: "images/bni.webp" },
    { name: "cimb", logo: "images/cimb.webp" },
    { name: "danamon", logo: "images/danamon.webp" },
    { name: "icbc", logo: "images/icbc.webp" },
    { name: "mandiri", logo: "images/mandiri.webp" },
    { name: "maybank", logo: "images/maybank.webp" },
    { name: "muamalat", logo: "images/muamalat.webp" },
    { name: "ocbc", logo: "images/ocbc.webp" },
    { name: "panin", logo: "images/panin.webp" },
    { name: "permata", logo: "images/permata.webp" },
    { name: "uob", logo: "images/uob.webp" },
    // { name: "NEW YORK POST", logo: "images/newyorktime.png" },
  ];

  const customerLogos = [
    { name: "Agung Podomoro", logo: "images/agungpodomoro.webp" },

    { name: "Damai Putra", logo: "images/damaiputra.webp" },
    { name: "Duta Putra Land", logo: "images/dutaputraland.webp" },
    { name: "Sinarmas", logo: "images/sinarmas.webp" },
    { name: "Summarecon", logo: "images/summarecon.webp" },
  ];

  const customerLogos2 = [
    { name: "Kompas", logo: "images/kompas.png" },
    { name: "Media Indonesia", logo: "images/mediaindonesia.png" },
    { name: "RealEstate", logo: "images/realestate.webp" },
    { name: "Seputar Indonesia", logo: "images/seputarindonesia.webp" },
    { name: "Tech In Asia", logo: "images/techinasia.png" },
    { name: "WarnerMedia", logo: "images/warnermedia.png" },
  ];

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
    if (primaryImage) {
      let imageUrl = primaryImage.image_url.startsWith("/")
        ? primaryImage.image_url.substring(1)
        : primaryImage.image_url;
      imageUrl = imageUrl.replace(/[",/\\]/g, ""); // Menghapus karakter yang tidak diperlukan
      return `${homedomain}/storage/${imageUrl}`;
    } else {
      return "images/home_fallback.png";
    }
  };

  const handleLoadMore = () => {
    setCurrentPage((prevPage) => prevPage + 1);
    fetchProperties();
  };

  const handleSearch = () => {
    if (searchTerm.length >= 3 || searchLocation.length >= 3) {
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
    setCurrentPage(1);
    setNoResults(false);
  };

  return (
    <div className="container relative z-20 px-4 mx-auto sm:px-6 sm:-mt-[100px]">
      <div className="max-w-sm p-4 mx-auto bg-white rounded-lg shadow-lg dark:bg-gray-700 sm:max-w-2xl sm:p-6">
        <h3 className="mb-3 text-lg font-semibold text-center text-gray-800 dark:text-gray-200 sm:text-3xl">
          <Highlight
            query={["Idaman Kamu"]}
            renderMark={(match, index) => (
              <mark
                key={index}
                className="italic text-gray-800 bg-yellow-200 roboto-font dark:bg-gray-100 dark:text-red-700"
              >
                {match}
              </mark>
            )}
          >
            Cari Property Idaman Kamu
          </Highlight>
        </h3>
        <div className="relative flex flex-col sm:flex-row">
          <Tabs defaultValue="keyword" className="w-full">
            <TabsList className="grid justify-center w-full grid-cols-2 border-gray-800 border-1 dark:border-gray-100 dark:bg-gray-600">
              <TabsTrigger
                value="keyword"
                className="data-[state=active]:bg-yellow-500 dark:data-[state=active]:bg-yellow-500"
              >
                <ALargeSmall className="mr-1" />
                Keyword
              </TabsTrigger>
              <TabsTrigger
                value="location"
                className="data-[state=active]:bg-yellow-500 dark:data-[state=active]:bg-yellow-500"
              >
                <LocateIcon className="mr-1" />
                Location
              </TabsTrigger>
            </TabsList>
            <TabsContent value="keyword">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Cari kata kunci (min. 3 karakter)"
                  className="w-full h-10 py-1 pl-10 pr-3 mb-2 text-sm text-gray-700 bg-gray-300 border-gray-100 rounded-md dark:bg-gray-300 sm:mb-0 sm:rounded-r-none sm:text-base sm:px-10 sm:py-3"
                  onChange={(e) => setSearchTerm(e.target.value)}
                  value={searchTerm}
                />
                <SearchIcon className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                <Badge
                  onClick={handleClear}
                  variant={"secondary"}
                  className="absolute p-1 transform -translate-y-1/2 rounded-md cursor-pointer right-3 top-1/2 "
                >
                  Reset
                </Badge>
                <Badge
                  onClick={handleClear}
                  variant={"secondary"}
                  className="absolute p-1 transform -translate-y-1/2 rounded-md cursor-pointer right-3 top-1/2 "
                >
                  Reset
                </Badge>
              </div>
            </TabsContent>
            <TabsContent value="location">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Lokasi (min. 3 karakter)"
                  className="w-full h-10 py-1 pl-10 pr-10 mb-2 text-sm text-gray-700 bg-gray-300 border-gray-100 rounded-md dark:bg-gray-300 sm:mb-0 sm:rounded-r-none sm:text-base sm:px-10 sm:py-3"
                  onChange={(e) => setSearchLocation(e.target.value)}
                  value={searchLocation}
                />
                <SearchIcon className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                <Badge
                  onClick={handleClear}
                  variant={"secondary"}
                  className="absolute p-1 transform -translate-y-1/2 rounded-md cursor-pointer right-3 top-1/2 "
                >
                  Reset
                </Badge>
              </div>
            </TabsContent>
          </Tabs>
          <div className="flex flex-col sm:mt-10 sm:flex-row sm:items-center">
            <Button
              variant="gradient"
              color="success"
              size="sm"
              className="w-full text-sm font-medium text-gray-200 transition duration-300 rounded-md hover:bg-green-800 sm:w-auto sm:rounded-l-none sm:text-base sm:px-8 sm:py-2 sm:mt-2 sm:ml-2"
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
          </div>

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
        <div className="mt-2 text-xs text-center text-gray-600 dark:text-gray-200 sm:text-sm">
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
      {/* Customer logos */}
      {properties.length === 0 && !loading && !noResults && (
        <div className="flex flex-col items-center mt-8 mb-12">
          <p className="mb-12 text-2xl text-gray-500 dark:text-gray-400">
            As Seen on{" "}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8">
            {customerLogos2.map((customer) => (
              <div
                key={customer.name}
                className="flex items-center justify-center p-4 transition-shadow duration-300 bg-white rounded-lg shadow-md dark:bg-gray-300 hover:shadow-2xl dark:shadow-gray-700 dark:hover:shadow-gray-500"
              >
                {loading ? (
                  <Skeleton className="w-auto h-10 animate-pulse" />
                ) : (
                  <img
                    src={customer.logo}
                    alt={`${customer.name} logo`}
                    className="object-contain w-auto h-10"
                    loading="lazy"
                  />
                )}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-8 mt-8 md:grid-cols-3">
            <div>
              <h3 className="mb-4 text-lg font-semibold text-start dark:text-gray-200">
                Mengapa Memilih bosqproperti.Com?
              </h3>
              <ul className="space-y-2">
                {[
                  "Database properti terlengkap",
                  "Tim agen profesional berpengalaman",
                  "Antarmuka website user-friendly",
                  "Transaksi aman dan transparan",
                  "Layanan pelanggan 24/7",
                ].map((item) => (
                  <li key={item} className="flex items-center">
                    <Check className="mr-2 text-green-500" size={20} />
                    <span className="dark:text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="mb-4 text-lg font-semibold text-start dark:text-gray-200">
                Setiap Listing di BosqueProperti.Com Meliputi:
              </h3>
              <ul className="space-y-2">
                {[
                  "Foto-foto berkualitas tinggi dari berbagai sudut",
                  "Tur virtual 360 derajat ",
                  "Deskripsi properti yang detail dan informatif",
                  "Informasi lengkap mengenai fasilitas",
                  "Peta lokasi yang akurat dan interaktif",
                ].map((item) => (
                  <li key={item} className="flex items-center">
                    <Check className="mr-2 text-green-500" size={20} />
                    <span className="dark:text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="mb-4 text-lg font-semibold text-center dark:text-gray-200">
                Keuntungan Pemasaran di BosqueProperti.Com:
              </h3>
              <ul className="space-y-2">
                {[
                  "Target pasar luas",
                  "Visibilitas online maksimal",
                  "Laporan kinerja real-time",
                  "Dukungan materi kreatif",
                  "Fitur unggulan prioritas",
                ].map((item) => (
                  <li key={item} className="flex items-center">
                    <Check className="mr-2 text-green-500" size={20} />
                    <span className="dark:text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-12 text-center">
            <h2 className="mb-4 text-2xl font-semibold dark:text-gray-200">
              Testimoni & Pencapaian Kami
            </h2>
            <div className="text-4xl font-bold text-blue-500 dark:text-blue-400">
              1,234,567
            </div>
            <div className="text-3xl dark:text-gray-300">
              Properti Terjual Melalui Platform Kami
            </div>
            <div className="mt-2 text-4xl dark:text-gray-300">
              dengan{" "}
              <span className="font-bold text-green-500 dark:text-green-400">
                98.7%
              </span>{" "}
              Tingkat Kepuasan Pelanggan!
            </div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Bergabunglah dengan ribuan pemilik properti yang telah sukses.
              Lihat contoh properti yang telah terjual dan testimoni pelanggan
              kami.
            </p>
          </div>
          <div className="container px-4 py-16 mx-auto">
            {/* Mitra Pengembang Section */}
            <section className="mb-20">
              <h2 className="mb-10 text-4xl font-bold text-center text-gray-600 md:text-5xl dark:text-gray-300">
                Mitra Pengembang
              </h2>
              <div className="flex flex-wrap items-center justify-center gap-8">
                {customerLogos.map((customer) => (
                  <div
                    key={customer.name}
                    className="flex items-center justify-center p-4 transition-shadow duration-300 bg-white rounded-lg shadow-md dark:bg-gray-300 hover:shadow-2xl dark:shadow-gray-700 dark:hover:shadow-gray-500"
                  >
                    <img
                      src={customer.logo}
                      alt={`${customer.name} logo`}
                      className="object-contain w-auto h-10 "
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </section>

            {/* Mitra Perbankan Section */}
            <section>
              <h2 className="mb-10 text-4xl font-bold text-center text-gray-600 md:text-5xl dark:text-gray-300">
                Mitra Perbankan
              </h2>
              <div className="flex flex-wrap items-center justify-center gap-6">
                {customerLogos3.map((customer) => (
                  <div
                    key={customer.name}
                    className="flex items-center justify-center p-4 transition-shadow duration-300 bg-white rounded-lg shadow-md dark:bg-gray-300 hover:shadow-2xl dark:shadow-gray-700 dark:hover:shadow-gray-500"
                  >
                    <img
                      src={customer.logo}
                      alt={`${customer.name} logo`}
                      className="object-contain w-auto h-6"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchResult;
