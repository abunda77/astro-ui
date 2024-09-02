import React, { useState, useEffect, useId, useRef } from "react";
// import globals.css
// import "@/styles/globals.css";
// import { Button } from "@/components/ui/button";
import { ArrowDownIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useOutsideClick } from "@/hooks/use-outside-click";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { CloseIcon } from "@/components/custom/CloseIcon";
import { Loader, Placeholder } from "rsuite";
import "rsuite/dist/rsuite-no-reset.min.css";
import { MapPin, Banknote, House, CalendarDays } from "lucide-react";
import {
  Card,
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

  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const handleCategoryChange = (value: string) => {
    setSelectedCategory(Number(value));
    setCurrentPage(1);
    setProperties([]);
  };

  const categories = [
    { key: 0, value: "All" },
    { key: 11, value: "Home", badgeColor: "bg-blue-500 rounded-lg p-2" },
    { key: 12, value: "Apartment", badgeColor: "bg-red-500 rounded-lg p-2" },
    { key: 13, value: "Kavling", badgeColor: "bg-yellow-500 rounded-lg p-2" },
    { key: 14, value: "Office", badgeColor: "bg-purple-500 rounded-lg p-2" },
    { key: 15, value: "Warehouse", badgeColor: "bg-green-500 rounded-lg p-2" },
  ];

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        // Buat URL dengan filter kategori jika dipilih
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
  }, [currentPage, selectedCategory]);

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
            <Select
              value={selectedCategory?.toString() ?? ""}
              //   onValueChange={(value) => setSelectedCategory(Number(value))}
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger className="w-[180px] dark:bg-slate-700 dark:text-gray-200 hover:bg-gray-200">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel className="dark:text-gray-300">
                    Categories
                  </SelectLabel>
                  {categories.map((category) => (
                    <SelectItem
                      key={category.key}
                      value={category.key.toString()}
                      className=" dark:text-gray-200 hover:bg-gray-200"
                    >
                      {category.value}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {properties.map((property) => (
            <Card
              key={property.id}
              className="transition-transform transform shadow-lg bg-green-50 dark:bg-gray-900 hover:border-blue-500"
            >
              <a href={`/post/${property.id}`} className="relative block">
                <Badge
                  className={
                    categories.find((cat) => cat.key === property.category_id)
                      ?.badgeColor || ""
                  }
                  style={{ position: "absolute", zIndex: 10 }}
                >
                  {
                    categories.find((cat) => cat.key === property.category_id)
                      ?.value
                  }
                </Badge>
                <img
                  src={getImageUrl(property)}
                  alt={property.title}
                  className="object-cover w-full h-48 transition-transform transform hover:scale-105"
                />
                <div className="p-4">
                  <Typography type="h6" className="mb-2 text-foreground">
                    {property.title}
                  </Typography>
                  {/* <Typography className="mb-1 text-foreground">
                    {property.short_desc}
                  </Typography> */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1 text-green-600 dark:text-green-100" />
                      <Typography
                        variant="body2"
                        className="text-xs text-foreground"
                      >
                        {property.city.name}, {property.province.name}
                      </Typography>
                    </div>
                    <CalendarDays className="w-4 h-4 mr-0 text-green-600 dark:text-green-100" />
                    <Typography
                      variant="body2"
                      className="text-xs text-foreground"
                    >
                      {new Date(property.created_at).toLocaleDateString(
                        "id-ID",
                        {
                          year: "numeric",
                          month: "numeric",
                          day: "numeric",
                        }
                      )}
                    </Typography>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    {/* fitur */}
                    <div className="flex items-start">
                      <Tooltip>
                        <Tooltip.Trigger>
                          <IconButton
                            isCircular
                            size="lg"
                            color="secondary"
                            className="cursor-pointer border border-surface bg-surface-light transition-all hover:!opacity-100 group-hover:opacity-70 hover:bg-red-200"
                          >
                            <Internet className="w-5 h-5" />
                          </IconButton>
                        </Tooltip.Trigger>
                        <Tooltip.Content>
                          {property.facility?.internet}
                          <Tooltip.Arrow />
                        </Tooltip.Content>
                      </Tooltip>
                      <Tooltip>
                        <Tooltip.Trigger>
                          <IconButton
                            isCircular
                            size="lg"
                            color="secondary"
                            className="cursor-pointer border border-surface bg-surface-light transition-all hover:!opacity-100 group-hover:opacity-70 hover:bg-red-200"
                          >
                            <Wifi className="w-5 h-5" />
                          </IconButton>
                        </Tooltip.Trigger>
                        <Tooltip.Content>
                          {property.facility?.line_phone}
                          <Tooltip.Arrow />
                        </Tooltip.Content>
                      </Tooltip>
                      <Tooltip>
                        <Tooltip.Trigger>
                          <IconButton
                            isCircular
                            size="lg"
                            color="secondary"
                            className="cursor-pointer border border-surface bg-surface-light transition-all hover:!opacity-100 group-hover:opacity-70 hover:bg-red-200"
                          >
                            <ElectronicsChip className="w-5 h-5" />
                          </IconButton>
                        </Tooltip.Trigger>
                        <Tooltip.Content>
                          {property.facility?.electricity} kWh
                          <Tooltip.Arrow />
                        </Tooltip.Content>
                      </Tooltip>
                      <Tooltip>
                        <Tooltip.Trigger>
                          <IconButton
                            isCircular
                            size="lg"
                            color="secondary"
                            className="cursor-pointer border border-surface bg-surface-light transition-all hover:!opacity-100 group-hover:opacity-70 hover:bg-red-200"
                          >
                            <SecurityPass className="w-5 h-5" />
                          </IconButton>
                        </Tooltip.Trigger>
                        <Tooltip.Content>
                          {property.facility?.security}
                          <Tooltip.Arrow />
                        </Tooltip.Content>
                      </Tooltip>
                      <Tooltip>
                        <Tooltip.Trigger>
                          <IconButton
                            isCircular
                            size="lg"
                            color="secondary"
                            className="cursor-pointer dark:border-none bg-surface-light transition-all hover:!opacity-100 group-hover:opacity-70 hover:bg-red-200 dark:hover:bg-red-200 dark:text-gray-100"
                          >
                            <HomeAltSlim className="w-5 h-5" />
                          </IconButton>
                        </Tooltip.Trigger>
                        <Tooltip.Content>
                          {property.facility?.certificate}
                          <Tooltip.Arrow />
                        </Tooltip.Content>
                      </Tooltip>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Banknote className="mr-2 text-green-600 dark:text-green-100" />
                    <Typography
                      variant="h6"
                      className="font-semibold text-gray-600 dark:text-gray-100"
                    >
                      Rp. {property.price.toLocaleString("id-ID")}
                    </Typography>
                  </div>
                </div>
              </a>
              <Card.Footer className="pt-3">
                <Button
                  className="text-gray-800 bg-green-100 border border-green-600 dark:bg-green-700 hover:dark:bg-green-500 dark:text-gray-100 hover:bg-green-200"
                  isFullWidth
                  onClick={() =>
                    (window.location.href = `/post/${property.id}`)
                  }
                >
                  Detail
                </Button>
              </Card.Footer>
            </Card>
          ))}
        </div>
        <div className="flex justify-center mt-6">
          <Button
            className="bg-gray-300 hover:bg-gray-100 text-foreground dark:text-background"
            onClick={handleLoadMore}
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin" /> : "Load More"}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PostSection;
