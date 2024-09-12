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

import { Button } from "@material-tailwind/react";
import { Loader } from "rsuite";
import "rsuite/dist/rsuite-no-reset.min.css";

interface BlogSection {
  id: number;
  title: string;
  body: string;
  feature_image: string;
  created_at: string;
  updated_at: string;
}

function createUniqueSlug(id: number | string, title: string) {
  const baseSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
  return `${id}-${baseSlug}`;
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
    return (
      <div className="text-center">
        <hr />
        <Loader size="lg" content="Loading please wait..." vertical />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <section className="py-8 ">
      <div className="container mx-auto ">
        <h2 className="ml-10 text-2xl font-semibold text-gray-800 dark:text-gray-300 text-start">
          Blog Terbaru
        </h2>
        {posts.length > 0 ? (
          <Carousel className="w-full mx-auto mt-6 max-w-7xl ">
            <CarouselContent className="-ml-3 ">
              {posts.map((post) => (
                <CarouselItem
                  key={post.id}
                  className="pl-1 md:basis-1/2 lg:basis-1/4"
                >
                  <div className="p-5">
                    <Card className="overflow-hidden transition-all duration-300 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-600 dark:to-gray-700 hover:border-blue-500 dark:hover:border-blue-300">
                      <CardContent className="flex flex-col items-center justify-center p-6">
                        <img
                          src={post.feature_image}
                          alt={post.title}
                          className="object-cover w-full h-40 rounded-lg"
                        />
                        <h3 className="mt-4 text-lg font-semibold text-center text-gray-800 dark:text-gray-300 hover:text-blue-500">
                          <a
                            href={`/blog/${createUniqueSlug(post.id, post.title)}`}
                            className="hover:underline"
                          >
                            {post.title.length > 40
                              ? `${post.title.substring(10, 40)}...`
                              : post.title}
                          </a>
                        </h3>
                        <p className="mt-2 text-sm text-center text-gray-600 dark:text-gray-400">
                          {post.body.length > 100
                            ? `${post.body.substring(10, 50)}...`
                            : post.body}
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
            className="bg-gray-300 hover:bg-gray-100 text-foreground dark:text-background"
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
