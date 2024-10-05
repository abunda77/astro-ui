import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { badgeVariants } from "@/components/ui/badge";
import { Loader2, X, Trash2 } from "lucide-react";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EditDetailProperti from "./EditDetailProperti";
import EditSpecification from "./EditSpecificationProperti";
import EditFacility from "./EditFacilityProperti";
import EditImageProperti from "./EditImageProperti";
import EditMapProperti from "./EditMapProperti";
import { getCookie } from "@/utils/auth";

interface PropertyList {
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
}

const categories = [
  { key: 11, value: "Home" },
  { key: 12, value: "Apartment" },
  { key: 13, value: "Kavling" },
  { key: 14, value: "Office" },
  { key: 15, value: "Warehouse" },
];
const period = [
  { key: "onetime", value: "Sekali Bayar" },
  { key: "monthly", value: "Bulanan" },
  { key: "yearly", value: "Tahunan" },
  { key: "weekly", value: "Mingguan" },
];

const ads = [
  { key: "sell", value: "Dijual" },
  { key: "rent", value: "Disewakan" },
];

const status = [
  { key: "active", value: "Aktif" },
  { key: "sold", value: "Terjual" },
  { key: "rented", value: "Disewakan" },
  { key: "inactive", value: "Tidak Aktif" },
];

const certificates = [
  { key: "shm", value: "SHM (Sertifikat Hak Milik)" },
  { key: "shgb", value: "SHGB (Sertifikat Hak Guna Bangunan)" },
  { key: "shp", value: "SHP (Sertifikat Hak Pakai)" },
  { key: "shgu", value: "SHGU (Sertifikat Hak Guna Usaha)" },
  {
    key: "shmsrs",
    value: "SHMSRS (Sertifikat Hak Milik atas Satuan Rumah Susun)",
  },
  { key: "sta", value: "STA (Sertifikat Tanah Adat)" },
];

const linePhoneOptions = [
  { key: "yes", value: "Ya" },
  { key: "no", value: "Tidak" },
  { key: "progress", value: "Dalam Proses" },
];

const hookOptions = [
  { key: "yes", value: "Ya" },
  { key: "no", value: "Tidak" },
];

const conditionOptions = [
  { key: "very_good", value: "Sangat Baik" },
  { key: "good", value: "Baik" },
  { key: "semi_good", value: "Cukup Baik" },
  { key: "average", value: "Rata-rata" },
  { key: "not_good", value: "Kurang Baik" },
  { key: "bad", value: "Buruk" },
  { key: "very_bad", value: "Sangat Buruk" },
];

const securityOptions = [
  { key: "yes", value: "Ya" },
  { key: "no", value: "Tidak" },
];

const wastafelOptions = [
  { key: "yes", value: "Ya" },
  { key: "no", value: "Tidak" },
];
const internetOptions = [
  { key: "telkom_indihome", value: "Telkom IndiHome" },
  { key: "firstmedia", value: "First Media" },
  { key: "biznet", value: "Biznet" },
  { key: "myrepublic", value: "MyRepublic" },
  { key: "cbn", value: "CBN" },
  { key: "mncplay", value: "MNC Play" },
  { key: "xl_home", value: "XL Home" },
  { key: "oxygen", value: "Oxygen.id" },
  { key: "iconnet", value: "Icon+" },
  { key: "transvision", value: "Transvision" },
  { key: "megavision", value: "Megavision" },
  { key: "other", value: "Lainnya" },
];
const waterSourceOptions = [
  { key: "pam", value: "PAM (Perusahaan Air Minum)" },
  { key: "pdam", value: "PDAM (Perusahaan Daerah Air Minum)" },
  { key: "sumur_bor", value: "Sumur Bor" },
  { key: "sumur_gali", value: "Sumur Gali" },
  { key: "mata_air", value: "Mata Air" },
  { key: "sungai", value: "Sungai" },
  { key: "air_hujan", value: "Air Hujan" },
  { key: "air_kemasan", value: "Air Kemasan" },
  { key: "air_isi_ulang", value: "Air Isi Ulang" },
  { key: "embung", value: "Embung" },
  { key: "danau", value: "Danau" },
  { key: "waduk", value: "Waduk" },
  { key: "desalinasi", value: "Desalinasi Air Laut" },
  { key: "lainnya", value: "Lainnya" },
];

