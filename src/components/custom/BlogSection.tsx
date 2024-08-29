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
import { Link } from "react-router-dom";

interface BlogSection {
  id: number;
  title: string;
  body: string;
  feature_image: string;
}

const BlogSection: React.FC = () => {
  const [posts, setPosts] = useState<BlogSection[]>([]);

  useEffect(() => {
    fetch(`${process.env.PUBLIC_HOME_DOMAIN}/api/posts`)
      .then((response) => {
        console.log("Response received:", response);
        return response.json();
      })
      .then((data) => setPosts(data.data.slice(0, 5)))
      .catch((error) => console.error("Error fetching posts:", error));
  }, []);

  return (
    <section className="py-8">
      <div className="container mx-auto">
        <h2 className="text-2xl font-semibold text-center text-gray-800 dark:text-gray-200">
          Blog Terbaru
        </h2>
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
                        {post.title}
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
        <div className="flex justify-center mt-6">
          <Button
            variant="outline"
            size="default"
            className="px-6 py-3 text-sm text-gray-600 bg-gray-300 rounded-md hover:underline dark:bg-gray-900 dark:text-gray-400"
            // Change href to onClick for navigation
            onClick={() => (window.location.href = "/blog")}
          >
            More ..
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
