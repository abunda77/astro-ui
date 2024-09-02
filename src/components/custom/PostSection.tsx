import React, { useState, useEffect, useId, useRef } from "react";
import { Button } from "@/components/ui/button";
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
import { MapPin, Banknote, House } from "lucide-react";
import {
  Card,
  Typography,
  IconButton,
  Tooltip,
} from "@material-tailwind/react";
import {
  HeartSolid,
  StarSolid,
  Cash,
  Wifi,
  HomeSimple,
  ModernTv,
  FireFlame,
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
    <section className="text-gray-800 bg-gradient-to-b from-blue-100 via-blue-50 to-white dark:from-white dark:via-gray-50 dark:to-gray-300">
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
              <SelectTrigger className="w-[180px] dark:bg-slate-900 dark:text-gray-200">
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
                      className="dark:text-gray-200"
                    >
                      {category.value}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      {/* Mulai Card Grid */}
      <div className="container max-w-6xl p-6 mx-auto space-y-6 sm:space-y-12 ">
        {active && typeof active === "object" && (
          <div className="fixed inset-0 z-10 w-full h-full bg-black/20" />
        )}
        {active && typeof active === "object" ? (
          <div className="fixed inset-0 grid place-items-center z-[100]">
            {/* --- Button Close --- */}
            <button
              key={`button-${active.title}-${id}`}
              className="absolute top-2 right-2 flex items-center justify-center w-8 h-8 bg-red-500 rounded-full z-[102]"
              onClick={() => setActive(null)}
            >
              <CloseIcon />
            </button>

            <div
              ref={ref}
              className="w-full max-w-[500px] h-full md:h-fit md:max-h-[90%] flex flex-col bg-green-100 dark:bg-neutral-900 sm:rounded-3xl overflow-hidden "
            >
              {/* --- Image --- */}
              <div className="relative">
                <img
                  src={getImageUrl(active)}
                  alt={active.title}
                  className="object-cover object-top w-full h-80 lg:h-80 sm:rounded-tr-lg sm:rounded-tl-lg"
                />

                {/* --- Category --- */}
                <Badge
                  className={
                    active.ads === "sell"
                      ? "bg-red-500"
                      : active.ads === "rent"
                        ? "bg-blue-500"
                        : ""
                  }
                >
                  {active.ads === "sell"
                    ? "Dijual"
                    : active.ads === "rent"
                      ? "Disewakan"
                      : active.ads}
                </Badge>
              </div>

              <div>
                <div className="flex items-start justify-between p-4">
                  <div className="">
                    {/* --Title ---*/}
                    <h3 className="text-base font-medium text-neutral-700 dark:text-neutral-200">
                      {active.title}
                    </h3>

                    {/* ---Shor Desc --- */}
                    <p className="text-base text-neutral-600 dark:text-neutral-400">
                      {active.short_desc}
                    </p>
                  </div>

                  {/* --- Button Detail ---*/}
                  <div>
                    <Button
                      className="flex items-center justify-center px-4 py-3 text-sm font-bold text-white bg-green-500 rounded-full"
                      onClick={() => {
                        setLoading(true);
                        setTimeout(() => {
                          window.location.href = `/post/${active.id}`;
                        }, 1000);
                      }}
                      disabled={loading}
                    >
                      {loading ? (
                        <Loader
                          size="lg"
                          content="Loading please wait..."
                          vertical
                        />
                      ) : (
                        <span className="mr-2">Detail</span>
                      )}
                    </Button>
                  </div>
                </div>
                <div className="relative px-4 pt-4">
                  <div className="text-neutral-600 text-xs md:text-sm lg:text-base h-40 md:h-fit pb-10 flex flex-col items-start gap-4 overflow-auto dark:text-neutral-400 [mask:linear-gradient(to_bottom,white,white,transparent)] [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch]">
                    <div className="text-xs">
                      <p>
                        Diiklankan tanggal :{" "}
                        <strong>
                          {new Date(active.created_at).toLocaleDateString(
                            "id-ID",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </strong>
                      </p>
                      <p>
                        Diposting oleh:{" "}
                        <strong>
                          {active.user.profile.first_name}{" "}
                          {active.user.profile.last_name}
                        </strong>
                      </p>
                      <p>
                        Developer:{" "}
                        <strong>{active.user.profile.company_name}</strong>
                      </p>
                    </div>
                    <span className="flex items-center text-xs font-bold text-gray-600 dark:text-gray-400">
                      <MapPin className="w-4 h-4 mr-1" />
                      {`${active.province.name}, ${active.district.name}, ${active.city.name}`}
                    </span>

                    <p className="flex items-center">
                      <House className="w-4 h-4 mr-1" />
                      {"   "}
                      <Badge
                        className={
                          categories.find(
                            (category) => category.key === active.category_id
                          )?.badgeColor
                        }
                      >
                        {
                          categories.find(
                            (category) => category.key === active.category_id
                          )?.value
                        }
                      </Badge>
                    </p>
                    <p className="flex items-center font-bold">
                      <Banknote className="w-4 h-4 mr-1" />
                      Price: Rp {active.price.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
        {/* Mulai desain grid */}
        <ul className="grid items-start w-full max-w-6xl grid-cols-1 gap-4 mx-auto md:grid-cols-2 lg:grid-cols-4">
          {properties.map((property, index) => (
            <Card
              key={property.title}
              className="w-full max-w-[26rem] shadow-lg"
            >
              <Card.Header className="relative p-0 overflow-hidden">
                <img
                  src={getImageUrl(property)}
                  alt={property.title}
                  className="object-cover object-top w-full h-60"
                />
                <div className="absolute inset-0 w-full h-full to-bg-black-10 bg-gradient-to-tr from-transparent via-transparent to-black/60 " />
                <IconButton
                  size="sm"
                  color="secondary"
                  className="!absolute right-2 top-2 rounded-full"
                >
                  <HeartSolid className="w-5 h-5" />
                </IconButton>
              </Card.Header>

              <Card.Body>
                <div className="flex items-center justify-between mb-2">
                  <Typography variant="h6">{property.title}</Typography>
                  <Typography className="flex items-center gap-1.5">
                    <StarSolid className="h-[18px] w-[18px] text-yellow-700" />
                    {property.ads === "sell" ? "Dijual" : "Disewakan"}
                  </Typography>
                </div>

                <Typography className="text-sm text-gray-600 dark:text-gray-400">
                  {property.short_desc}
                </Typography>

                <div className="inline-flex flex-wrap items-center gap-3 mt-6 group">
                  <Tooltip>
                    <Tooltip.Trigger>
                      <IconButton className="rounded-full">
                        <Cash className="w-5 h-5" />
                      </IconButton>
                    </Tooltip.Trigger>
                    <Tooltip.Content>
                      Rp {property.price.toLocaleString("id-ID")}
                      <Tooltip.Arrow />
                    </Tooltip.Content>
                  </Tooltip>

                  <Tooltip>
                    <Tooltip.Trigger>
                      <IconButton className="rounded-full">
                        <Wifi className="w-5 h-5" />
                      </IconButton>
                    </Tooltip.Trigger>
                    <Tooltip.Content>
                      Internet: {property.facility.internet}
                      <Tooltip.Arrow />
                    </Tooltip.Content>
                  </Tooltip>

                  <Tooltip>
                    <Tooltip.Trigger>
                      <IconButton className="rounded-full">
                        <HomeSimple className="w-5 h-5" />
                      </IconButton>
                    </Tooltip.Trigger>
                    <Tooltip.Content>
                      Kondisi: {property.facility.condition}
                      <Tooltip.Arrow />
                    </Tooltip.Content>
                  </Tooltip>

                  <Tooltip>
                    <Tooltip.Trigger>
                      <IconButton className="rounded-full">
                        <ModernTv className="w-5 h-5" />
                      </IconButton>
                    </Tooltip.Trigger>
                    <Tooltip.Content>
                      Listrik: {property.facility.electricity} watt
                      <Tooltip.Arrow />
                    </Tooltip.Content>
                  </Tooltip>

                  <Tooltip>
                    <Tooltip.Trigger>
                      <IconButton className="rounded-full">
                        <FireFlame className="w-5 h-5" />
                      </IconButton>
                    </Tooltip.Trigger>
                    <Tooltip.Content>
                      Keamanan: {property.facility.security}
                      <Tooltip.Arrow />
                    </Tooltip.Content>
                  </Tooltip>

                  <Tooltip>
                    <Tooltip.Trigger>
                      <IconButton className="rounded-full">+</IconButton>
                    </Tooltip.Trigger>
                    <Tooltip.Content>
                      Lihat detail lainnya
                      <Tooltip.Arrow />
                    </Tooltip.Content>
                  </Tooltip>
                </div>
              </Card.Body>

              <Card.Footer className="pt-3">
                <Button
                  onClick={() => {
                    setLoading(true);
                    setTimeout(() => {
                      window.location.href = `/post/${property.id}`;
                    }, 1000);
                  }}
                >
                  {loading ? "Loading..." : "Lihat Detail"}
                </Button>
              </Card.Footer>
            </Card>
          ))}
        </ul>
        {/* Akhir desain grid */}
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
