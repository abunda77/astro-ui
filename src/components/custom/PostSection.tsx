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
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
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
  DropletCheck,
} from "iconoir-react";
import { Card, CardContent } from "@/components/ui/card";
import { createUniqueSlug } from "@/lib/utils";

interface Property {
  id: number;
  title: string;
  short_desc: string;
  price: number;
  province: { name: string };
  district: { name: string };
  category_id: number;
  city: { name: string };
  images: {
    image_url: string;
    remote_image_url: string | null;
    is_primary: boolean;
  }[];
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
      avatar: string | null;
      remote_url: string | null;
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
  const pageSize = 20;
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
      if (primaryImage.image_url) {
        let imageUrl = primaryImage.image_url.startsWith("/")
          ? primaryImage.image_url.substring(1)
          : primaryImage.image_url;
        imageUrl = imageUrl.replace(/[",/\\]/g, ""); // Menghapus karakter yang tidak diperlukan
        return `${homedomain}/storage/${imageUrl}`;
      } else if (primaryImage.remote_image_url) {
        return primaryImage.remote_image_url;
      }
    }
    return "images/home_fallback.png";
  };

  const handleLoadMore = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  if (loading && currentPage === 1) {
    return (
      <div className="flex items-center justify-center">
        <div className="skeleton">
          <Loader size="md" />
        </div>
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
    <section className="min-h-screen py-12 transition-colors duration-300">
      <div className="container px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between mb-8 md:flex-row">
          <h2 className="mb-4 text-lg font-bold text-gray-900 dark:text-white md:mb-0 sm:text-xl lg:text-2xl">
            Property Listing
          </h2>
          <div className="w-full md:w-64">
            <SelectPicker
              data={categories.map((category) => ({
                label: category.value,
                value: category.key.toString(),
              }))}
              value={selectedCategory?.toString() ?? ""}
              onChange={handleCategoryChange}
              style={{ width: "100%" }}
              searchable={false}
              placeholder="Pilih Kategori"
              className="bg-white dark:bg-gray-700"
              cleanable={false}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-5 xl:gap-6">
          {properties.map((property) => (
            <Card
              key={property.id}
              className="overflow-hidden transition-all duration-300 rounded-lg shadow-lg hover:shadow-2xl hover:border-blue-500 dark:hover:border-blue-300 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-600"
              style={{ aspectRatio: "1/1.8" }}
            >
              <div className="relative h-1/2">
                <img
                  src={getImageUrl(property)}
                  alt={property.title}
                  className="object-cover w-full h-full"
                />
                <Badge
                  className={`absolute top-1 left-1 sm:top-2 sm:left-2 ${
                    categories.find((cat) => cat.key === property.category_id)
                      ?.badgeColor || "bg-yellow-500"
                  } text-white text-[0.6rem] sm:text-[0.7rem] font-semibold px-1 py-0.5 sm:px-1.5 sm:py-0.5 rounded-full`}
                >
                  {
                    categories.find((cat) => cat.key === property.category_id)
                      ?.value
                  }
                </Badge>
              </div>
              <CardContent className="p-2 sm:p-3 lg:p-4 h-1/2">
                <div className="flex items-center justify-between mb-1 sm:mb-2">
                  <p className="text-xs font-bold text-gray-800 dark:text-gray-200 sm:text-sm lg:text-base">
                    <a
                      href={`/post/${createUniqueSlug(property.id, property.title)}`}
                      className="transition-colors duration-200 hover:text-blue-500"
                    >
                      Rp {formatPrice(property.price)}
                    </a>
                  </p>
                  <Badge
                    className={`${
                      property.ads === "sell"
                        ? "bg-yellow-200 dark:bg-yellow-800"
                        : "bg-green-200 dark:bg-green-800"
                    } text-yellow-800 dark:text-yellow-500 text-[0.6rem] sm:text-[0.7rem] font-semibold px-1 py-0.5 sm:px-1.5 sm:py-0.5 rounded-full hover:text-yellow-200 dark:hover:text-yellow-800`}
                  >
                    {property.ads === "sell" ? "Dijual" : "Disewakan"}
                  </Badge>
                </div>
                <h3 className="mb-1 text-[0.7rem] font-semibold text-gray-700 truncate dark:text-gray-200 sm:text-xs lg:text-sm">
                  <a
                    href={`/post/${createUniqueSlug(property.id, property.title)}`}
                    className="transition-colors duration-200 hover:text-blue-500"
                  >
                    {property.title}
                  </a>
                </h3>
                <p className="flex items-center mb-1 font-bold text-gray-500 text-[0.6rem] dark:text-gray-400 sm:text-[0.7rem] lg:text-xs">
                  <MapPin className="w-2 h-2 mr-1 sm:w-3 sm:h-3" />
                  {property.city.name}, {property.province.name}
                </p>
                <div className="flex items-center justify-between mb-1 sm:mb-2">
                  <div className="flex space-x-1 sm:space-x-2">
                    {property.facility?.internet && (
                      <Tooltip>
                        <Tooltip.Trigger as={IconButton} variant="ghost">
                          <Internet className="w-2 h-2 text-gray-500 transition-colors duration-200 dark:text-gray-400 hover:text-green-800 dark:hover:text-green-200 sm:w-3 sm:h-3 lg:w-4 lg:h-4" />
                        </Tooltip.Trigger>
                        <Tooltip.Content className="px-2 py-1 bg-gray-600 w-28 text-primary-foreground sm:w-32 sm:px-2 sm:py-1">
                          <Typography className="font-semibold text-[0.6rem] sm:text-[0.7rem]">
                            Internet
                          </Typography>
                          <Typography
                            type="small"
                            className="text-[0.6rem] opacity-90 sm:text-[0.7rem]"
                          >
                            {property.facility.internet}
                          </Typography>
                          <Tooltip.Arrow />
                        </Tooltip.Content>
                      </Tooltip>
                    )}
                    {property.facility?.line_phone && (
                      <Tooltip>
                        <Tooltip.Trigger as={IconButton} variant="ghost">
                          <Wifi className="w-2 h-2 text-gray-500 transition-colors duration-200 dark:text-gray-400 hover:text-green-800 dark:hover:text-green-200 sm:w-3 sm:h-3 lg:w-4 lg:h-4" />
                        </Tooltip.Trigger>
                        <Tooltip.Content className="px-2 py-1 w-28 text-primary-foreground sm:w-32 sm:px-2 sm:py-1">
                          <Typography className="font-semibold text-[0.6rem] sm:text-[0.7rem]">
                            Telepon
                          </Typography>
                          <Typography
                            type="small"
                            className="text-[0.6rem] opacity-90 sm:text-[0.7rem]"
                          >
                            {property.facility.line_phone}
                          </Typography>
                          <Tooltip.Arrow />
                        </Tooltip.Content>
                      </Tooltip>
                    )}
                    {property.facility?.electricity && (
                      <Tooltip>
                        <Tooltip.Trigger as={IconButton} variant="ghost">
                          <ElectronicsChip className="w-2 h-2 text-gray-500 transition-colors duration-200 dark:text-gray-400 hover:text-green-800 dark:hover:text-green-200 sm:w-3 sm:h-3 lg:w-4 lg:h-4" />
                        </Tooltip.Trigger>
                        <Tooltip.Content className="px-2 py-1 w-28 text-primary-foreground sm:w-32 sm:px-2 sm:py-1">
                          <Typography className="font-semibold text-[0.6rem] sm:text-[0.7rem]">
                            Listrik
                          </Typography>
                          <Typography
                            type="small"
                            className="text-[0.6rem] opacity-90 sm:text-[0.7rem]"
                          >
                            {property.facility.electricity} kWh
                          </Typography>
                          <Tooltip.Arrow />
                        </Tooltip.Content>
                      </Tooltip>
                    )}
                    {property.facility?.security && (
                      <Tooltip>
                        <Tooltip.Trigger as={IconButton} variant="ghost">
                          <SecurityPass className="w-2 h-2 text-gray-500 transition-colors duration-200 dark:text-gray-400 hover:text-green-800 dark:hover:text-green-200 sm:w-3 sm:h-3 lg:w-4 lg:h-4" />
                        </Tooltip.Trigger>
                        <Tooltip.Content className="px-2 py-1 w-28 text-primary-foreground sm:w-32 sm:px-2 sm:py-1">
                          <Typography className="font-semibold text-[0.6rem] sm:text-[0.7rem]">
                            Keamanan
                          </Typography>
                          <Typography
                            type="small"
                            className="text-[0.6rem] opacity-90 sm:text-[0.7rem]"
                          >
                            {property.facility.security}
                          </Typography>
                          <Tooltip.Arrow />
                        </Tooltip.Content>
                      </Tooltip>
                    )}
                    {property.facility?.water_source && (
                      <Tooltip>
                        <Tooltip.Trigger as={IconButton} variant="ghost">
                          <DropletCheck className="w-2 h-2 text-gray-500 transition-colors duration-200 dark:text-gray-400 hover:text-green-800 dark:hover:text-green-200 sm:w-3 sm:h-3 lg:w-4 lg:h-4" />
                        </Tooltip.Trigger>
                        <Tooltip.Content className="px-2 py-1 w-28 text-primary-foreground sm:w-32 sm:px-2 sm:py-1">
                          <Typography className="font-semibold text-[0.6rem] sm:text-[0.7rem]">
                            Sumber Air
                          </Typography>
                          <Typography
                            type="small"
                            className="text-[0.6rem] opacity-90 sm:text-[0.7rem]"
                          >
                            {property.facility.water_source}
                          </Typography>
                          <Tooltip.Arrow />
                        </Tooltip.Content>
                      </Tooltip>
                    )}
                  </div>
                </div>

                <div className="flex items-center mt-1 sm:mt-2">
                  <Avatar className="w-3 h-3 mr-1 sm:w-4 sm:h-4 sm:mr-1 lg:w-6 lg:h-6 lg:mr-2">
                    <AvatarImage
                      src={
                        property.user?.profile?.avatar
                          ? `${homedomain}/storage/${property.user.profile.avatar}`
                          : "images/avatar-fallback.gif"
                      }
                      alt={property.user?.profile?.first_name}
                    />
                    <AvatarFallback className="bg-indigo-300 rounded-full text-[0.5rem] sm:text-[0.6rem]">
                      {property.user?.profile?.first_name?.[0]}
                      {property.user?.profile?.last_name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  {property.user?.profile?.company_name && (
                    <Typography className="font-semibold text-[0.6rem] sm:text-[0.7rem] lg:text-xs">
                      {property.user?.profile?.company_name ||
                        `${property.user?.profile?.first_name} ${property.user?.profile?.last_name}`}
                    </Typography>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {showNoDataAlert && (
          <Alert
            variant="destructive"
            className="max-w-sm p-3 mx-auto mt-4 bg-red-100 border-none shadow-lg sm:max-w-2xl sm:p-4 md:p-6 md:mt-6"
          >
            <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
            <AlertTitle className="text-sm sm:text-base">Oops...!</AlertTitle>
            <AlertDescription className="text-xs sm:text-sm">
              Maaf, sudah tidak ada data lagi yang tersedia.
            </AlertDescription>
          </Alert>
        )}
        <div className="flex justify-center mt-4 md:mt-6">
          <Button
            className="text-xs bg-gray-300 hover:bg-gray-100 text-foreground dark:text-background sm:text-sm"
            onClick={handleLoadMore}
            disabled={loading || showNoDataAlert}
          >
            {loading ? (
              <Loader2 className="w-3 h-3 animate-spin sm:w-4 sm:h-4" />
            ) : (
              "Load More"
            )}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PostSection;
