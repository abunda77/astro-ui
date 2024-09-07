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
  RefreshCcw,
  Loader2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import KPRCalculator from "@/components/custom/CalculatorKPR";
import SocialShare from "./SocialShare";

interface Property {
  user_id: number | null;
  category_id: number | null;
  title: string | null;
  short_desc: string | null;
  description: string | null;
  price: number | null;
  period: string | null;
  address: string | null;
  province_id: string | null;
  district_id: string | null;
  city_id: string | null;
  village_id: string | null;
  coordinates: string | null;
  nearby: string | null;

  ads: string | null;
  status: string | null;
  views_count: number | null;
  meta_title: string | null;
  meta_description: string | null;
  keywords: string | null;
  id: number | null;
  created_at: string | null;
  updated_at: string | null;
  facility: {
    certificate: string | null;
    electricity: number | null;
    line_phone: string | null;
    internet: string | null;
    road_width: string | null;
    water_source: string | null;
    hook: string | null;
    condition: string | null;
    security: string | null;
    wastafel: string | null;
    id: number;
  };
  specification: {
    land_size: number | null;
    building_size: number | null;
    bedroom: number | null;
    carport: string | null;
    bathroom: number | null;
    dining_room: string | null;
    living_room: string | null;
    floors: number | null;
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
      first_name: string | null;
      last_name: string | null;
      phone: string | null;
      email: string | null;
      whatsapp: string | null;
      company_name: string | null;
      avatar: string | null;
      biodata_company: string | null;
      jobdesk: string | null;
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

  const [captchaText, setCaptchaText] = useState("");
  const [userCaptcha, setUserCaptcha] = useState("");
  const [noWa, setNoWa] = useState("");
  const [alertStatus, setAlertStatus] = useState<"success" | "error" | null>(
    null
  );
  const [isLoading2, setIsLoading2] = useState(false);
  const [result, setResult] = useState("");
  const [subject, setSubject] = useState(
    `Pertanyaan Pengunjung tentang ${property.title}`
  );
  const [name, setName] = useState("");
  const [toName] = useState(
    `${property.user?.profile?.first_name} ${property.user?.profile?.last_name}`
  );
  const [toEmail] = useState(property.user.profile.email);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  // tambahkan const untuk url referensi dari title property
  const [referenceTitle] = useState(property.title);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (userCaptcha !== captchaText) {
      toast({
        title: "Error",
        description: "Captcha salah. Silakan coba lagi.",
        variant: "destructive",
      });
      setAlertStatus("error");
      return;
    }

    setIsLoading2(true);
    setResult("Mohon tunggu...");

    const formData = {
      access_key: import.meta.env.PUBLIC_APIKEY_BREVO,
      sender: {
        email: import.meta.env.PUBLIC_MAIL_FROM_ADDRESS,
        name: name,
      },
      to: [
        {
          name: toName,
          email: toEmail,
        },
      ],
      replyTo: {
        email: email,
      },
      subject,
      htmlContent: `<p><strong>Nama:</strong> ${name}</p>
                  <p><strong>Nomor WhatsApp:</strong> ${noWa}</p>
                  <p><strong>Email:</strong> ${email}</p>
                  <p><strong>Berkaitan dengan :</strong> ${referenceTitle}</p>
                  <p><strong>Pesan:</strong> ${message}</p>`,
    };

    try {
      const response = await fetch(
        `${import.meta.env.PUBLIC_URL_BREVO}/v3/smtp/email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "api-key": import.meta.env.PUBLIC_APIKEY_BREVO,
          },
          body: JSON.stringify(formData),
        }
      );

      const json = await response.json();

      if (response.status === 200 || response.status === 201) {
        setResult(json.message);
        toast({
          title: "Sukses",
          description: "Pesan berhasil terkirim",
        });
        setAlertStatus("success");
        // Reset form fields after successful submission
        setName("");
        setEmail("");
        setMessage("");
      } else {
        console.log(response);
        setResult(json.message);
        toast({
          title: "Error",
          description: "Terjadi kesalahan saat mengirim pesan",
          variant: "destructive",
        });
        setAlertStatus("error");
      }
    } catch (error) {
      console.error("Error saat mengirim email:", error);
      setResult("Terjadi kesalahan!");
      toast({
        title: "Error",
        description: "Gagal mengirim email. Silakan coba lagi.",
        variant: "destructive",
      });
      setAlertStatus("error");
    } finally {
      setIsLoading2(false);

      setTimeout(() => {
        setResult("");
        setAlertStatus(null);
      }, 3000);
    }
  };

  const generateCaptcha = () => {
    const randomString = Math.random().toString(36).substring(2, 8);
    setCaptchaText(randomString);
  };
  useEffect(() => {
    generateCaptcha();
  }, []);

  const [showDiv, setShowDiv] = useState(false);
  const [showDiv2, setShowDiv2] = useState(false);
  const [showDiv3, setShowDiv3] = useState(false);

  const toggleDiv = () => {
    setShowDiv(!showDiv);
    if (!showDiv) {
      setShowDiv2(false);
      setShowDiv3(false);
    }
  };

  const toggleDiv2 = () => {
    setShowDiv2(!showDiv2);
    if (!showDiv2) {
      setShowDiv(false);
      setShowDiv3(false);
    }
  };

  const toggleDiv3 = () => {
    setShowDiv3(!showDiv3);
    if (!showDiv3) {
      setShowDiv(false);
      setShowDiv2(false);
    }
  };

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
      return <span>N/A</span>;
    }
    return value;
  };

  return (
    <section className="py-12 bg-gradient-to-t from-blue-200 via-blue-100 to-white dark:from-gray-800 dark:via-gray-700 dark:to-gray-600">
      <div className="container max-w-4xl px-4 py-12 mx-auto">
        <div className="container px-4 mx-auto">
          <div className="flex items-center justify-between mb-8">
            <Button
              appearance="primary"
              color="green"
              href="/"
              className="transition-colors"
            >
              <Home className="w-4 h-4 mr-2 text-white dark:text-gray-300" />
              Kembali ke Beranda
            </Button>
            <div className="p-2 bg-white rounded-lg shadow-md dark:bg-gray-800">
              <SocialShare
                url={window.location.href}
                title={property.title || ""}
                short_desc={property.short_desc || ""}
                image_url={property.images?.[0]?.image_url || ""}
              />
            </div>
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
              <div className="flex flex-col items-center justify-between mb-8">
                <Avatar className="w-24 h-24 mb-4 -mt-28">
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
                <div className="mb-6 text-center">
                  <p className="font-semibold">
                    {renderValue(property.user?.profile?.first_name)}{" "}
                    {renderValue(property.user?.profile?.last_name)}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {renderValue(property.user?.profile?.jobdesk)}
                  </p>
                </div>
                <div className="flex flex-col space-y-4 text-center">
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
              </div>

              <div className="grid grid-cols-1 gap-8 mb-8 md:grid-cols-2">
                <div>
                  <h2 className="mb-4 text-2xl font-semibold text-yellow-600 dark:text-yellow-400">
                    <Info className="inline-block w-6 h-6 mr-2 text-indigo-600 dark:text-indigo-400" />
                    Deskripsi Singkat
                  </h2>
                  <Accordion
                    type="single"
                    collapsible
                    className="transition-all duration-300 bg-white rounded-md shadow-md dark:bg-gray-800"
                  >
                    <AccordionItem value="deskripsi-singkat">
                      <AccordionTrigger className="px-4 py-3 text-gray-800 transition-colors duration-200 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                        Lihat Deskripsi Singkat
                      </AccordionTrigger>
                      <AccordionContent className="px-4 py-3 bg-gray-50 dark:bg-gray-900">
                        <p className="text-left text-gray-700 dark:text-gray-300">
                          {renderValue(property.short_desc)}
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
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
                    <Whisper
                      trigger="click"
                      placement={window.innerWidth > 768 ? "bottom" : "right"}
                      speaker={
                        <Popover className="p-4 bg-white rounded-md shadow-md dark:bg-gray-800">
                          <KPRCalculator
                            propertyPrice={renderValue(property.price)}
                          />
                        </Popover>
                      }
                    >
                      <span className="inline-block px-3 py-1 ml-2 text-sm font-semibold text-white bg-blue-600 rounded-full cursor-pointer">
                        Simulasi KPR
                      </span>
                    </Whisper>
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
                        <p>
                          Kirim email ke pemilik properti :{" "}
                          {property.user?.profile?.email}
                        </p>
                      </Popover>
                    }
                  >
                    <Button
                      appearance="ghost"
                      color="green"
                      onClick={toggleDiv3}
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
                      onClick={toggleDiv2}
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Telepon
                    </Button>
                  </Whisper>

                  <div>
                    <Whisper
                      placement="top"
                      trigger="click"
                      speaker={
                        <Popover title="WhatsApp">
                          <p>Kirim pesan WhatsApp ke pemilik properti</p>
                          {window.innerWidth > 768 ? (
                            <a
                              href={`https://web.whatsapp.com/send?text=${encodeURIComponent(`Saya tertarik dengan properti: ${property.title}`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Buka WhatsApp Web
                            </a>
                          ) : (
                            <a
                              href={`whatsapp://send?text=${encodeURIComponent(`Saya tertarik dengan properti: ${property.title}`)}`}
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
                        onClick={toggleDiv}
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        WhatsApp
                      </Button>
                    </Whisper>
                  </div>
                </div>
                {/* show div element 1 */}
                {showDiv && (
                  <div className="p-2 mt-2 bg-green-100 rounded">
                    <p>
                      Chat WhatsApp pada Pemilik Properti:{" "}
                      {window.innerWidth > 768 ? (
                        <Button
                          as="a"
                          href={`https://web.whatsapp.com/send?phone=${property.user?.profile?.whatsapp}&text=${encodeURIComponent(`Saya tertarik dengan properti: ${property.title}`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          appearance="primary"
                          color="green"
                          className="flex items-center"
                        >
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Buka WhatsApp Web
                        </Button>
                      ) : (
                        <Button
                          as="a"
                          href={`whatsapp://send?phone=${property.user?.profile?.whatsapp}&text=${encodeURIComponent(`Saya tertarik dengan properti: ${property.title}`)}`}
                          appearance="primary"
                          color="green"
                          className="flex items-center"
                        >
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Buka Aplikasi WhatsApp
                        </Button>
                      )}
                    </p>
                  </div>
                )}
                {/* Show div element 2 */}
                {showDiv2 && (
                  <div className="p-2 mt-2 bg-green-100 rounded">
                    <p>
                      Nomor Telepon Pemilik Properti :{" "}
                      {window.innerWidth > 768 ? (
                        <span>
                          {property.user?.profile?.phone || "Tidak tersedia"}
                        </span>
                      ) : (
                        <Button
                          as="a"
                          href={`tel:${property.user?.profile?.phone}`}
                          appearance="ghost"
                          color="green"
                          className="flex items-center"
                        >
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Hubungi via Telepon
                        </Button>
                      )}
                    </p>
                  </div>
                )}
                {/* show element div3 */}
                {alertStatus === "success" && (
                  <Alert className="mb-4 bg-green-200 dark:bg-green-100 dark:text-gray-700">
                    <Terminal className="w-4 h-4" />
                    <AlertTitle>Sukses!</AlertTitle>
                    <AlertDescription>
                      Pesan Anda berhasil terkirim ke pemilik iklan.
                    </AlertDescription>
                  </Alert>
                )}
                {alertStatus === "error" && (
                  <Alert variant="destructive" className="mb-4">
                    <Terminal className="w-4 h-4" />
                    <AlertTitle>Error!</AlertTitle>
                    <AlertDescription>
                      Terjadi kesalahan saat mengirim pesan. Silakan coba lagi.
                    </AlertDescription>
                  </Alert>
                )}
                {showDiv3 && (
                  <div className="p-2 mt-2 rounded bg-gray-50 dark:bg-gray-900">
                    <form onSubmit={handleSubmit}>
                      <div className="mb-4">
                        <Label
                          className="block mb-2 text-sm font-bold text-gray-700 dark:text-gray-300"
                          htmlFor="name"
                        >
                          Nama
                        </Label>
                        <Input
                          className="w-full px-3 py-2 text-gray-700 bg-gray-200 rounded shadow dark:bg-gray-600 dark:text-gray-300 focus:border-green-800 dark:focus:border-green-100"
                          id="name"
                          name="name"
                          type="text"
                          placeholder="Nama"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <Label
                          className="block mb-2 text-sm font-bold text-gray-700 dark:text-gray-300"
                          htmlFor="email"
                        >
                          Email
                        </Label>
                        <Input
                          className="w-full px-3 py-2 text-gray-700 bg-gray-200 rounded shadow dark:bg-gray-600 dark:text-gray-300 focus:border-green-800 dark:focus:border-green-100"
                          id="email"
                          name="email"
                          type="email"
                          placeholder="Email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <Label
                          className="block mb-2 text-sm font-bold text-gray-700 dark:text-gray-300"
                          htmlFor="subject"
                        >
                          Subject
                        </Label>
                        <Input
                          className="w-full px-3 py-2 text-gray-700 bg-gray-200 rounded shadow dark:bg-gray-600 dark:text-gray-300 focus:border-green-800 dark:focus:border-green-100"
                          id="subject"
                          name="subject"
                          type="text"
                          placeholder="Subject"
                          value={subject}
                          onChange={(e) => setSubject(e.target.value)}
                          required
                          readOnly
                        />
                      </div>
                      <div className="mb-4">
                        <Label
                          className="block mb-2 text-sm font-bold text-gray-700 dark:text-gray-300"
                          htmlFor="message"
                        >
                          Pesan
                        </Label>
                        <Textarea
                          className="w-full px-3 py-2 text-gray-700 bg-gray-200 rounded shadow dark:bg-gray-600 dark:text-gray-300 "
                          id="message"
                          name="message"
                          placeholder={`Tuliskan Pesan Anda di sini yang berkaitan dengan properti: ${property.title}`}
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <Label
                          className="block mb-2 text-sm font-bold text-gray-700 dark:text-gray-300"
                          htmlFor="noWa"
                        >
                          No. WhatsApp
                        </Label>
                        <Input
                          className="w-full px-3 py-2 text-gray-700 bg-gray-200 rounded shadow dark:bg-gray-600 dark:text-gray-300 focus:border-green-800 dark:focus:border-green-100"
                          id="noWa"
                          name="noWa"
                          type="text"
                          placeholder="Masukan No. WhatsApp Anda"
                          value={noWa}
                          onChange={(e) => setNoWa(e.target.value)}
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <Label
                          className="block mb-2 text-sm font-bold text-gray-700 dark:text-gray-300"
                          htmlFor="captcha"
                        >
                          Captcha
                        </Label>
                        <div className="flex items-center space-x-2">
                          <Input
                            className="px-3 py-2 text-gray-700 bg-gray-200 rounded shadow w-36 dark:bg-gray-600 dark:text-gray-300 focus:border-green-800 dark:focus:border-green-100"
                            id="captcha"
                            name="captcha"
                            type="text"
                            placeholder="Masukkan captcha di samping"
                            value={userCaptcha}
                            onChange={(e) => setUserCaptcha(e.target.value)}
                            required
                          />
                          <div className="p-2 text-green-600 bg-gray-200 rounded dark:bg-gray-600 dark:text-green-400">
                            {captchaText}
                          </div>
                          <Button
                            type="button"
                            onClick={generateCaptcha}
                            className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-300 dark:hover:bg-blue-500"
                          >
                            <RefreshCcw className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <Button
                          appearance="primary"
                          color="blue"
                          type="submit"
                          className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline dark:bg-blue-700 dark:hover:bg-blue-800"
                          disabled={isLoading2}
                        >
                          {isLoading2 ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : null}
                          Kirim
                        </Button>
                      </div>
                      {result && <div id="result">{result}</div>}
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SingleSection;
