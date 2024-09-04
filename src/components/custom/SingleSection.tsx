import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import DotPattern from "@/components/magicui/dot-pattern";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Loader, Placeholder, Popover, Whisper } from "rsuite";
import {
  Button,
  ButtonGroup,
  ButtonToolbar,
  Carousel,
  RadioGroup,
  Radio,
  Divider,
} from "rsuite";
import "rsuite/dist/rsuite-no-reset.min.css";
import {
  Home,
  User,
  Building,
  DollarSign,
  MapPin,
  Info,
  List,
  Shield,
  Phone,
  Wifi,
  Droplet,
  FileText,
  Map,
  Banknote,
  CircleCheckBig,
  Mail,
  MessageCircle,
} from "lucide-react";

interface Property {
  user_id: number;
  category_id: number;
  title: string;
  short_desc: string;
  description: string;
  price: number;
  period: string;
  address: string;
  province_id: string;
  district_id: string;
  city_id: string;
  village_id: string;
  coordinates: string;
  nearby: string;

  ads: string;
  status: string;
  views_count: number;
  meta_title: string | null;
  meta_description: string | null;
  keywords: string;
  id: number;
  created_at: string;
  updated_at: string;
  facility: {
    certificate: string;
    electricity: number;
    line_phone: string;
    internet: string;
    road_width: string;
    water_source: string;
    hook: string | null;
    condition: string | null;
    security: string | null;
    wastafel: string | null;
    id: number;
  };
  specification: {
    land_size: number | null;
    building_size: number;
    bedroom: number;
    carport: string | null;
    bathroom: number;
    dining_room: string | null;
    living_room: string | null;
    floors: number;
    id: number;
  };
  images: {
    image_url: string;
    is_primary: boolean;
    id: number;
  }[];
  province: {
    code: string;
    name: string;
    level: string;
  };
  district: {
    code: string;
    name: string;
    level: string;
  };
  city: {
    code: string;
    name: string;
    level: string;
  };
  village: {
    code: string;
    name: string;
    level: string;
  };
  user: {
    name: string;
    email: string;
    password: string;
    role: string;
    is_active: boolean;
    id: number;
    created_at: string;
    updated_at: string;
    profile: {
      first_name: string;
      last_name: string;
      phone: string;
      email: string;
      whatsapp: string;
      company_name: string;
      avatar: string | null;
      biodata_company: string;
      jobdesk: string;
    };
  };
}

interface PropertyResponse {
  items: Property[];
}
const homedomain = import.meta.env.PUBLIC_HOME_DOMAIN;

