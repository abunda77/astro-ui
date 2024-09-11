import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

import { Loader, Placeholder } from "rsuite";
import { Loader2, AlertCircle } from "lucide-react";
import { Button } from "@material-tailwind/react";
import "rsuite/dist/rsuite-no-reset.min.css";
import { Skeleton } from "@/components/ui/skeleton";
import { createUniqueSlug } from "@/lib/utils";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface BlogPost {
  id: number;
  title: string;
  body: string;
  feature_image: string;
  created_at: string;
  updated_at: string;
}

const BlogPost: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNoDataAlert, setShowNoDataAlert] = useState(false);
  const postsPerPage = 8;

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
            (a: BlogPost, b: BlogPost) =>
              new Date(b.updated_at).getTime() -
              new Date(a.updated_at).getTime()
          );
          setPosts(sortedPosts);
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
      <div className="h-[600px] bg-[#94918d]">
        <Loader size="lg" inverse center content="loading..." />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  const loadMorePosts = () => {
    if (currentPage * postsPerPage >= posts.length) {
      setShowNoDataAlert(true);
    } else {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  if (isLoading && currentPage === 1) {
    return (
      <div className="flex items-center justify-center">
        <div className="skeleton">
          <Loader size="md" />
        </div>
      </div>
    );
  }

  const initialPosts = posts.slice(0, currentPage * postsPerPage);

  return (
    <section className="py-8 ">
      <div className="container px-4 mx-auto">
        <h2 className="mb-8 text-2xl font-semibold text-center text-gray-800 dark:text-gray-700">
          Blog Terbaru
        </h2>
        {initialPosts.length === 0 ? (
          <div className="text-center text-gray-600 dark:text-gray-400">
            Tidak ada data blog yang tersedia.
          </div>
        ) : null}
        <div
          id="posts-container"
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"
        >
          {initialPosts.map((post) => (
            <Card
              key={post.id}
              className="h-full transition-transform transform hover:scale-105 hover:border-blue-500 dark:bg-gray-300 dark:hover:bg-gray-100 dark:border-gray-100 dark:hover:border-blue-500"
            >
              <CardContent className="flex flex-col h-full p-6">
                {isLoading ? (
                  <Skeleton className="w-full h-40 mb-4 rounded-lg" />
                ) : (
                  <img
                    src={post.feature_image}
                    alt={post.title}
                    className="object-cover w-full h-40 mb-4 rounded-lg"
                  />
                )}
                {isLoading ? (
                  <Skeleton className="w-3/4 h-6 mb-2" />
                ) : (
                  <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-gray-700 hover:text-blue-500">
                    <a
                      href={`/blog/${createUniqueSlug(post.id, post.title)}`}
                      className="hover:underline"
                    >
                      {post.title}
                    </a>
                  </h3>
                )}
                {isLoading ? (
                  <>
                    <Skeleton className="w-full h-4 mb-2" />
                    <Skeleton className="w-full h-4 mb-2" />
                    <Skeleton className="w-3/4 h-4 mb-4" />
                  </>
                ) : (
                  <>
                    <p className="flex-grow mb-2 text-sm text-gray-600 dark:text-gray-700">
                      {post.body.substring(0, 100)}...
                    </p>
                    <p className="mb-4 text-xs text-gray-600 dark:text-gray-700">
                      Dibuat pada:{" "}
                      {new Date(post.created_at).toLocaleDateString("id-ID")}
                    </p>
                  </>
                )}
                {isLoading ? (
                  <Skeleton className="w-1/3 h-4 mt-auto" />
                ) : (
                  <a
                    href={`/blog/${createUniqueSlug(post.id, post.title)}`}
                    className="mt-auto text-blue-500 hover:underline"
                  >
                    Baca selengkapnya
                  </a>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Button
            onClick={loadMorePosts}
            className="bg-gray-300 hover:bg-gray-100 text-foreground dark:text-background"
            disabled={isLoading || showNoDataAlert}
          >
            {isLoading ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Muat lebih banyak..."
            )}
          </Button>
          {showNoDataAlert && (
            <Alert
              variant="destructive"
              className="max-w-sm p-4 mx-auto mt-6 bg-red-100 border-none shadow-lg sm:max-w-2xl sm:p-6"
            >
              <AlertCircle className="w-4 h-4" />
              <AlertTitle>Oops...!</AlertTitle>
              <AlertDescription>
                Maaf, sudah tidak ada data lagi yang tersedia.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </section>
  );
};

export default BlogPost;
