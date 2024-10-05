import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { getCookie } from "@/utils/auth";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const homedomain = import.meta.env.PUBLIC_HOME_DOMAIN;

interface EditImagePropertiProps {
  propertyId: number;
  images: Array<{ id: number; image_url: string }>;
  onImageUpdate: (
    updatedImages: Array<{ id: number; image_url: string }>
  ) => void;
}

const EditImageProperti: React.FC<EditImagePropertiProps> = ({
  propertyId,
  images,
  onImageUpdate,
}) => {
  console.log("Properti ID:", propertyId);
  console.log("Gambar saat ini:", images);

  const [isUploading, setIsUploading] = useState(false);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [alertMessage, setAlertMessage] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const getImageUrl = (image: { image_url: string }) => {
    let imageUrl = image.image_url;
    if (imageUrl) {
      imageUrl = imageUrl.startsWith("/") ? imageUrl.substring(1) : imageUrl;
      imageUrl = imageUrl.replace(/[",/\\]/g, "");
      return `${homedomain}/storage/${imageUrl}`;
    }
    return `${homedomain}/images/home_fallback.png`;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      console.log("File gambar yang dipilih:", selectedFiles);
      setNewImages(selectedFiles);
    }
  };

  const handleImageUpload = async () => {
    console.log("Memulai proses unggah gambar");
    setIsUploading(true);
    try {
      const token = getCookie("access_token");
      console.log("Token akses:", token);

      const uploadPromises = newImages.map(async (file) => {
        console.log("Mengunggah file:", file.name);
        const formData = new FormData();
        formData.append("title", file.name);
        formData.append("remote_url", "");
        formData.append("upload_url", file);

        const uploadResponse = await fetch(
          `${import.meta.env.PUBLIC_HOME_DOMAIN}/api/test-uploads`,
          {
            method: "POST",
            body: formData,
          }
        );

        console.log("Data yang dikirim:", Object.fromEntries(formData));

        if (!uploadResponse.ok) {
          console.log("Respon server tidak berhasil");
          const errorData = await uploadResponse.json();
          console.log("Data error:", errorData);
          throw new Error("Respon server tidak berhasil");
        }

        const data = await uploadResponse.json();
        console.log("Data yang diterima:", JSON.stringify(data, null, 2));

        const uploadUrl = data.data.upload_url;
        if (!uploadUrl) {
          console.log("URL upload tidak ditemukan dalam data:", data);
          console.error("Struktur data tidak sesuai:", data);
          throw new Error("URL upload tidak ditemukan");
        }

        console.log("URL gambar yang diunggah:", uploadUrl);

        const imageData = {
          image_url: uploadUrl,
          image_remote_url: uploadUrl,
          is_primary: false,
          property_id: propertyId,
        };
        console.log("Data gambar yang akan disimpan:", imageData);

        const response = await fetch(
          `${import.meta.env.PUBLIC_FASTAPI_ENDPOINT}/properties/${propertyId}/images`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(imageData),
          }
        );

        if (!response.ok) {
          console.error("Gagal menyimpan data gambar:", file.name);
          throw new Error("Gagal menyimpan data gambar");
        }

        return await response.json();
      });

      const uploadedImages = await Promise.all(uploadPromises);
      console.log("Gambar yang berhasil diunggah:", uploadedImages);
      onImageUpdate([...images, ...uploadedImages]);
      setNewImages([]);
      setAlertMessage({ type: "success", message: "Gambar berhasil diunggah" });
    } catch (error) {
      console.error("Error mengunggah gambar:", error);
      setAlertMessage({ type: "error", message: "Gagal mengunggah gambar" });
    } finally {
      setIsUploading(false);
      console.log("Proses unggah gambar selesai");
    }
  };

  const handleDeleteImage = async (imageId: number) => {
    console.log("Menghapus gambar dengan ID:", imageId);
    try {
      const token = getCookie("access_token");
      const response = await fetch(
        `${import.meta.env.PUBLIC_FASTAPI_ENDPOINT}/properties/${propertyId}/images/${imageId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        console.error("Gagal menghapus gambar:", imageId);
        throw new Error("Gagal menghapus gambar");
      }

      console.log("Gambar berhasil dihapus:", imageId);
      onImageUpdate(images.filter((img) => img.id !== imageId));
      setAlertMessage({ type: "success", message: "Gambar berhasil dihapus" });
    } catch (error) {
      console.error("Error menghapus gambar:", error);
      setAlertMessage({ type: "error", message: "Gagal menghapus gambar" });
    }
  };

  useEffect(() => {
    if (alertMessage) {
      const timer = setTimeout(() => {
        setAlertMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [alertMessage]);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Edit Gambar Properti</h3>
      {alertMessage && (
        <Alert
          variant={alertMessage.type === "success" ? "success" : "destructive"}
        >
          <AlertTitle>
            {alertMessage.type === "success" ? "Berhasil!" : "Error!"}
          </AlertTitle>
          <AlertDescription>{alertMessage.message}</AlertDescription>
        </Alert>
      )}
      <div className="grid grid-cols-3 gap-4">
        {images.map((img) => (
          <div key={img.id} className="relative">
            <img
              src={getImageUrl(img)}
              alt="Properti"
              className="object-cover w-full h-32 rounded-md"
            />
            <Button
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
              onClick={() => handleDeleteImage(img.id)}
            >
              Hapus
            </Button>
          </div>
        ))}
      </div>
      <Input
        type="file"
        multiple
        onChange={handleImageChange}
        accept="image/*"
      />
      <Button
        onClick={handleImageUpload}
        disabled={isUploading || newImages.length === 0}
      >
        {isUploading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Mengunggah...
          </>
        ) : (
          "Unggah Gambar Baru"
        )}
      </Button>
    </div>
  );
};

export default EditImageProperti;