const getImageUrl = (property: Property) => {
  const primaryImage = property.images.find((img) => img.is_primary);

  return primaryImage
    ? `${homedomain}/storage/${primaryImage.image_url}`
    : "images/home_fallback.png";
};
const getAllImage = (property: Property) => {
  property.images.forEach((image, index) => {});
  return property.images.length > 0
    ? property.images.map((img) => {
        let imageUrl = img.image_url.startsWith("/")
          ? img.image_url.substring(1)
          : img.image_url;
        imageUrl = imageUrl.replace(/[",/\\]/g, ""); // Menghapus karakter yang tidak diperlukan
        return `${homedomain}/storage/${imageUrl}`;
      })
    : ["images/home_fallback.png"];
};

interface SingleSectionProps {
  property: Property;
}
const SingleSection: React.FC<SingleSectionProps> = ({ property }) => {
  const [shape, setShape] = useState<"bar" | "dot" | undefined>("bar");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulasikan proses loading
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading) {
    return (
      <div className="h-[600px] bg-[#94918d]">
        <Loader size="lg" inverse center content="loading..." />
      </div>
    );
  }

  if (!property) {
    return <div>Property not found</div>;
  }

  const renderValue = (value: any) => {
    if (value === null || value === undefined) {
      return <span>Data kosong</span>;
    }
    return value;
  };

  return (
    <section className="py-12 bg-gradient-to-t from-blue-200 via-blue-100 to-white dark:from-gray-800 dark:via-gray-700 dark:to-gray-600">
      <div className="container max-w-4xl px-4 py-12 mx-auto">
        <div className="container px-4 mx-auto">
          <div className="mb-8">
            <Button
              appearance="primary"
              color="green"
              href="/"
              className="transition-colors"
            >
              <Home className="w-4 h-4 mr-2 text-white dark:text-gray-300" />
              Kembali ke Beranda
            </Button>
          </div>

          <div className="overflow-hidden bg-gray-200 rounded-lg shadow-xl dark:bg-gray-800">
            <div className="relative">
              <div className="relative">
                <Carousel autoplay className="custom-slider" shape={shape}>
                  {getAllImage(property).map((imageUrl, index) => (
                    <div key={index} className="relative">
                      <img
                        src={imageUrl}
                        alt={renderValue(property.title) || "Property Image"}
                        className="object-cover w-full h-full rounded-t-lg"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-30"></div>
                    </div>
                  ))}
                </Carousel>
              </div>
            </div>

            <div className="p-8">
              <DotPattern
                width={20}
                height={20}
                cx={1}
                cy={1}
                cr={1}
                className={cn(
                  "relative inset-0 opacity-100 [mask-image:linear-gradient(to_bottom,white,transparent)]"
                )}
              />
              <div className="flex flex-col items-start justify-between mb-8 md:flex-row md:items-center">
                <div className="flex flex-col space-y-4">
                  <h1 className="text-4xl font-extrabold leading-tight text-blue-600 dark:text-blue-400">
                    <Home className="inline-block w-8 h-8 mr-2 text-blue-600 dark:text-blue-400" />
                    {renderValue(property.title)}
                  </h1>
                  <div className="flex flex-col space-y-2">
                    <p className="flex items-center justify-between text-base text-gray-700 dark:text-gray-300">
                      <span className="mr-2 font-semibold">
                        <User className="inline-block w-4 h-4 mr-1 text-green-600 dark:text-green-400" />
                        Pemilik Iklan:
                      </span>
                      <span className="font-medium transition-colors duration-200 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400">
                        {renderValue(property.user?.profile?.first_name) +
                          " " +
                          renderValue(property.user?.profile?.last_name) ||
                          "Unknown User"}
                      </span>
                    </p>
                    <p className="flex items-center justify-between text-base text-gray-700 dark:text-gray-300">
                      <span className="mr-2 font-semibold">
                        <Building className="inline-block w-4 h-4 mr-1 text-purple-600 dark:text-purple-400" />
                        Developer:
                      </span>
                      <span className="font-medium transition-colors duration-200 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400">
                        {renderValue(property.user?.profile?.company_name) ||
                          "Unknown User"}
                      </span>
                    </p>
                    <Accordion
                      type="single"
                      collapsible
                      className="mt-2 bg-white rounded-lg shadow-md dark:bg-gray-800"
                    >
                      <AccordionItem value="biodata_company">
                        <AccordionTrigger className="px-4 py-3 text-gray-800 transition-colors duration-200 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                          Lihat Biodata Perusahaan
                        </AccordionTrigger>
                        <AccordionContent className="px-4 py-3 bg-gray-50 dark:bg-gray-900">
                          <p className="text-gray-700 dark:text-gray-300">
                            {renderValue(
                              property.user?.profile?.biodata_company
                            ) || "Tidak ada biodata perusahaan tersedia"}
                          </p>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                </div>
                <Avatar className="w-24 h-24 mt-4 md:mt-0">
                  <AvatarImage
                    src={
                      property.user?.profile?.avatar
                        ? `${homedomain}/storage/${property.user.profile.avatar}`
                        : "images/avatar-fallback.gif"
                    }
                    alt={renderValue(property.user.name)}
                  />
                  <AvatarFallback>
                    {property.user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="grid grid-cols-1 gap-8 mb-8 md:grid-cols-2">
                <div>
                  <h2 className="mb-4 text-2xl font-semibold text-yellow-600 dark:text-yellow-400">
                    <Info className="inline-block w-6 h-6 mr-2 text-indigo-600 dark:text-indigo-400" />
                    Deskripsi Singkat
                  </h2>
                  <p className="text-left text-gray-700 dark:text-gray-300">
                    {renderValue(property.short_desc)}
                  </p>
                </div>
                <div>
                  <h2 className="mb-4 text-2xl font-semibold text-yellow-600 dark:text-yellow-400">
                    <List className="inline-block w-6 h-6 mr-2 text-orange-600 dark:text-orange-400" />
                    Informasi Utama
                  </h2>
                  <p className="mb-10 text-xl font-bold text-left text-green-600 dark:text-green-400">
                    <Banknote className="inline-block w-6 h-6 mr-1 text-green-600 dark:text-green-400" />
                    Harga: Rp{" "}
                    {renderValue(property.price)?.toLocaleString() || "N/A"}
                  </p>
                  <Accordion
                    type="single"
                    collapsible
                    className="transition-all duration-300 bg-white rounded-md shadow-md dark:bg-gray-800"
                  >
                    <AccordionItem value="alamat">
                      <AccordionTrigger className="px-4 py-3 text-gray-800 transition-colors duration-200 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                        Alamat dan Wilayah
                      </AccordionTrigger>
                      <AccordionContent className="px-4 py-3 bg-gray-50 dark:bg-gray-900">
                        <ul className="space-y-2 text-sm text-right text-gray-700 dark:text-gray-300">
                          <li className="flex justify-between mb-4 ">
                            <MapPin className="inline-block mr-1 text-red-600 w-7 h-7 dark:text-red-400" />
                            <span>Alamat:</span>
                            <br />
                            <span className="font-semibold">
                              {renderValue(property.address) || "N/A"}
                            </span>
                          </li>
                          <li className="flex justify-between ">
                            <MapPin className="inline-block w-5 h-5 mr-1 text-red-600 dark:text-red-400" />
                            <span>Wilayah:</span>
                            <br />
                            <span className="font-semibold">
                              {property.province.name &&
                              property.district.name &&
                              property.city.name
                                ? `${property.province.name},\n${property.district.name},\n${property.city.name}`
                                : "N/A"}
                            </span>
                          </li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-8 mb-8 md:grid-cols-2">
                <div>
                  <h2 className="mb-4 text-2xl font-semibold text-yellow-600 dark:text-yellow-400">
                    <List className="inline-block w-6 h-6 mr-2 text-teal-600 dark:text-teal-400" />
                    Spesifikasi
                  </h2>

                  <Accordion
                    type="single"
                    collapsible
                    className="transition-all duration-300 bg-white rounded-md shadow-md dark:bg-gray-800"
                  >
                    <AccordionItem value="item-1">
                      <AccordionTrigger className="px-4 py-3 text-gray-800 transition-colors duration-200 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                        Spesifikasi Detail
                      </AccordionTrigger>
                      <AccordionContent className="px-4 py-3 bg-gray-50 dark:bg-gray-900">
                        <div className="space-y-2 text-gray-700 dark:text-gray-300">
                          {property.specification ? (
                            <>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <CircleCheckBig className="w-5 h-5 mr-2 text-green-500" />
                                  <span>Carport:</span>
                                </div>
                                <span className="font-semibold">
                                  {renderValue(
                                    property.specification.carport
                                  ) || "N/A"}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <CircleCheckBig className="w-5 h-5 mr-2 text-green-500" />
                                  <span>Ruang Makan:</span>
                                </div>
                                <span className="font-semibold">
                                  {renderValue(
                                    property.specification.dining_room
                                  ) || "N/A"}
                                </span>
                              </div>

                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <CircleCheckBig className="w-5 h-5 mr-2 text-green-500" />
                                  <span>Ruang Tamu:</span>
                                </div>
                                <span className="font-semibold">
                                  {renderValue(
                                    property.specification.living_room
                                  ) || "N/A"}
                                </span>
                              </div>

                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <CircleCheckBig className="w-5 h-5 mr-2 text-green-500" />
                                  <span>Luas Tanah:</span>
                                </div>
                                <span className="font-semibold">
                                  {renderValue(
                                    property.specification.land_size
                                  ) || "N/A"}{" "}
                                  m²
                                </span>
                              </div>

                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <CircleCheckBig className="w-5 h-5 mr-2 text-green-500" />
                                  <span>Luas Bangunan:</span>
                                </div>
                                <span className="font-semibold">
                                  {renderValue(
                                    property.specification.building_size
                                  ) || "N/A"}{" "}
                                  m²
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <CircleCheckBig className="w-5 h-5 mr-2 text-green-500" />
                                  <span>Kamar Tidur:</span>
                                </div>
                                <span className="font-semibold">
                                  {renderValue(
                                    property.specification.bedroom
                                  ) || "N/A"}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <CircleCheckBig className="w-5 h-5 mr-2 text-green-500" />
                                  <span>Kamar Mandi:</span>
                                </div>
                                <span className="font-semibold">
                                  {renderValue(
                                    property.specification.bathroom
                                  ) || "N/A"}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <CircleCheckBig className="w-5 h-5 mr-2 text-green-500" />
                                  <span>Jumlah Lantai:</span>
                                </div>
                                <span className="font-semibold">
                                  {renderValue(property.specification.floors) ||
                                    "N/A"}
                                </span>
                              </div>
                            </>
                          ) : (
                            <div className="italic text-center">
                              Tidak ada spesifikasi tersedia
                            </div>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>

                <div>
                  <h2 className="mb-4 text-2xl font-semibold text-yellow-600 dark:text-yellow-400">
                    <MapPin className="inline-block w-6 h-6 mr-2 text-blue-600 dark:text-blue-400" />
                    Lokasi Terdekat
                  </h2>

                  <Accordion
                    type="single"
                    collapsible
                    className="transition-all duration-300 bg-white rounded-md shadow-md dark:bg-gray-800"
                  >
                    <AccordionItem value="nearby">
                      <AccordionTrigger className="px-4 py-3 text-gray-800 transition-colors duration-200 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                        Detail Lokasi Terdekat
                      </AccordionTrigger>
                      <AccordionContent className="px-4 py-3 bg-gray-50 dark:bg-gray-900">
                        {property.nearby ? (
                          <div className="space-y-2">
                            {property.nearby.split(",").map((item, index) => (
                              <div key={index} className="flex items-center">
                                <CircleCheckBig className="w-5 h-5 mr-2 text-green-500" />
                                <span className="text-gray-700 dark:text-gray-300">
                                  {item.trim()}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="italic text-gray-500 dark:text-gray-400">
                            Tidak ada informasi lokasi terdekat tersedia
                          </p>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>

                <div>
                  <h2 className="mb-4 text-2xl font-semibold text-yellow-600 dark:text-yellow-400">
                    <Shield className="inline-block w-6 h-6 mr-2 text-pink-600 dark:text-pink-400" />
                    Fasilitas
                  </h2>
                  <Accordion
                    type="single"
                    collapsible
                    className="bg-white rounded-lg shadow-md dark:bg-gray-800"
                  >
                    <AccordionItem value="item-2">
                      <AccordionTrigger className="px-4 py-3 text-gray-800 transition-colors duration-200 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                        Fasilitas Detail
                      </AccordionTrigger>
                      <AccordionContent className="px-4 py-3 bg-gray-50 dark:bg-gray-900">
                        <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                          {property.facility ? (
                            <>
                              <li className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <CircleCheckBig className="w-5 h-5 mr-2 text-green-500" />
                                  <span>Telepon:</span>
                                </div>
                                <span className="font-semibold">
                                  {renderValue(property.facility.line_phone) ||
                                    "N/A"}
                                </span>
                              </li>
                              <li className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <CircleCheckBig className="w-5 h-5 mr-2 text-green-500" />
                                  <span>Lebar Jalan:</span>
                                </div>
                                <span className="font-semibold">
                                  {renderValue(property.facility.road_width) ||
                                    "N/A"}{" "}
                                  m
                                </span>
                              </li>
                              <li className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <CircleCheckBig className="w-5 h-5 mr-2 text-green-500" />
                                  <span>Hook:</span>
                                </div>
                                <span className="font-semibold">
                                  {renderValue(property.facility.hook) || "N/A"}
                                </span>
                              </li>
                              <li className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <CircleCheckBig className="w-5 h-5 mr-2 text-green-500" />
                                  <span>Kondisi:</span>
                                </div>
                                <span className="font-semibold">
                                  {renderValue(property.facility.condition) ||
                                    "N/A"}
                                </span>
                              </li>
                              <li className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <CircleCheckBig className="w-5 h-5 mr-2 text-green-500" />
                                  <span>Keamanan:</span>
                                </div>
                                <span className="font-semibold">
                                  {renderValue(property.facility.security) ||
                                    "N/A"}
                                </span>
                              </li>
                              <li className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <CircleCheckBig className="w-5 h-5 mr-2 text-green-500" />
                                  <span>Wastafel:</span>
                                </div>
                                <span className="font-semibold">
                                  {renderValue(property.facility.wastafel) ||
                                    "N/A"}
                                </span>
                              </li>
                              <li className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <CircleCheckBig className="w-5 h-5 mr-2 text-green-500" />
                                  <span>Sertifikat:</span>
                                </div>
                                <span className="font-semibold">
                                  {renderValue(property.facility.certificate) ||
                                    "N/A"}
                                </span>
                              </li>
                              <li className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <CircleCheckBig className="w-5 h-5 mr-2 text-green-500" />
                                  <span>Listrik:</span>
                                </div>
                                <span className="font-semibold">
                                  {renderValue(property.facility.electricity) ||
                                    "N/A"}{" "}
                                  VA
                                </span>
                              </li>
                              <li className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <CircleCheckBig className="w-5 h-5 mr-2 text-green-500" />
                                  <span>Internet:</span>
                                </div>
                                <span className="font-semibold">
                                  {renderValue(property.facility.internet) ||
                                    "N/A"}
                                </span>
                              </li>
                              <li className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <CircleCheckBig className="w-5 h-5 mr-2 text-green-500" />
                                  <span>Sumber Air:</span>
                                </div>
                                <span className="font-semibold">
                                  {renderValue(
                                    property.facility.water_source
                                  ) || "N/A"}
                                </span>
                              </li>
                            </>
                          ) : (
                            <li className="italic text-center">
                              Tidak ada fasilitas tersedia
                            </li>
                          )}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="mb-4 text-2xl font-semibold text-yellow-600 dark:text-yellow-400">
                  <FileText className="inline-block w-6 h-6 mr-2 text-yellow-600 dark:text-yellow-400" />
                  Deskripsi Lengkap
                </h2>
                <Accordion
                  type="single"
                  collapsible
                  className="bg-white rounded-lg shadow-md dark:bg-gray-800"
                >
                  <AccordionItem value="description">
                    <AccordionTrigger className="px-4 py-3 text-gray-800 transition-colors duration-200 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                      Lihat Deskripsi
                    </AccordionTrigger>
                    <AccordionContent className="px-4 py-3 bg-gray-50 dark:bg-gray-900">
                      <p className="text-gray-700 dark:text-gray-300">
                        {renderValue(property.description) ||
                          "Tidak ada deskripsi tersedia"}
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>

              <div>
                <h2 className="mb-4 text-2xl font-semibold text-yellow-600 dark:text-yellow-400">
                  <Map className="inline-block w-6 h-6 mr-2 text-gray-800 dark:text-gray-200" />
                  Peta Lokasi
                </h2>
                <Accordion
                  type="single"
                  collapsible
                  className="bg-white rounded-lg shadow-md dark:bg-gray-800"
                >
                  <AccordionItem value="map">
                    <AccordionTrigger className="px-4 py-3 text-gray-800 transition-colors duration-200 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                      Lihat Peta
                    </AccordionTrigger>
                    <AccordionContent className="px-4 py-3 bg-gray-50 dark:bg-gray-900">
                      {property.coordinates ? (
                        <div className="overflow-hidden rounded-lg">
                          <iframe
                            width="100%"
                            height="450"
                            frameBorder="0"
                            style={{ border: 0 }}
                            src={`https://www.google.com/maps?q=${property.coordinates}&output=embed`}
                            allowFullScreen
                          ></iframe>
                        </div>
                      ) : (
                        <p className="text-gray-700 dark:text-gray-300">
                          Koordinat tidak tersedia
                        </p>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>

              <div className="mt-4 ">
                <h2 className="mb-4 text-2xl font-semibold text-yellow-600 dark:text-yellow-400">
                  <Phone className="inline-block w-6 h-6 mr-2 text-gray-800 dark:text-gray-200" />
                  Kontak
                </h2>
                <div className="flex justify-center space-x-4">
                  <Whisper
                    placement="top"
                    trigger="hover"
                    speaker={
                      <Popover title="Email">
                        <p>Kirim email ke pemilik properti</p>
                      </Popover>
                    }
                  >
                    <Button
                      appearance="ghost"
                      color="green"
                      className="flex items-center"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Email
                    </Button>
                  </Whisper>

                  <Whisper
                    placement="top"
                    trigger="hover"
                    enterable
                    speaker={
                      <Popover title="Telepon">
                        <p>Hubungi pemilik properti melalui telepon</p>
                        <p>
                          <strong>{property.user?.profile?.phone}</strong>
                        </p>
                      </Popover>
                    }
                  >
                    <Button
                      appearance="ghost"
                      color="green"
                      className="flex items-center"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Telepon
                    </Button>
                  </Whisper>

                  <Whisper
                    placement="top"
                    trigger="hover"
                    speaker={
                      <Popover title="WhatsApp">
                        <p>Kirim pesan WhatsApp ke pemilik properti</p>
                        {window.innerWidth > 768 ? (
                          <a
                            href={`https://web.whatsapp.com/send?text=${encodeURIComponent(`Saya tertarik dengan properti: ${renderValue(property.title)}`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Buka WhatsApp Web
                          </a>
                        ) : (
                          <a
                            href={`whatsapp://send?text=${encodeURIComponent(`Saya tertarik dengan properti: ${renderValue(property.title)}`)}`}
                          >
                            Buka Aplikasi WhatsApp
                          </a>
                        )}
                      </Popover>
                    }
                    enterable
                  >
                    <Button
                      appearance="ghost"
                      color="green"
                      className="flex items-center"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      WhatsApp
                    </Button>
                  </Whisper>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SingleSection;
