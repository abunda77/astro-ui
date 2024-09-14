import "@/styles/globals.css";
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Progress } from "@material-tailwind/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Uploader, Button as RsuiteButton } from "rsuite";

interface UploadResponse {
  id: number;
  title: string;
  upload_url: string | null;
  remote_url: string;
  created_at: string;
  updated_at: string;
}

const TestUpload: React.FC = () => {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [remoteUrl, setRemoteUrl] = useState("");
  const [response, setResponse] = useState<UploadResponse | null>(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (file) {
      const timer = setTimeout(() => setProgress(66), 500);
      return () => clearTimeout(timer);
    }
  }, [file]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("title", title);
    if (file) {
      formData.append("upload_url", file);
    }
    formData.append("remote_url", remoteUrl);

    try {
      const res = await fetch("http://localhost:8003/api/test-uploads", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        throw new Error("Respon server tidak berhasil");
      }
      const data: UploadResponse = await res.json();
      setResponse(data);
      setProgress(100);
    } catch (error) {
      console.error("Error mengunggah:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <Card className="max-w-md mx-auto mt-8">
        <CardHeader>
          <CardTitle>Unggah Filess</CardTitle>
          <CardDescription>
            Silakan unggah file atau masukkan URL jarak jauh
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title" className="text-sm font-medium">
                Judul
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="file" className="text-sm font-medium">
                Unggah File
              </Label>
              <Uploader
                listType="picture-text"
                action="//jsonplaceholder.typicode.com/posts/"
                onChange={(fileList) => {
                  if (fileList.length > 0) {
                    setFile(fileList[0].blobFile || null);
                  } else {
                    setFile(null);
                  }
                }}
                renderFileInfo={(file, fileElement) => {
                  return (
                    <>
                      <span>File Name: {file.name}</span>
                      {/* <p>File URL: {file.url}</p> */}
                    </>
                  );
                }}
              >
                <RsuiteButton>Pilih file...</RsuiteButton>
              </Uploader>
            </div>
            <div>
              <Label htmlFor="remoteUrl" className="text-sm font-medium">
                URL Jarak Jauh
              </Label>
              <Input
                id="remoteUrl"
                value={remoteUrl}
                onChange={(e) => setRemoteUrl(e.target.value)}
                className="mt-1"
              />
            </div>
            {file && (
              <div className="mt-4">
                <Label className="text-sm font-medium">Progres Unggah</Label>
                <Progress value={progress} color="success">
                  <Progress.Bar />
                </Progress>
              </div>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Please wait
                </>
              ) : (
                "Unggah"
              )}
            </Button>
            <Button
              type="button"
              className="w-full mt-2"
              onClick={() => {
                setTitle("");
                setFile(null);
                setRemoteUrl("");
                setResponse(null);
                setProgress(0);
              }}
            >
              Reset
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          {response && (
            <div className="w-full">
              <h2 className="mb-2 text-lg font-semibold">Respon:</h2>
              <pre className="p-3 overflow-x-auto text-sm bg-gray-100 rounded-md">
                {JSON.stringify(response, null, 2)}
              </pre>
            </div>
          )}
        </CardFooter>
      </Card>
    </section>
  );
};

export default TestUpload;
