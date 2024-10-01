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
import { Loader2 } from "lucide-react";
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
import EditProperti from "./EditProperti";

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
      const response = await fetch(`${FASTAPI_LOGIN}/properties/${propertyId}`);
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
      const response = await fetch(
        `${FASTAPI_LOGIN}/properties/${updatedProperty.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
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
    <Card className="max-w-full p-4 rounded-lg shadow-lg md:p-6 bg-gradient-to-br from-blue-100 to-purple-200 dark:from-gray-800 dark:to-purple-900">
      <CardHeader className="mb-4 md:mb-6">
        <CardTitle className="text-xl font-bold text-blue-800 md:text-2xl dark:text-blue-300">
          Daftar Properti
        </CardTitle>
        <CardDescription className="text-lg font-semibold text-blue-700 md:text-xl dark:text-blue-300">
          Properti yang Anda miliki
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 md:space-y-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-300">
            Properti Anda
          </h3>
          <Button
            variant="outline"
            size="sm"
            className="text-white bg-blue-500 hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800"
          >
            Tambah Properti
          </Button>
        </div>
        {properties.map((property) => (
          <div
            key={property.id}
            className="flex flex-col p-4 rounded-lg shadow-md bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
          >
            <div className="flex items-center mb-4">
              <img
                src={getImageUrl(property)}
                alt={property.title || "Gambar Properti"}
                className="object-cover w-16 h-16 mr-4 rounded-lg ring-2 ring-blue-300 dark:ring-blue-600"
              />
              <div className="flex-grow">
                <h4 className="mb-1 text-lg font-semibold text-blue-800 dark:text-blue-300">
                  {property.title || "Tidak ada judul"}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {property.short_desc || "Tidak ada deskripsi singkat"}
                </p>
              </div>
              <div className="flex space-x-2">
                <Drawer>
                  <DrawerTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-white bg-blue-500 hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800"
                      onClick={() =>
                        property.id && fetchPropertyDetails(property.id)
                      }
                    >
                      {loadingPropertyId === property.id ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : null}
                      {loadingPropertyId === property.id
                        ? "Memuat..."
                        : "Detail"}
                    </Button>
                  </DrawerTrigger>
                  <DrawerContent className="sm:max-w-[800px] sm:h-[90vh] fixed left-1/2 transform -translate-x-1/2">
                    <DrawerHeader className="pb-4 border-b">
                      <DrawerTitle className="text-2xl font-bold text-blue-600">
                        Detail Properti
                      </DrawerTitle>
                      <DrawerDescription className="text-gray-500">
                        Informasi lengkap tentang properti Anda.
                      </DrawerDescription>
                    </DrawerHeader>
                    <div className="p-6">
                      <Tabs defaultValue="detail-info">
                        <TabsList className="flex flex-row w-full p-2 mt-2 space-x-2 overflow-x-auto">
                          <TabsTrigger value="detail-info">
                            Detail Info
                          </TabsTrigger>
                          <TabsTrigger value="image">Image</TabsTrigger>
                          <TabsTrigger value="specification">
                            Specification
                          </TabsTrigger>
                          <TabsTrigger value="facility">Facility</TabsTrigger>
                        </TabsList>
                        <TabsContent value="detail-info">
                          {selectedProperty && (
                            <>
                              <p className="text-gray-900 dark:text-gray-100">
                                Judul: {selectedProperty.title}
                              </p>
                              <p className="text-gray-900 dark:text-gray-100">
                                Harga: Rp{" "}
                                {selectedProperty.price?.toLocaleString()}
                              </p>
                              <p className="text-gray-900 dark:text-gray-100">
                                Alamat: {selectedProperty.address}
                              </p>
                              <p className="text-gray-900 dark:text-gray-100">
                                Deskripsi: {selectedProperty.description}
                              </p>
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
                                <p>
                                  Luas Tanah:{" "}
                                  {selectedProperty.specification.land_size} m²
                                </p>
                                <p>
                                  Luas Bangunan:{" "}
                                  {selectedProperty.specification.building_size}{" "}
                                  m²
                                </p>
                                <p>
                                  Kamar Tidur:{" "}
                                  {selectedProperty.specification.bedroom}
                                </p>
                                <p>
                                  Kamar Mandi:{" "}
                                  {selectedProperty.specification.bathroom}
                                </p>
                                <p>
                                  Lantai:{" "}
                                  {selectedProperty.specification.floors}
                                </p>
                              </>
                            )}
                        </TabsContent>
                        <TabsContent value="facility">
                          {selectedProperty && selectedProperty.facility && (
                            <>
                              <p>
                                Sertifikat:{" "}
                                {selectedProperty.facility.certificate}
                              </p>
                              <p>
                                Listrik: {selectedProperty.facility.electricity}{" "}
                                watt
                              </p>
                              <p>
                                Internet: {selectedProperty.facility.internet}
                              </p>
                              <p>
                                Sumber Air:{" "}
                                {selectedProperty.facility.water_source}
                              </p>
                              <p>
                                Keamanan: {selectedProperty.facility.security}
                              </p>
                            </>
                          )}
                        </TabsContent>
                      </Tabs>
                    </div>
                    <DrawerFooter className="pt-4 border-t">
                      <DrawerClose asChild>
                        <Button variant="outline" className="w-full">
                          Tutup
                        </Button>
                      </DrawerClose>
                    </DrawerFooter>
                  </DrawerContent>
                </Drawer>

                <Drawer>
                  <DrawerTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-white bg-blue-500 hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800"
                      onClick={() =>
                        property.id && handleEditProperty(property.id)
                      }
                    >
                      Edit
                    </Button>
                  </DrawerTrigger>
                  <DrawerContent className="w-full sm:max-w-[90vw] md:max-w-[80vw] lg:max-w-[70vw] xl:max-w-[60vw] h-[90vh] sm:h-[95vh] fixed inset-0 m-auto overflow-hidden">
                    <div className="flex flex-col h-full">
                      <DrawerHeader className="flex-shrink-0 pb-4 border-b">
                        <DrawerTitle className="text-2xl font-bold text-blue-600">
                          Edit Properti
                        </DrawerTitle>
                        <DrawerDescription className="text-gray-500">
                          Ubah detail properti Anda di sini.
                        </DrawerDescription>
                      </DrawerHeader>
                      <div className="flex-grow p-6 overflow-y-auto">
                        <Tabs
                          defaultValue="detail-info"
                          className="flex flex-col h-full"
                        >
                          <TabsList className="flex flex-row flex-shrink-0 w-full p-2 mt-2 space-x-2 overflow-x-auto">
                            <TabsTrigger value="detail-info">
                              Detail Info
                            </TabsTrigger>
                            <TabsTrigger value="image">Image</TabsTrigger>
                            <TabsTrigger value="specification">
                              Specification
                            </TabsTrigger>
                            <TabsTrigger value="facility">Facility</TabsTrigger>
                          </TabsList>
                          <div className="flex-grow overflow-y-auto">
                            <TabsContent value="detail-info" className="h-full">
                              {editingPropertyId === property.id && (
                                <EditProperti
                                  property={property}
                                  onSave={handleSaveProperty}
                                  onClose={() => setEditingPropertyId(null)}
                                />
                              )}
                            </TabsContent>
                            <TabsContent value="image">
                              {/* Tambahkan konten untuk mengedit gambar */}
                            </TabsContent>
                            <TabsContent value="specification">
                              {/* Tambahkan konten untuk mengedit spesifikasi */}
                            </TabsContent>
                            <TabsContent value="facility">
                              {/* Tambahkan konten untuk mengedit fasilitas */}
                            </TabsContent>
                          </div>
                        </Tabs>
                      </div>
                      <DrawerFooter className="flex-shrink-0 pt-4 border-t">
                        <DrawerClose asChild>
                          <Button variant="destructive" className="w-full">
                            Tutup
                          </Button>
                        </DrawerClose>
                      </DrawerFooter>
                    </div>
                  </DrawerContent>
                </Drawer>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default PropertyList;
