import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

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
import { Placeholder, Popover, Whisper } from "rsuite";
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
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import KPRCalculator from "@/components/custom/CalculatorKPR";
import SocialShare from "./SocialShare";
import { cn, createUniqueSlug } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

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
    remote_image_url: string | null;
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
      remote_url: string | null;
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
        if (img.image_url === null) {
          return img.remote_image_url || "images/home_fallback.png";
        }
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
  const [toEmail] = useState(property.user?.profile?.email);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [referenceTitle] = useState(property.title);
  const uniqueSlug = createUniqueSlug(
    property.id as number,
    property.title ?? ""
  );

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
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }, []);

  if (isLoading) {
    return (
      <div className="container max-w-6xl px-4 mx-auto mt-20">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <Skeleton className="h-64 bg-gray-300" />
          <Skeleton className="h-64 bg-gray-300" />
        </div>
        <Skeleton className="h-48 mt-8 bg-gray-300" />
        <div className="grid grid-cols-1 gap-8 mt-8 md:grid-cols-2">
          <Skeleton className="h-64 bg-gray-300" />
          <Skeleton className="h-64 bg-gray-300" />
        </div>
        <Skeleton className="h-48 mt-8 bg-gray-300" />
        <Skeleton className="h-48 mt-8 bg-gray-300" />
        <Skeleton className="h-64 mt-8 bg-gray-300" />
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
      <div className="container max-w-4xl px-4 mx-auto">
        <div className="flex flex-col items-center justify-between mb-4 md:flex-row">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Beranda</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>
                  {property.title || "Detail Properti"}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <SocialShare
            url={`${window.location.origin}/post/${uniqueSlug}`}
            title={property.title || ""}
            short_desc={property.short_desc || ""}
            image_url={
              property.images?.[0]?.image_url ||
              property.images?.[0]?.remote_image_url ||
              ""
            }
          />
        </div>
      </div>

      <div className="container max-w-4xl px-4 mx-auto">
        <CardContent className="p-6">
          <div className="mb-8">
            <Carousel
              autoplay
              className="overflow-hidden rounded-lg custom-slider"
              shape={shape}
            >
              {getAllImage(property).map((imageUrl, index) => (
                <div key={index} className="relative aspect-[16/9]">
                  <img
                    src={imageUrl}
                    alt={renderValue(property.title) || "Property Image"}
                    className="object-cover w-full h-full"
                  />
                </div>
              ))}
            </Carousel>
          </div>
        </CardContent>
        <div className="mb-10 text-center wrap">
          <CardTitle className="mb-5 text-5xl font-bold text-gray-600 md:text-7xl dark:text-gray-300">
            {property.title}
          </CardTitle>
          <h3 className="mb-5 text-xl font-light dark:text-gray-800">
            {property.short_desc || "Deskripsi singkat tidak tersedia"}
          </h3>
          <div className="text-center">
            <span className="inline-block w-1 h-1 ml-1 bg-indigo-500 rounded-full"></span>
            <span className="inline-block w-3 h-1 ml-1 bg-indigo-500 rounded-full"></span>
            <span className="inline-block w-40 h-1 bg-indigo-500 rounded-full"></span>
            <span className="inline-block w-3 h-1 ml-1 bg-indigo-500 rounded-full"></span>
            <span className="inline-block w-1 h-1 ml-1 bg-indigo-500 rounded-full"></span>
          </div>
        </div>
      </div>

      <div className="container max-w-6xl px-4 mx-auto">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <Card className="bg-gray-300 dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-blue-600">
                <Info className="inline-block w-6 h-6 mr-2" />
                Informasi Properti
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <span className="mb-1 font-semibold sm:mb-0">Harga:</span>
                  <span className="text-xl font-bold text-green-600">
                    Rp {renderValue(property.price)?.toLocaleString() || "N/A"}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <span className="mb-1 text-sm font-semibold sm:mb-0">
                    Alamat:
                  </span>
                  <span className="text-sm text-left sm:text-right">
                    {renderValue(property.address)}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <span className="mb-1 text-sm font-semibold sm:mb-0">
                    Wilayah:
                  </span>
                  <span className="text-sm text-left sm:text-right">
                    {property.province.name}, {property.district.name},{" "}
                    {property.city.name}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-300 dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-blue-600">
                <User className="inline-block w-6 h-6 mr-2" />
                Informasi Pemilik
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <span className="mb-1 font-semibold sm:mb-0">Nama:</span>
                  <span className="text-sm text-left sm:text-right">
                    {renderValue(property.user?.profile?.first_name)}{" "}
                    {renderValue(property.user?.profile?.last_name)}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <span className="mb-1 text-sm font-semibold sm:mb-0">
                    Pekerjaan:
                  </span>
                  <span className="text-sm text-left sm:text-right">
                    {renderValue(property.user?.profile?.jobdesk)}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <span className="mb-1 text-sm font-semibold sm:mb-0">
                    Perusahaan:
                  </span>
                  <span className="text-sm text-left sm:text-right">
                    {renderValue(property.user?.profile?.company_name)}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <span className="mb-1 text-sm font-semibold sm:mb-0">
                    Email:
                  </span>
                  <span className="text-sm text-left sm:text-right">
                    {renderValue(property.user?.profile?.email)}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <span className="mb-1 text-sm font-semibold sm:mb-0">
                    Telepon:
                  </span>
                  <span className="text-sm text-left sm:text-right">
                    {renderValue(property.user?.profile?.phone)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="container max-w-6xl px-4 mx-auto mt-8">
        <Card className="bg-gray-300 dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-blue-600 sm:text-2xl">
              <FileText className="inline-block w-5 h-5 mr-2 sm:w-6 sm:h-6" />
              Deskripsi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700 sm:text-base dark:text-gray-800">
              {renderValue(property.description) ||
                "Tidak ada deskripsi tersedia"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="container max-w-6xl px-4 mx-auto">
        <div className="grid grid-cols-1 gap-8 mt-8 md:grid-cols-2">
          <Card className="bg-gray-300 dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-blue-600 sm:text-2xl">
                <List className="inline-block w-5 h-5 mr-2 sm:w-6 sm:h-6" />
                Spesifikasi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm sm:text-base">
                {property.specification && (
                  <>
                    <div className="flex items-center justify-between">
                      <span>Luas Tanah:</span>
                      <span className="font-semibold">
                        {renderValue(property.specification.land_size)} m²
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Luas Bangunan:</span>
                      <span className="font-semibold">
                        {renderValue(property.specification.building_size)} m²
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Kamar Tidur:</span>
                      <span className="font-semibold">
                        {renderValue(property.specification.bedroom)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Kamar Mandi:</span>
                      <span className="font-semibold">
                        {renderValue(property.specification.bathroom)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Carport:</span>
                      <span className="font-semibold">
                        {renderValue(property.specification.carport)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Jumlah Lantai:</span>
                      <span className="font-semibold">
                        {renderValue(property.specification.floors)}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-300 dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-blue-600 sm:text-2xl">
                <Shield className="inline-block w-5 h-5 mr-2 sm:w-6 sm:h-6" />
                Fasilitas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm sm:text-base">
                {property.facility && (
                  <>
                    <div className="flex items-center justify-between">
                      <span>Sertifikat:</span>
                      <span className="font-semibold">
                        {renderValue(property.facility.certificate)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Listrik:</span>
                      <span className="font-semibold">
                        {renderValue(property.facility.electricity)} VA
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Internet:</span>
                      <span className="font-semibold">
                        {renderValue(property.facility.internet)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Sumber Air:</span>
                      <span className="font-semibold">
                        {renderValue(property.facility.water_source)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Keamanan:</span>
                      <span className="font-semibold">
                        {renderValue(property.facility.security)}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="container max-w-6xl px-4 mx-auto mt-8">
        <Card className="bg-gray-300 dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-blue-600 sm:text-2xl">
              <MapPin className="inline-block w-5 h-5 mr-2 sm:w-6 sm:h-6" />
              Lokasi Terdekat
            </CardTitle>
          </CardHeader>
          <CardContent>
            {property.nearby ? (
              <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-3 sm:text-base">
                {property.nearby.split(",").map((item, index) => (
                  <div key={index} className="flex items-center">
                    <CircleCheckBig className="w-4 h-4 mr-2 text-green-500 sm:w-5 sm:h-5" />
                    <span>{item.trim()}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm italic text-gray-500 sm:text-base">
                Tidak ada informasi lokasi terdekat tersedia
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="container max-w-6xl px-4 mx-auto mt-8">
        <Card className="bg-gray-300 dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-blue-600 sm:text-2xl">
              <Map className="inline-block w-5 h-5 mr-2 sm:w-6 sm:h-6" />
              Peta Lokasi
            </CardTitle>
          </CardHeader>
          <CardContent>
            {property.coordinates ? (
              <div className="overflow-hidden rounded-lg aspect-video">
                <iframe
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  style={{ border: 0 }}
                  src={`https://www.google.com/maps?q=${property.coordinates}&output=embed`}
                  allowFullScreen
                ></iframe>
              </div>
            ) : (
              <p className="text-sm italic text-gray-500 sm:text-base">
                Koordinat tidak tersedia
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="container max-w-6xl px-4 mx-auto mt-8">
        <Card className="bg-gray-300 dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-blue-600">
              <Phone className="inline-block w-6 h-6 mr-2" />
              Kontak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                appearance="primary"
                color="green"
                onClick={toggleDiv3}
                className="flex items-center"
              >
                <Mail className="w-4 h-4 mr-2" />
                Email
              </Button>
              <Button
                appearance="primary"
                color="blue"
                className="flex items-center"
                onClick={toggleDiv2}
              >
                <Phone className="w-4 h-4 mr-2" />
                Telepon
              </Button>
              <Button
                appearance="primary"
                color="green"
                className="flex items-center"
                onClick={toggleDiv}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                WhatsApp
              </Button>
            </div>

            {showDiv && (
              <div className="p-4 mt-4 bg-blue-100 rounded-lg">
                <p className="mb-2 text-gray-800 dark:text-gray-800">
                  Chat WhatsApp pada Pemilik Properti:
                </p>
                {window.innerWidth > 768 ? (
                  <Button
                    as="a"
                    href={`https://web.whatsapp.com/send?phone=${property.user?.profile?.whatsapp}&text=${encodeURIComponent(
                      `Saya tertarik dengan properti: ${property.title}`
                    )}`}
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
                    href={`whatsapp://send?phone=${property.user?.profile?.whatsapp}&text=${encodeURIComponent(
                      `Saya tertarik dengan properti: ${property.title}`
                    )}`}
                    appearance="primary"
                    color="green"
                    className="flex items-center"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Buka Aplikasi WhatsApp
                  </Button>
                )}
              </div>
            )}

            {showDiv2 && (
              <div className="p-4 mt-4 bg-blue-100 rounded-lg">
                <p className="mb-2 text-gray-800 dark:text-gray-800">
                  Nomor Telepon Pemilik Properti:
                </p>
                {window.innerWidth > 768 ? (
                  <span className="font-semibold text-gray-900 dark:text-gray-800">
                    {property.user?.profile?.phone || "Tidak tersedia"}
                  </span>
                ) : (
                  <Button
                    as="a"
                    href={`tel:${property.user?.profile?.phone}`}
                    appearance="primary"
                    color="blue"
                    className="flex items-center"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Hubungi via Telepon
                  </Button>
                )}
              </div>
            )}

            {showDiv3 && (
              <div className="p-4 mt-4 bg-blue-100 rounded-lg">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label
                      htmlFor="name"
                      className="text-gray-700 dark:text-gray-800"
                    >
                      Nama
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Nama Anda"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="text-gray-900 transition-colors duration-200 bg-white border-gray-300 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="email"
                      className="text-gray-700 dark:text-gray-800"
                    >
                      Email
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Email Anda"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="text-gray-900 transition-colors duration-200 bg-white border-gray-300 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="noWa"
                      className="text-gray-700 dark:text-gray-800"
                    >
                      No. WhatsApp
                    </Label>
                    <Input
                      id="noWa"
                      name="noWa"
                      type="text"
                      placeholder="Nomor WhatsApp Anda"
                      value={noWa}
                      onChange={(e) => setNoWa(e.target.value)}
                      required
                      className="text-gray-900 transition-colors duration-200 bg-white border-gray-300 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="message"
                      className="text-gray-700 dark:text-gray-800"
                    >
                      Pesan
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder={`Tuliskan Pesan Anda di sini yang berkaitan dengan properti: ${property.title}`}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      className="text-gray-900 transition-colors duration-200 bg-white border-gray-300 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="captcha"
                      className="text-gray-700 dark:text-gray-800"
                    >
                      Captcha
                    </Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="captcha"
                        name="captcha"
                        type="text"
                        placeholder="Masukkan captcha"
                        value={userCaptcha}
                        onChange={(e) => setUserCaptcha(e.target.value)}
                        required
                        className="text-gray-900 transition-colors duration-200 bg-white border-gray-300 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400"
                      />
                      <div className="p-2 font-bold text-green-600 transition-colors duration-200 bg-gray-300 rounded dark:bg-gray-800 dark:text-green-400">
                        {captchaText}
                      </div>
                      <Button
                        type="button"
                        onClick={generateCaptcha}
                        className="text-white transition-colors duration-200 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
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
                      className="w-full px-4 py-2 font-bold text-white transition-colors duration-200 bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:shadow-outline dark:bg-blue-600 dark:hover:bg-blue-700"
                      disabled={isLoading2}
                    >
                      {isLoading2 ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : null}
                      Kirim
                    </Button>
                  </div>
                  {result && (
                    <div
                      id="result"
                      className="text-gray-700 dark:text-gray-800"
                    >
                      {result}
                    </div>
                  )}
                </form>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default SingleSection;
