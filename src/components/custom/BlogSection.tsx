import * as React from "react";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";

interface BlogSection {
  id: number;
  title: string;
  body: string;
  feature_image: string;
  created_at: string;
  updated_at: string;
}

const BlogSection: React.FC = () => {
  const [posts, setPosts] = useState<BlogSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `${import.meta.env.PUBLIC_HOME_DOMAIN}/api/posts`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Data received:", data);
        if (data && data.data && Array.isArray(data.data)) {
          const sortedPosts = data.data.sort(
            (a: BlogSection, b: BlogSection) =>
              new Date(b.updated_at).getTime() -
              new Date(a.updated_at).getTime()
          );
          setPosts(sortedPosts.slice(0, 5));
        } else {
          throw new Error("Invalid data format");
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
        setError("Gagal memuat data blog. Silakan coba lagi nanti.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (isLoading) {
    return <div className="text-center">Memuat data...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <section className="py-8">
      <div className="container mx-auto">
        <h2 className="text-2xl font-semibold text-center text-gray-800 dark:text-gray-200">
          Blog Terbaru
        </h2>
        {posts.length > 0 ? (
          <Carousel className="w-full max-w-4xl mx-auto mt-6">
            <CarouselContent className="-ml-1">
              {posts.map((post) => (
                <CarouselItem
                  key={post.id}
                  className="pl-1 md:basis-1/2 lg:basis-1/3"
                >
                  <div className="p-1">
                    <Card>
                      <CardContent className="flex flex-col items-center justify-center p-6">
                        <img
                          src={post.feature_image}
                          alt={post.title}
                          className="object-cover w-full h-40 rounded-lg"
                        />
                        <h3 className="mt-4 text-lg font-semibold text-center text-gray-800 dark:text-gray-200">
                          <a
                            href={`/blog/${post.id}`}
                            className="hover:underline"
                          >
                            {post.title}
                          </a>
                        </h3>
                        <p className="mt-2 text-sm text-center text-gray-600 dark:text-gray-400">
                          {post.body.substring(0, 100)}...
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        ) : (
          <p className="mt-4 text-center">Tidak ada postingan blog saat ini.</p>
        )}
        <div className="flex justify-center mt-6">
          <Button
            variant="outline"
            size="default"
            className="px-6 py-3 text-sm text-gray-600 bg-gray-300 rounded-md hover:underline dark:bg-gray-900 dark:text-gray-400"
            onClick={() => (window.location.href = "/blog")}
          >
            Lihat Semua
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
