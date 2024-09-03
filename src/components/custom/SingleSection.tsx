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
import { Loader, Placeholder } from "rsuite";
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
    <div className="container max-w-4xl px-4 py-12 mx-auto ">
      <div className="container px-4 mx-auto">
        <div className="mb-8">
          <Button
            appearance="primary"
            href="/"
            className="transition-colors hover:bg-blue-600"
          >
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
              <div>
                <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {renderValue(property.title)}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  By
                  <span className="ml-1 font-medium hover:underline">
                    {renderValue(property.user?.name) || "Unknown User"}
                  </span>
                </p>
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
                <AvatarFallback>{property.user.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>

            <div className="grid grid-cols-1 gap-8 mb-8 md:grid-cols-2">
              <div>
                <h2 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-gray-200">
                  Deskripsi Singkat
                </h2>
                <p className="text-gray-700 dark:text-gray-300">
                  {renderValue(property.short_desc)}
                </p>
              </div>
              <div>
                <h2 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-gray-200">
                  Informasi Utama
                </h2>
                <p className="mb-2 text-xl font-bold text-green-600 dark:text-green-400">
                  Harga: Rp{" "}
                  {renderValue(property.price)?.toLocaleString() || "N/A"}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  Alamat: {renderValue(property.address) || "N/A"}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  Lokasi:{" "}
                  {property.province && property.district && property.city
                    ? `${property.province.name}, ${property.district.name}, ${property.city.name}`
                    : "N/A"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8 mb-8 md:grid-cols-2">
              <div>
                <h2 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-gray-200">
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
                      <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                        {property.specification ? (
                          <>
                            <li className="flex justify-between">
                              <span>Carport:</span>
                              <span className="font-medium">
                                {renderValue(property.specification.carport) ||
                                  "N/A"}
                              </span>
                            </li>
                            <li className="flex justify-between">
                              <span>Ruang Makan:</span>
                              <span className="font-medium">
                                {renderValue(
                                  property.specification.dining_room
                                ) || "N/A"}
                              </span>
                            </li>
                            <li className="flex justify-between">
                              <span>Ruang Tamu:</span>
                              <span className="font-medium">
                                {renderValue(
                                  property.specification.living_room
                                ) || "N/A"}
                              </span>
                            </li>
                            <li className="flex justify-between">
                              <span>Luas Tanah:</span>
                              <span className="font-medium">
                                {renderValue(
                                  property.specification.land_size
                                ) || "N/A"}{" "}
                                m²
                              </span>
                            </li>
                            <li className="flex justify-between">
                              <span>Luas Bangunan:</span>
                              <span className="font-medium">
                                {renderValue(
                                  property.specification.building_size
                                ) || "N/A"}{" "}
                                m²
                              </span>
                            </li>
                            <li className="flex justify-between">
                              <span>Kamar Tidur:</span>
                              <span className="font-medium">
                                {renderValue(property.specification.bedroom) ||
                                  "N/A"}
                              </span>
                            </li>
                            <li className="flex justify-between">
                              <span>Kamar Mandi:</span>
                              <span className="font-medium">
                                {renderValue(property.specification.bathroom) ||
                                  "N/A"}
                              </span>
                            </li>
                            <li className="flex justify-between">
                              <span>Jumlah Lantai:</span>
                              <span className="font-medium">
                                {renderValue(property.specification.floors) ||
                                  "N/A"}
                              </span>
                            </li>
                          </>
                        ) : (
                          <li className="italic text-center">
                            Tidak ada spesifikasi tersedia
                          </li>
                        )}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>

              <div>
                <h2 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-gray-200">
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
                            <li className="flex justify-between">
                              <span>Telepon:</span>
                              <span className="font-medium">
                                {renderValue(property.facility.line_phone) ||
                                  "N/A"}
                              </span>
                            </li>
                            <li className="flex justify-between">
                              <span>Lebar Jalan:</span>
                              <span className="font-medium">
                                {renderValue(property.facility.road_width) ||
                                  "N/A"}{" "}
                                m
                              </span>
                            </li>
                            <li className="flex justify-between">
                              <span>Hook:</span>
                              <span className="font-medium">
                                {renderValue(property.facility.hook) || "N/A"}
                              </span>
                            </li>
                            <li className="flex justify-between">
                              <span>Kondisi:</span>
                              <span className="font-medium">
                                {renderValue(property.facility.condition) ||
                                  "N/A"}
                              </span>
                            </li>
                            <li className="flex justify-between">
                              <span>Keamanan:</span>
                              <span className="font-medium">
                                {renderValue(property.facility.security) ||
                                  "N/A"}
                              </span>
                            </li>
                            <li className="flex justify-between">
                              <span>Wastafel:</span>
                              <span className="font-medium">
                                {renderValue(property.facility.wastafel) ||
                                  "N/A"}
                              </span>
                            </li>
                            <li className="flex justify-between">
                              <span>Sertifikat:</span>
                              <span className="font-medium">
                                {renderValue(property.facility.certificate) ||
                                  "N/A"}
                              </span>
                            </li>
                            <li className="flex justify-between">
                              <span>Listrik:</span>
                              <span className="font-medium">
                                {renderValue(property.facility.electricity) ||
                                  "N/A"}{" "}
                                VA
                              </span>
                            </li>
                            <li className="flex justify-between">
                              <span>Internet:</span>
                              <span className="font-medium">
                                {renderValue(property.facility.internet) ||
                                  "N/A"}
                              </span>
                            </li>
                            <li className="flex justify-between">
                              <span>Sumber Air:</span>
                              <span className="font-medium">
                                {renderValue(property.facility.water_source) ||
                                  "N/A"}
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
              <h2 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-gray-200">
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
              <h2 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-gray-200">
                Peta Lokasi
              </h2>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleSection;
