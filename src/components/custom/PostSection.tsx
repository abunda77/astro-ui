import React, { useState, useEffect, useId, useRef } from "react";
// import globals.css
// import "@/styles/globals.css";
// import { Button } from "@/components/ui/button";
import { ArrowDownIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useOutsideClick } from "@/hooks/use-outside-click";
import { SelectPicker, Stack } from "rsuite";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Loader2 } from "lucide-react";
import { CloseIcon } from "@/components/custom/CloseIcon";
import { Loader, Placeholder } from "rsuite";
import "rsuite/dist/rsuite-no-reset.min.css";
import { MapPin, Banknote, House, CalendarDays } from "lucide-react";
import {
  Typography,
  IconButton,
  Button,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@material-tailwind/react";
import {
  HeartSolid,
  StarSolid,
  Cash,
  Wifi,
  HomeSimple,
  ModernTv,
  ElectronicsChip,
  SecurityPass,
  Internet,
  FireFlame,
  HomeAltSlim,
} from "iconoir-react";
import { Card, CardContent } from "@/components/ui/card";

interface Property {
  id: number;
  title: string;
  short_desc: string;
  price: number;
  province: { name: string };
  district: { name: string };
  category_id: number;
  city: { name: string };
  images: { image_url: string; is_primary: boolean }[];
  created_at: string;
  ads: string;
  status: string;
  user: {
    profile: {
      first_name: string;
      last_name: string;
      phone: string;
      email: string;
      whatsapp: string | null;
      company_name: string;
      avatar: string;
      biodata_company: string | null;
      jobdesk: string | null;
    };
  };
  facility: {
    certificate: string;
    electricity: number;
    line_phone: string;
    internet: string;
    road_width: string;
    water_source: string;
    hook: string;
    condition: string;
    security: string;
    wastafel: string;
  };
}

interface PropertyResponse {
  items: Property[];
}

const homedomain = import.meta.env.PUBLIC_HOME_DOMAIN;

const PostSection: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;
  const urlendpoint = import.meta.env.PUBLIC_FASTAPI_ENDPOINT;
  const [active, setActive] = useState<Property | boolean | null>(null);
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);
  const [showNoDataAlert, setShowNoDataAlert] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const handleCategoryChange = (
    value: string | null,
    event: React.SyntheticEvent
  ) => {
    setSelectedCategory(value ? Number(value) : null);
    setCurrentPage(1);
    setProperties([]);
  };

  const categories = [
    { key: 0, value: "All" },
    {
      key: 11,
      value: "Home",
      badgeColor: "bg-blue-500 dark:bg-blue-400 rounded-lg p-2 border-none",
    },
    {
      key: 12,
      value: "Apartment",
      badgeColor: "bg-red-500 dark:bg-red-400 rounded-lg p-2 border-none",
    },
    {
      key: 13,
      value: "Kavling",
      badgeColor: "bg-yellow-500 dark:bg-yellow-400 rounded-lg p-2 border-none",
    },
    {
      key: 14,
      value: "Office",
      badgeColor: "bg-purple-500 dark:bg-purple-400 rounded-lg p-2 border-none",
    },
    {
      key: 15,
      value: "Warehouse",
      badgeColor: "bg-green-500 dark:bg-green-400 rounded-lg p-2 border-none",
    },
  ];
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        let url;
        if (selectedCategory !== null && selectedCategory !== 0) {
          url = `${urlendpoint}/properties/search/?category=${selectedCategory}&page=${currentPage}&size=${pageSize}`;
        } else {
          url = `${urlendpoint}/properties/?page=${currentPage}&size=${pageSize}`;
        }

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: PropertyResponse = await response.json();

        if (data.items.length === 0) {
          setShowNoDataAlert(true);
        } else {
          setShowNoDataAlert(false);
          const sortedProperties = data.items.sort((a, b) => {
            return (
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
            );
          });
          setProperties((prevProperties) => [
            ...prevProperties,
            ...sortedProperties,
          ]);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching properties:", error);
        setLoading(false);
        setShowNoDataAlert(true);
      }
    };
    fetchProperties();
  }, [currentPage, selectedCategory, urlendpoint, pageSize]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActive(false);
      }
    }
    if (active && typeof active === "object") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  const getImageUrl = (property: Property) => {
    const primaryImage = property.images.find((img) => img.is_primary);
    if (primaryImage) {
      let imageUrl = primaryImage.image_url.startsWith("/")
        ? primaryImage.image_url.substring(1)
        : primaryImage.image_url;
      imageUrl = imageUrl.replace(/[",/\\]/g, ""); // Menghapus karakter yang tidak diperlukan
      return `${homedomain}/storage/${imageUrl}`;
    }
    return "images/home_fallback.png";
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
  function formatPrice(price: number): string {
    if (price >= 1000000000) {
      return (
        (price / 1000000000).toLocaleString("id-ID", {
          maximumFractionDigits: 3,
        }) + " Milyar"
      );
    } else if (price >= 1000000) {
      return (
        (price / 1000000).toLocaleString("id-ID", {
          maximumFractionDigits: 0,
        }) + " Juta"
      );
    } else {
      return price.toLocaleString("id-ID");
    }
  }
  return (
    <section className="text-gray-800 bg-gradient-to-b from-white via-blue-50 to-blue-100 dark:from-white dark:via-gray-50 dark:to-gray-300">
      <div className="container max-w-6xl p-6 mx-auto space-y-6 sm:space-y-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">Property Listings</h2>
          <div className="w-48">
            <label
              htmlFor="category"
              className="block mb-1 text-sm font-medium text-gray-700"
            >
              Filter by Category
            </label>
            <Stack
              spacing={10}
              direction="column"
              alignItems="flex-start"
              className="bg-gray-100"
            >
              <SelectPicker
                data={categories.map((category) => ({
                  label: category.value,
                  value: category.key.toString(),
                }))}
                value={selectedCategory?.toString() ?? ""}
                onChange={handleCategoryChange}
                style={{ width: 224 }}
                searchable={false}
                placeholder="Select a category"
                className="bg-gray-300"
                appearance="subtle"
              />
            </Stack>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {properties.map((property) => (
            <Card
              key={property.id}
              className="transition-transform transform bg-white shadow-lg hover:scale-105 dark:bg-gray-900"
            >
              <div className="relative">
                <img
                  src={getImageUrl(property)}
                  alt={property.title}
                  className="object-cover w-full h-48"
                  width="350"
                  height="200"
                  style={{ aspectRatio: "350/200", objectFit: "cover" }}
                />
                <Badge
                  className={`absolute top-2 left-2 ${categories.find((cat) => cat.key === property.category_id)?.badgeColor || "bg-yellow-500"} text-white`}
                >
                  {
                    categories.find((cat) => cat.key === property.category_id)
                      ?.value
                  }
                </Badge>
              </div>
              <CardContent>
                <h2 className="text-lg font-semibold text-left text-gray-800 dark:text-gray-200">
                  {property.title}
                </h2>
                <p className="text-sm text-left text-gray-500 dark:text-gray-400">
                  <MapPin className="inline-block w-4 h-4 mr-1" />{" "}
                  {property.city.name}, {property.province.name}
                </p>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex space-x-2 text-gray-500 dark:text-gray-400">
                    <Tooltip>
                      <TooltipTrigger>
                        <Internet className="w-4 h-4" />
                      </TooltipTrigger>
                      <TooltipContent>
                        {property.facility?.internet}
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger>
                        <Wifi className="w-4 h-4" />
                      </TooltipTrigger>
                      <TooltipContent>
                        {property.facility?.line_phone}
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger>
                        <ElectronicsChip className="w-4 h-4" />
                      </TooltipTrigger>
                      <TooltipContent>
                        {property.facility?.electricity} kWh
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger>
                        <SecurityPass className="w-4 h-4" />
                      </TooltipTrigger>
                      <TooltipContent>
                        {property.facility?.security}
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <p className="text-base font-semibold text-right text-green-600 dark:text-green-400">
                    Rp. {formatPrice(property.price)}
                  </p>
                </div>
                <Button
                  className="w-full mt-4 text-white bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-500 dark:hover:bg-yellow-600"
                  onClick={() =>
                    (window.location.href = `/post/${property.id}`)
                  }
                >
                  Detail
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        {showNoDataAlert && (
          <Alert
            variant="destructive"
            className="max-w-sm p-4 mx-auto mt-6 bg-red-100 border-none shadow-lg sm:max-w-2xl sm:p-6"
          >
            <AlertCircle className="w-4 h-4" />
            <AlertTitle>Oops...!</AlertTitle>
            <AlertDescription>
              Maaf, sudah tidak ada data lagi yang tersedia.
            </AlertDescription>
          </Alert>
        )}
        <div className="flex justify-center mt-6">
          <Button
            className="bg-gray-300 hover:bg-gray-100 text-foreground dark:text-background"
            onClick={handleLoadMore}
            disabled={loading || showNoDataAlert}
          >
            {loading ? <Loader2 className="animate-spin" /> : "Load More"}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PostSection;
