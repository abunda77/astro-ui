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
    <section className="min-h-screen py-12 transition-colors duration-300 ">
      {/* class="min-h-screen transition-colors duration-300 bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-400 dark:from-gray-900 dark:via-gray-700 dark:to-purple-900" */}
      <div className="container px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between mb-8 md:flex-row">
          <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white md:mb-0">
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

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {properties.map((property) => (
            <Card
              key={property.id}
              className="overflow-hidden transition-all duration-300 rounded-lg shadow-lg hover:shadow-2xl hover:border-blue-500 dark:hover:border-blue-300 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-600"
            >
              <div className="relative">
                <img
                  src={getImageUrl(property)}
                  alt={property.title}
                  className="object-cover w-full h-56"
                />
                <Badge
                  className={`absolute top-2 left-2 ${
                    categories.find((cat) => cat.key === property.category_id)
                      ?.badgeColor || "bg-yellow-500"
                  } text-white text-xs font-semibold px-2 py-1 rounded-full`}
                >
                  {
                    categories.find((cat) => cat.key === property.category_id)
                      ?.value
                  }
                </Badge>
              </div>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">
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
                    } text-yellow-800 dark:text-yellow-500 text-xs font-semibold px-2 py-1 rounded-full hover:text-yellow-200 dark:hover:text-yellow-800`}
                  >
                    {property.ads === "sell" ? "Dijual" : "Disewakan"}
                  </Badge>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-700 truncate dark:text-gray-200">
                  <a
                    href={`/post/${createUniqueSlug(property.id, property.title)}`}
                    className="transition-colors duration-200 hover:text-blue-500"
                  >
                    {property.title}
                  </a>
                </h3>
                <p className="flex items-center mb-4 text-sm font-bold text-gray-500 dark:text-gray-400">
                  <MapPin className="w-4 h-4 mr-1" />
                  {property.city.name}, {property.province.name}
                </p>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex space-x-2">
                    {property.facility?.internet && (
                      <Tooltip>
                        <Tooltip.Trigger as={IconButton} variant="ghost">
                          <Internet className="w-5 h-5 text-gray-500 transition-colors duration-200 dark:text-gray-400 hover:text-green-800 dark:hover:text-green-200" />
                        </Tooltip.Trigger>
                        <Tooltip.Content className="w-40 px-2.5 py-1.5 text-primary-foreground bg-gray-600">
                          <Typography className="text-xs font-semibold">
                            Internet
                          </Typography>
                          <Typography type="small" className="opacity-90">
                            {property.facility.internet}
                          </Typography>
                          <Tooltip.Arrow />
                        </Tooltip.Content>
                      </Tooltip>
                    )}
                    {property.facility?.line_phone && (
                      <Tooltip>
                        <Tooltip.Trigger as={IconButton} variant="ghost">
                          <Wifi className="w-5 h-5 text-gray-500 transition-colors duration-200 dark:text-gray-400 hover:text-green-800 dark:hover:text-green-200" />
                        </Tooltip.Trigger>
                        <Tooltip.Content className="w-40 px-2.5 py-1.5 text-primary-foreground">
                          <Typography className="text-xs font-semibold">
                            Telepon
                          </Typography>
                          <Typography type="small" className="opacity-90">
                            {property.facility.line_phone}
                          </Typography>
                          <Tooltip.Arrow />
                        </Tooltip.Content>
                      </Tooltip>
                    )}
                    {property.facility?.electricity && (
                      <Tooltip>
                        <Tooltip.Trigger as={IconButton} variant="ghost">
                          <ElectronicsChip className="w-5 h-5 text-gray-500 transition-colors duration-200 dark:text-gray-400 hover:text-green-800 dark:hover:text-green-200" />
                        </Tooltip.Trigger>
                        <Tooltip.Content className="w-40 px-2.5 py-1.5 text-primary-foreground">
                          <Typography className="text-xs font-semibold">
                            Listrik
                          </Typography>
                          <Typography type="small" className="opacity-90">
                            {property.facility.electricity} kWh
                          </Typography>
                          <Tooltip.Arrow />
                        </Tooltip.Content>
                      </Tooltip>
                    )}
                    {property.facility?.security && (
                      <Tooltip>
                        <Tooltip.Trigger as={IconButton} variant="ghost">
                          <SecurityPass className="w-5 h-5 text-gray-500 transition-colors duration-200 dark:text-gray-400 hover:text-green-800 dark:hover:text-green-200" />
                        </Tooltip.Trigger>
                        <Tooltip.Content className="w-40 px-2.5 py-1.5 text-primary-foreground">
                          <Typography className="text-xs font-semibold">
                            Keamanan
                          </Typography>
                          <Typography type="small" className="opacity-90">
                            {property.facility.security}
                          </Typography>
                          <Tooltip.Arrow />
                        </Tooltip.Content>
                      </Tooltip>
                    )}

                    {property.facility?.security && (
                      <Tooltip>
                        <Tooltip.Trigger as={IconButton} variant="ghost">
                          <DropletCheck className="w-5 h-5 text-gray-500 transition-colors duration-200 dark:text-gray-400 hover:text-green-800 dark:hover:text-green-200" />
                        </Tooltip.Trigger>
                        <Tooltip.Content className="w-40 px-2.5 py-1.5 text-primary-foreground">
                          <Typography className="text-xs font-semibold">
                            Sumber Air
                          </Typography>
                          <Typography type="small" className="opacity-90">
                            {property.facility.water_source}
                          </Typography>
                          <Tooltip.Arrow />
                        </Tooltip.Content>
                      </Tooltip>
                    )}
                  </div>
                </div>

                {/* tambahkan user.profile.company_name */}
                <div className="flex items-center mt-4">
                  <Avatar className="w-10 h-10 mr-3">
                    <AvatarImage
                      src={
                        property.user?.profile?.avatar
                          ? `${homedomain}/storage/${property.user.profile.avatar}`
                          : "images/avatar-fallback.gif"
                      }
                      alt={property.user?.profile?.first_name}
                    />
                    <AvatarFallback className="bg-indigo-300 rounded-full">
                      {property.user?.profile?.first_name?.[0]}
                      {property.user?.profile?.last_name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  {property.user?.profile?.company_name && (
                    <Typography className="text-sm font-semibold">
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