const FASTAPI_LOGIN = import.meta.env.PUBLIC_FASTAPI_ENDPOINT;
interface PropertyListProps {
  properties: PropertyList[] | null;
  isLoading: boolean;
  homedomain: string;
}

const PropertyList: React.FC<PropertyListProps> = ({
  properties,
  isLoading,
  homedomain,
}) => {
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<PropertyList | null>(
    null
  );
  const [loadingPropertyId, setLoadingPropertyId] = useState<number | null>(
    null
  );
  const [editingPropertyId, setEditingPropertyId] = useState<number | null>(
    null
  );

  useEffect(() => {
    const loadData = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setLoading(false);
      } catch (error) {
        console.error("Error memuat data properti:", error);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const getImageUrl = (property: PropertyList) => {
    if (property.images && property.images.length > 0) {
      const primaryImage = property.images.find((img) => img.is_primary);
      let imageUrl;
      if (primaryImage) {
        imageUrl = primaryImage.image_url || primaryImage.remote_image_url;
      } else {
        imageUrl =
          property.images[0].image_url || property.images[0].remote_image_url;
      }
      if (imageUrl) {
        imageUrl = imageUrl.startsWith("/") ? imageUrl.substring(1) : imageUrl;
        imageUrl = imageUrl.replace(/[",/\\]/g, "");
        return `${homedomain}/storage/${imageUrl}`;
      }
    }
    return `${homedomain}/images/home_fallback.png`;
  };

  const fetchPropertyDetails = async (propertyId: number) => {
    try {
      setLoadingPropertyId(propertyId);
      const token = getCookie("access_token");
      const response = await fetch(
        `${FASTAPI_LOGIN}/properties/${propertyId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Gagal mengambil detail properti");
      }
      const data = await response.json();
      setSelectedProperty(data);
    } catch (error) {
      console.error("Error mengambil detail properti:", error);
    } finally {
      setLoadingPropertyId(null);
    }
  };

  const handleEditProperty = (propertyId: number) => {
    setEditingPropertyId(propertyId);
  };

  const handleSaveProperty = async (updatedProperty: Partial<PropertyList>) => {
    try {
      const token = getCookie("access_token");
      const response = await fetch(
        `${FASTAPI_LOGIN}/properties/${updatedProperty.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedProperty),
        }
      );

      if (!response.ok) {
        throw new Error("Gagal menyimpan perubahan properti");
      }

      // Refresh data properti setelah berhasil diupdate
      const updatedProperties = properties?.map((prop) =>
        prop.id === updatedProperty.id ? { ...prop, ...updatedProperty } : prop
      );
      // Asumsi ada fungsi untuk memperbarui daftar properti
      // updateProperties(updatedProperties);
    } catch (error) {
      console.error("Error menyimpan perubahan properti:", error);
    }
  };

  const handleSaveFacility = async (
    propertyId: number,
    facilityId: number,
    updatedFacility: Partial<PropertyList["facility"]>
  ) => {
    try {
      console.log("Menyimpan perubahan fasilitas untuk properti:", propertyId);
      console.log("ID Fasilitas:", facilityId);
      console.log("Data Fasilitas yang Diperbarui:", updatedFacility);

      const token = getCookie("access_token");
      const response = await fetch(
        `${FASTAPI_LOGIN}/properties/${propertyId}/facilities/${facilityId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedFacility),
        }
      );

      if (!response.ok) {
        throw new Error("Gagal menyimpan perubahan fasilitas");
      }

      // Refresh data fasilitas setelah berhasil diupdate
      const updatedProperties = properties?.map((prop) =>
        prop.id === propertyId
          ? {
              ...prop,
              facility:
                prop.facility?.id === facilityId
                  ? { ...prop.facility, ...updatedFacility }
                  : prop.facility,
            }
          : prop
      );
      // Asumsi ada fungsi untuk memperbarui daftar properti
      // updateProperties(updatedProperties);
    } catch (error) {
      console.error("Error menyimpan perubahan fasilitas:", error);
    }
  };

  const handleSaveSpecification = async (
    propertyId: number,
    specificationId: number,
    updatedSpecification: Partial<PropertyList["specification"]>
  ) => {
    try {
      console.log(
        "Menyimpan perubahan spesifikasi untuk properti:",
        propertyId
      );
      console.log("ID Spesifikasi:", specificationId);
      console.log("Data Spesifikasi yang Diperbarui:", updatedSpecification);

      const token = getCookie("access_token");
      const response = await fetch(
        `${FASTAPI_LOGIN}/properties/${propertyId}/specifications/${specificationId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            land_size: updatedSpecification.land_size || 0,
            building_size: updatedSpecification.building_size || 0,
            bedroom: updatedSpecification.bedroom || 0,
            carpot: updatedSpecification.carport || 0,
            bathroom: updatedSpecification.bathroom || 0,
            dining_room: updatedSpecification.dining_room || 0,
            living_room: updatedSpecification.living_room || 0,
            floors: updatedSpecification.floors || 0,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Gagal menyimpan perubahan spesifikasi");
      }

      // Refresh data spesifikasi setelah berhasil diupdate
      const updatedProperties = properties?.map((prop) =>
        prop.id === propertyId
          ? {
              ...prop,
              specification:
                prop.specification?.id === specificationId
                  ? { ...prop.specification, ...updatedSpecification }
                  : prop.specification,
            }
          : prop
      );
      // Asumsi ada fungsi untuk memperbarui daftar properti
      // updateProperties(updatedProperties);
    } catch (error) {
      console.error("Error menyimpan perubahan spesifikasi:", error);
    }
  };

  const handleSaveImage = async (
    propertyId: number,
    updatedImages: Array<{ id: number; image_url: string }>
  ) => {
    try {
      console.log("ID Properti:", propertyId);
      console.log("Gambar yang diperbarui:", updatedImages);

      // Tidak perlu melakukan permintaan PUT ke server
      // Gambar sudah diperbarui di komponen EditImageProperti

      // Perbarui state lokal jika diperlukan
      const updatedProperties = properties?.map((prop) =>
        prop.id === propertyId
          ? {
              ...prop,
              images: updatedImages,
            }
          : prop
      );

      // Jika ada fungsi untuk memperbarui daftar properti, panggil di sini
      // updateProperties(updatedProperties);

      console.log("Gambar properti berhasil diperbarui");
    } catch (error) {
      console.error("Error memperbarui gambar properti:", error);
    }
  };

  // const handleSaveMap = async (
  //   propertyId: number,
  //   updatedCoordinates: string
  // ) => {
  //   try {
  //     const token = getCookie("access_token");
  //     const response = await fetch(
  //       `${FASTAPI_LOGIN}/properties/${propertyId}`,
  //       {
  //         method: "PUT",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${token}`,
  //         },
  //         body: JSON.stringify({
  //           coordinates: updatedCoordinates,
  //         }),
  //       }
  //     );

  //     if (!response.ok) {
  //       throw new Error("Gagal menyimpan perubahan koordinat");
  //     }

  //     // Refresh data properti setelah berhasil diupdate
  //     const updatedProperties = properties?.map((prop) =>
  //       prop.id === propertyId
  //         ? { ...prop, coordinates: updatedCoordinates }
  //         : prop
  //     );
  //     // Asumsi ada fungsi untuk memperbarui daftar properti
  //     // updateProperties(updatedProperties);

  //     console.log("Koordinat properti berhasil diperbarui");
  //   } catch (error) {
  //     console.error("Error memperbarui koordinat properti:", error);
  //   }
  // };

  if (loading) {
    return (
      <Card className="max-w-full p-4 rounded-lg shadow-lg md:p-6 bg-gradient-to-br from-blue-100 to-purple-200 dark:from-gray-800 dark:to-purple-900">
        <CardHeader className="mb-4 md:mb-6">
          <Skeleton className="h-6 mb-2 w-36 md:w-48 md:h-8 animate-pulse" />
          <Skeleton className="w-48 h-4 md:w-64 md:h-6 animate-pulse" />
        </CardHeader>
        <CardContent className="space-y-4 md:space-y-6">
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-6 w-36 md:w-48 md:h-8 animate-pulse" />
            <Skeleton className="w-24 h-8 md:w-32 md:h-10 animate-pulse" />
          </div>
          {[1, 2, 3].map((index) => (
            <div
              key={index}
              className="flex items-center p-4 rounded-lg shadow-md bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
            >
              <Skeleton className="w-16 h-16 mr-4 rounded-lg animate-pulse" />
              <div className="flex-grow">
                <Skeleton className="w-3/4 h-4 mb-2 animate-pulse" />
                <Skeleton className="w-1/2 h-3 animate-pulse" />
              </div>
              <Skeleton className="w-16 h-8 animate-pulse" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!properties || properties.length === 0) {
    return (
      <Card className="flex items-center justify-center h-64 max-w-full p-4 rounded-lg shadow-lg md:p-6 bg-gradient-to-br from-blue-100 to-purple-200 dark:from-gray-800 dark:to-purple-900">
        <Button
          variant="outline"
          size="lg"
          className="text-white bg-blue-500 hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800"
        >
          Buat Iklan Properti
        </Button>
      </Card>
    );
  }

  return (
    <Card className="w-full p-4 mx-auto rounded-lg shadow-lg max-w-7xl md:p-6 bg-gradient-to-br from-blue-100 to-purple-200 dark:from-gray-800 dark:to-purple-900">
      <CardHeader className="mb-4 space-y-2 md:mb-6">
        <CardTitle className="text-2xl font-bold text-blue-800 md:text-3xl lg:text-4xl dark:text-blue-300">
          Daftar Properti
        </CardTitle>
        <CardDescription className="text-lg font-semibold text-blue-700 md:text-xl lg:text-2xl dark:text-blue-300">
          Properti yang Anda miliki
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-start justify-between md:flex-row md:items-center">
          <h3 className="mb-4 text-xl font-semibold text-blue-700 md:mb-0 dark:text-blue-300">
            Properti Anda
          </h3>
          <Button
            size="lg"
            className="w-full text-base text-white bg-blue-500 hover:bg-blue-600 dark:text-gray-100 dark:bg-blue-700 dark:hover:bg-blue-800 md:w-auto"
          >
            Tambah Properti
          </Button>
        </div>
        {properties.map((property) => (
          <div
            key={property.id}
            className="flex flex-col p-4 space-y-4 rounded-lg shadow-md md:space-y-0 md:flex-row md:items-center md:space-x-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
          >
            <img
              src={getImageUrl(property)}
              alt={property.title || "Gambar Properti"}
              className="object-cover w-full h-48 mb-4 rounded-lg md:w-48 md:h-32 md:mb-0 ring-2 ring-blue-300 dark:ring-blue-600"
            />
            <div className="flex-grow space-y-2">
              <h4 className="text-xl font-semibold text-blue-800 dark:text-blue-300">
                {property.title || "Tidak ada judul"}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {property.short_desc || "Tidak ada deskripsi singkat"}
              </p>
            </div>
            <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
              <Drawer>
                <DrawerTrigger asChild>
                  <Button
                    size="sm"
                    className="w-full text-sm text-white bg-blue-500 hover:bg-blue-600 dark:text-gray-100 dark:bg-blue-700 dark:hover:bg-blue-800 md:w-auto"
                    onClick={() =>
                      property.id && fetchPropertyDetails(property.id)
                    }
                  >
                    {loadingPropertyId === property.id ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : null}
                    {loadingPropertyId === property.id ? "Memuat..." : "Detail"}
                  </Button>
                </DrawerTrigger>
                <DrawerContent className="sm:max-w-[90%] md:max-w-[80%] lg:max-w-[70%] xl:max-w-[60%] h-[90vh] sm:h-[95vh] mx-auto">
                  <DrawerHeader className="pb-4 border-b">
                    <DrawerTitle className="text-2xl font-bold text-blue-600">
                      Detail Properti
                    </DrawerTitle>
                    <DrawerDescription className="text-gray-500">
                      Informasi lengkap tentang properti Anda.
                    </DrawerDescription>
                    <DrawerClose className="absolute top-2 right-2">
                      <Button
                        size="icon"
                        className="text-white bg-blue-500 hover:bg-blue-600 dark:text-gray-100 dark:bg-blue-700 dark:hover:bg-blue-800"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </DrawerClose>
                  </DrawerHeader>
                  <div className="p-6">
                    <Tabs defaultValue="detail-info">
                      <TabsList className="flex flex-row w-full p-2 mt-2 space-x-2 overflow-y-auto">
                        <TabsTrigger
                          value="detail-info"
                          className="data-[state=active]:text-blue-600"
                        >
                          Detail Info
                        </TabsTrigger>
                        <TabsTrigger
                          value="image"
                          className="data-[state=active]:text-blue-600"
                        >
                          Image
                        </TabsTrigger>
                        <TabsTrigger
                          value="specification"
                          className="data-[state=active]:text-blue-600"
                        >
                          Specification
                        </TabsTrigger>
                        <TabsTrigger
                          value="facility"
                          className="data-[state=active]:text-blue-600"
                        >
                          Facility
                        </TabsTrigger>
                        <TabsTrigger
                          value="map"
                          className="data-[state=active]:text-blue-600"
                        >
                          Peta
                        </TabsTrigger>
                      </TabsList>
                      <div className="flex-grow overflow-auto">
                        <TabsContent value="detail-info" className="h-full">
                          {selectedProperty && (
                            <>
                              <Card className="mb-4">
                                <CardHeader>
                                  <CardTitle className="text-lg sm:text-xl">
                                    Informasi Umum
                                  </CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                      <div className="flex justify-between">
                                        <span className="text-sm font-semibold sm:text-base">
                                          Kategori:
                                        </span>
                                        <span className="text-sm sm:text-base">
                                          {categories.find(
                                            (cat) =>
                                              cat.key ===
                                              selectedProperty.category_id
                                          )?.value || "Tidak diketahui"}
                                        </span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-sm font-semibold sm:text-base">
                                          Judul:
                                        </span>
                                        <span className="text-sm sm:text-base">
                                          {selectedProperty.title}
                                        </span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-sm font-semibold sm:text-base">
                                          Deskripsi Singkat:
                                        </span>
                                        <span className="text-sm sm:text-base">
                                          {selectedProperty.short_desc}
                                        </span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-sm font-semibold sm:text-base">
                                          Harga:
                                        </span>
                                        <span className="text-sm sm:text-base">
                                          Rp{" "}
                                          {selectedProperty.price?.toLocaleString()}
                                        </span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-sm font-semibold sm:text-base">
                                          Periode:
                                        </span>
                                        <span className="text-sm sm:text-base">
                                          {period.find(
                                            (p) =>
                                              p.key === selectedProperty.period
                                          )?.value || "Tidak diketahui"}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="space-y-2">
                                      <div className="flex justify-between">
                                        <span className="text-sm font-semibold sm:text-base">
                                          Alamat:
                                        </span>
                                        <span className="text-sm sm:text-base">
                                          {selectedProperty.address}
                                        </span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-sm font-semibold sm:text-base">
                                          Provinsi:
                                        </span>
                                        <span className="text-sm sm:text-base">
                                          {selectedProperty.province.name}
                                        </span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-sm font-semibold sm:text-base">
                                          Kabupaten:
                                        </span>
                                        <span className="text-sm sm:text-base">
                                          {selectedProperty.district.name}
                                        </span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-sm font-semibold sm:text-base">
                                          Kota:
                                        </span>
                                        <span className="text-sm sm:text-base">
                                          {selectedProperty.city.name}
                                        </span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-sm font-semibold sm:text-base">
                                          Desa:
                                        </span>
                                        <span className="text-sm sm:text-base">
                                          {selectedProperty.village.name}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                              <Card className="mb-4">
                                <CardHeader>
                                  <CardTitle className="text-lg sm:text-xl">
                                    Informasi Tambahan
                                  </CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                      <div className="flex justify-between">
                                        <span className="text-sm font-semibold sm:text-base">
                                          Tempat Terdekat:
                                        </span>
                                        <span className="text-sm sm:text-base">
                                          {selectedProperty.nearby}
                                        </span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-sm font-semibold sm:text-base">
                                          Iklan:
                                        </span>
                                        <span className="text-sm sm:text-base">
                                          {ads.find(
                                            (ad) =>
                                              ad.key === selectedProperty.ads
                                          )?.value || "Tidak diketahui"}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="space-y-2">
                                      <div className="flex justify-between">
                                        <span className="text-sm font-semibold sm:text-base">
                                          Status:
                                        </span>
                                        <span className="text-sm sm:text-base">
                                          {status.find(
                                            (s) =>
                                              s.key === selectedProperty.status
                                          )?.value || "Tidak diketahui"}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>

                              <Card>
                                <CardHeader>
                                  <CardTitle className="text-lg sm:text-xl">
                                    SEO
                                  </CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                      <div className="flex justify-between">
                                        <span className="text-sm font-semibold sm:text-base">
                                          Meta Title:
                                        </span>
                                        <span className="text-sm sm:text-base">
                                          {selectedProperty.meta_title}
                                        </span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-sm font-semibold sm:text-base">
                                          Meta Description:
                                        </span>
                                        <span className="text-sm sm:text-base">
                                          {selectedProperty.meta_description}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="space-y-2">
                                      <div className="flex justify-between">
                                        <span className="text-sm font-semibold sm:text-base">
                                          Kata Kunci:
                                        </span>
                                        <span className="text-sm sm:text-base">
                                          {selectedProperty.keywords}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </>
                          )}
                        </TabsContent>

                        <TabsContent value="image">
                          {selectedProperty && selectedProperty.images && (
                            <div className="grid grid-cols-2 gap-4">
                              {selectedProperty.images.map((image) => (
                                <img
                                  key={image.id}
                                  src={getImageUrl({
                                    ...selectedProperty,
                                    images: [image],
                                  })}
                                  alt={`Properti ${selectedProperty.title}`}
                                  className="object-cover w-full h-48 rounded-lg"
                                />
                              ))}
                            </div>
                          )}
                        </TabsContent>

                        <TabsContent value="specification">
                          {selectedProperty &&
                            selectedProperty.specification && (
                              <>
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="flex justify-between">
                                    <span className="font-semibold">
                                      Luas Tanah:
                                    </span>
                                    <span>
                                      {selectedProperty.specification.land_size}{" "}
                                      m²
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="font-semibold">
                                      Luas Bangunan:
                                    </span>
                                    <span>
                                      {
                                        selectedProperty.specification
                                          .building_size
                                      }{" "}
                                      m²
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="font-semibold">
                                      Kamar Tidur:
                                    </span>
                                    <span>
                                      {selectedProperty.specification.bedroom}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="font-semibold">
                                      Carport:
                                    </span>
                                    <span>
                                      {selectedProperty.specification.carport}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="font-semibold">
                                      Kamar Mandi:
                                    </span>
                                    <span>
                                      {selectedProperty.specification.bathroom}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="font-semibold">
                                      Ruang Makan:
                                    </span>
                                    <span>
                                      {
                                        selectedProperty.specification
                                          .dining_room
                                      }
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="font-semibold">
                                      Ruang Tamu:
                                    </span>
                                    <span>
                                      {
                                        selectedProperty.specification
                                          .living_room
                                      }
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="font-semibold">
                                      Lantai:
                                    </span>
                                    <span>
                                      {selectedProperty.specification.floors}
                                    </span>
                                  </div>
                                </div>
                              </>
                            )}
                        </TabsContent>
                        <TabsContent value="facility">
                          {selectedProperty && selectedProperty.facility && (
                            <>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="flex justify-between">
                                  <span className="font-semibold">
                                    Sertifikat:
                                  </span>
                                  <span>
                                    {certificates.find(
                                      (cert) =>
                                        cert.key ===
                                        selectedProperty.facility.certificate
                                    )?.value ||
                                      selectedProperty.facility.certificate}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="font-semibold">
                                    Listrik:
                                  </span>
                                  <span>
                                    {selectedProperty.facility.electricity} watt
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="font-semibold">
                                    Telepon:
                                  </span>
                                  <span>
                                    {linePhoneOptions.find(
                                      (opt) =>
                                        opt.key ===
                                        selectedProperty.facility.line_phone
                                    )?.value ||
                                      selectedProperty.facility.line_phone}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="font-semibold">
                                    Internet:
                                  </span>
                                  <span>
                                    {internetOptions.find(
                                      (opt) =>
                                        opt.key ===
                                        selectedProperty.facility.internet
                                    )?.value ||
                                      selectedProperty.facility.internet}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="font-semibold">
                                    Lebar Jalan:
                                  </span>
                                  <span>
                                    {selectedProperty.facility.road_width}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="font-semibold">
                                    Sumber Air:
                                  </span>
                                  <span>
                                    {waterSourceOptions.find(
                                      (opt) =>
                                        opt.key ===
                                        selectedProperty.facility.water_source
                                    )?.value ||
                                      selectedProperty.facility.water_source}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="font-semibold">Hook:</span>
                                  <span>
                                    {hookOptions.find(
                                      (opt) =>
                                        opt.key ===
                                        selectedProperty.facility.hook
                                    )?.value || selectedProperty.facility.hook}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="font-semibold">
                                    Kondisi:
                                  </span>
                                  <span>
                                    {conditionOptions.find(
                                      (opt) =>
                                        opt.key ===
                                        selectedProperty.facility.condition
                                    )?.value ||
                                      selectedProperty.facility.condition}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="font-semibold">
                                    Keamanan:
                                  </span>
                                  <span>
                                    {securityOptions.find(
                                      (opt) =>
                                        opt.key ===
                                        selectedProperty.facility.security
                                    )?.value ||
                                      selectedProperty.facility.security}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="font-semibold">
                                    Wastafel:
                                  </span>
                                  <span>
                                    {wastafelOptions.find(
                                      (opt) =>
                                        opt.key ===
                                        selectedProperty.facility.wastafel
                                    )?.value ||
                                      selectedProperty.facility.wastafel}
                                  </span>
                                </div>
                              </div>
                            </>
                          )}
                        </TabsContent>
                        <TabsContent value="map">
                          {selectedProperty && (
                            <Card className="mb-4">
                              <CardHeader>
                                <CardTitle>Lokasi</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="mt-4 text-sm">
                                  <div className="flex justify-between">
                                    <span className="font-semibold">
                                      Koordinat:
                                    </span>
                                    <span>{selectedProperty.coordinates}</span>
                                  </div>
                                  {selectedProperty.coordinates ? (
                                    <div className="mt-2 overflow-hidden rounded-lg aspect-video">
                                      <iframe
                                        width="100%"
                                        height="80%"
                                        frameBorder="1"
                                        style={{ border: 0 }}
                                        src={`https://www.google.com/maps?q=${selectedProperty.coordinates}&output=embed`}
                                        allowFullScreen
                                      ></iframe>
                                    </div>
                                  ) : (
                                    <p className="mt-2 text-xs italic text-gray-500">
                                      Koordinat tidak tersedia
                                    </p>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          )}
                        </TabsContent>
                      </div>
                    </Tabs>
                  </div>
                </DrawerContent>
              </Drawer>

              <Drawer>
                <DrawerTrigger asChild>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full text-sm text-white bg-blue-500 hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800 md:w-auto"
                    onClick={() =>
                      property.id && handleEditProperty(property.id)
                    }
                  >
                    Edit
                  </Button>
                </DrawerTrigger>
                <DrawerContent className="w-full sm:max-w-[90vw] md:max-w-[80vw] lg:max-w-[70vw] xl:max-w-[60vw] h-[90vh] sm:h-[95vh] mx-auto">
                  <div className="flex flex-col h-full">
                    <DrawerHeader className="relative flex-shrink-0 pb-4 border-b">
                      <DrawerTitle className="text-2xl font-bold text-blue-600">
                        Edit Properti
                      </DrawerTitle>
                      <DrawerDescription className="text-gray-500">
                        Ubah detail properti Anda di sini.
                      </DrawerDescription>
                      <DrawerClose className="absolute top-2 right-2">
                        <Button
                          size="icon"
                          className="text-white bg-blue-500 hover:bg-blue-600 dark:text-gray-100 dark:bg-blue-700 dark:hover:bg-blue-800"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </DrawerClose>
                    </DrawerHeader>
                    <div className="flex-grow p-6 overflow-y-auto">
                      <Tabs
                        defaultValue="detail-info"
                        className="flex flex-col h-full"
                      >
                        <TabsList className="flex flex-row flex-shrink-0 w-full p-2 mt-2 space-x-2 overflow-x-auto">
                          <TabsTrigger
                            value="detail-info"
                            className="data-[state=active]:text-blue-600"
                          >
                            Detail Info
                          </TabsTrigger>
                          <TabsTrigger
                            value="image"
                            className="data-[state=active]:text-blue-600"
                          >
                            Image
                          </TabsTrigger>
                          <TabsTrigger
                            value="specification"
                            className="data-[state=active]:text-blue-600"
                          >
                            Specification
                          </TabsTrigger>
                          <TabsTrigger
                            value="facility"
                            className="data-[state=active]:text-blue-600"
                          >
                            Facility
                          </TabsTrigger>
                          <TabsTrigger
                            value="map"
                            className="data-[state=active]:text-blue-600"
                          >
                            Peta
                          </TabsTrigger>
                        </TabsList>

                        {/* Detail Content */}

                        <div className="flex-grow overflow-auto">
                          <TabsContent value="detail-info" className="h-full">
                            {editingPropertyId === property.id && (
                              <EditDetailProperti
                                property={property}
                                onSave={handleSaveProperty}
                                onClose={() => setEditingPropertyId(null)}
                              />
                            )}
                          </TabsContent>

                          {/* Tambahkan konten untuk mengedit gambar */}
                          <TabsContent value="image">
                            {editingPropertyId === property.id && (
                              <EditImageProperti
                                propertyId={property.id!}
                                images={property.images || []}
                                onImageUpdate={(updatedImages) =>
                                  handleSaveImage(property.id!, updatedImages)
                                }
                              />
                            )}
                          </TabsContent>

                          {/* Tambahkan konten untuk mengedit Spesification */}
                          <TabsContent value="specification">
                            {editingPropertyId === property.id && (
                              <EditSpecification
                                specification={property.specification}
                                onSave={(updatedSpecification) =>
                                  handleSaveSpecification(
                                    property.id!,
                                    property.specification.id!,
                                    updatedSpecification
                                  )
                                }
                                onClose={() => setEditingPropertyId(null)}
                              />
                            )}
                          </TabsContent>

                          {/* Tambahkan konten untuk mengedit Facility */}
                          <TabsContent value="facility">
                            {editingPropertyId === property.id && (
                              <EditFacility
                                facility={property.facility}
                                onSave={(updatedFacility) =>
                                  handleSaveFacility(
                                    property.id!,
                                    property.facility.id!,
                                    updatedFacility
                                  )
                                }
                                onClose={() => setEditingPropertyId(null)}
                              />
                            )}
                          </TabsContent>

                          {/* Tambahkan konten untuk mengedit Map */}
                          <TabsContent value="map">
                            {editingPropertyId === property.id && (
                              <EditMapProperti
                                property={property}
                                onSave={(updatedProperty) =>
                                  handleSaveProperty(updatedProperty)
                                }
                                onClose={() => setEditingPropertyId(null)}
                              />
                            )}
                          </TabsContent>
                        </div>
                      </Tabs>
                    </div>
                  </div>
                </DrawerContent>
              </Drawer>

              <Button
                variant="secondary"
                size="sm"
                className="flex items-center justify-center w-full text-sm text-white bg-red-500 hover:bg-red-600 dark:bg-red-700 dark:hover:bg-red-800 md:w-auto"
                // onClick={() => property.id && handleDeleteProperty(property.id)}
              >
                <Trash2 className="w-4 h-4 md:mr-2" />
                <span className="hidden md:inline">Hapus</span>
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default PropertyList;
