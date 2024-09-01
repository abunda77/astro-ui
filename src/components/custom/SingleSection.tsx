import { useEffect, useState } from "react";
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
  console.log("Status: Mengambil semua gambar properti");
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
    <div className="p-5 mx-auto text-gray-100 bg-gray-200 sm:p-10 md:p-16 dark:bg-gray-800 dark:text-gray-800">
      <div className="flex justify-start">
        <Button appearance="primary" href="/">
          Kembali ke Beranda
        </Button>
      </div>

      <div className="flex flex-col max-w-3xl mx-auto overflow-hidden rounded">
        <DotPattern
          width={20}
          height={20}
          cx={1}
          cy={1}
          cr={1}
          className={cn(
            "[mask-image:radial-gradient(300px_circle_at_center,white,transparent)]"
          )}
        />

        <div className="w-full ">
          <Carousel autoplay className="custom-slider">
            {getAllImage(property).map((imageUrl, index) => (
              <AspectRatio key={index} ratio={16 / 9}>
                <img
                  src={imageUrl}
                  alt={renderValue(property.title) || "Property Image"}
                  className="object-cover my-4 bg-gray-500 rounded-md dark:bg-gray-500"
                />
              </AspectRatio>
            ))}
          </Carousel>
        </div>

        <div className="flex flex-col justify-center flex-grow w-full p-6 pt-12 pb-12 m-4 mx-auto space-y-6 bg-gray-900 lg:max-w-2xl sm:px-10 sm:mx-12 lg:rounded-md dark:bg-gray-50">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold sm:text-3xl">
                {renderValue(property.title)}
              </h1>
              <p className="text-xs text-gray-400 dark:text-gray-600">
                By
                <span className="text-xs hover:underline">
                  {renderValue(property.user?.name) || "Unknown User"}
                </span>
              </p>
            </div>
            <Avatar className="w-32 h-32 mb-4">
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

          <div className="text-gray-100 dark:text-gray-800">
            <p>{renderValue(property.short_desc)}</p>
            <p className="mt-4 font-bold">
              Harga: Rp {renderValue(property.price)?.toLocaleString() || "N/A"}
            </p>
            <p>Address: {renderValue(property.address) || "N/A"}</p>
            <p>
              Location:{" "}
              {property.province && property.district && property.city
                ? `${property.province.name}, ${property.district.name}, ${property.city.name}`
                : "N/A"}
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Specifications</h2>
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger>Specifications</AccordionTrigger>
                <AccordionContent>
                  <ul>
                    {property.specification ? (
                      <>
                        <li>
                          Carport:{" "}
                          {renderValue(property.specification.carport) || "N/A"}
                        </li>
                        <li>
                          Dining Room:{" "}
                          {renderValue(property.specification.dining_room) ||
                            "N/A"}
                        </li>
                        <li>
                          Living Room:{" "}
                          {renderValue(property.specification.living_room) ||
                            "N/A"}
                        </li>
                        <li>
                          Land Size:{" "}
                          {renderValue(property.specification.land_size) ||
                            "N/A"}{" "}
                          m²
                        </li>
                        <li>
                          Building Size:{" "}
                          {renderValue(property.specification.building_size) ||
                            "N/A"}{" "}
                          m²
                        </li>
                        <li>
                          Bedrooms:{" "}
                          {renderValue(property.specification.bedroom) || "N/A"}
                        </li>
                        <li>
                          Bathrooms:{" "}
                          {renderValue(property.specification.bathroom) ||
                            "N/A"}
                        </li>
                        <li>
                          Floors:{" "}
                          {renderValue(property.specification.floors) || "N/A"}
                        </li>
                      </>
                    ) : (
                      <li>No specifications available</li>
                    )}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Facilities</h2>
            <Accordion type="single" collapsible>
              <AccordionItem value="item-2">
                <AccordionTrigger>Facilities</AccordionTrigger>
                <AccordionContent>
                  <ul>
                    {property.facility ? (
                      <>
                        <li>
                          Line Phone:{" "}
                          {renderValue(property.facility.line_phone) || "N/A"}
                        </li>
                        <li>
                          Road Width:{" "}
                          {renderValue(property.facility.road_width) || "N/A"} m
                        </li>
                        <li>
                          Hook: {renderValue(property.facility.hook) || "N/A"}
                        </li>
                        <li>
                          Condition:{" "}
                          {renderValue(property.facility.condition) || "N/A"}
                        </li>
                        <li>
                          Security:{" "}
                          {renderValue(property.facility.security) || "N/A"}
                        </li>
                        <li>
                          Wastafel:{" "}
                          {renderValue(property.facility.wastafel) || "N/A"}
                        </li>
                        <li>
                          Certificate:{" "}
                          {renderValue(property.facility.certificate) || "N/A"}
                        </li>
                        <li>
                          Electricity:{" "}
                          {renderValue(property.facility.electricity) || "N/A"}{" "}
                          VA
                        </li>
                        <li>
                          Internet:{" "}
                          {renderValue(property.facility.internet) || "N/A"}
                        </li>
                        <li>
                          Water Source:{" "}
                          {renderValue(property.facility.water_source) || "N/A"}
                        </li>
                      </>
                    ) : (
                      <li>No facilities available</li>
                    )}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <div>
            <h2 className="mb-2 text-xl font-semibold">Description</h2>
            <Accordion type="single" collapsible>
              <AccordionItem value="description">
                <AccordionTrigger>Description</AccordionTrigger>
                <AccordionContent>
                  <p>
                    {renderValue(property.description) ||
                      "No description available"}
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <div>
            <h2 className="mb-2 text-xl font-semibold">Map</h2>
            {property.coordinates ? (
              <iframe
                width="100%"
                height="450"
                frameBorder="0"
                style={{ border: 0 }}
                src={`https://www.google.com/maps?q=${property.coordinates}&output=embed`}
                allowFullScreen
              ></iframe>
            ) : (
              <p>No coordinates available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleSection;
