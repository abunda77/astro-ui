import { useEffect, useState } from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import AttractiveLoadingAnimation from "@/components/custom/AttractiveLoadingAnimation";
import { Loader, Placeholder } from "rsuite";
import { Button, ButtonGroup, ButtonToolbar } from "rsuite";
import "rsuite/dist/rsuite-no-reset.min.css";

interface BlogPost {
  id: number;
  title: string;
  body: string;
  feature_image: string;
}

interface SingleBlogSectionProps {
  postId: number;
}

const SingleBlogSection: React.FC<SingleBlogSectionProps> = ({ postId }) => {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `${import.meta.env.PUBLIC_HOME_DOMAIN}/api/posts/${postId}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPost(data.data);
      } catch (error) {
        console.error("Error fetching post:", error);
        setError("Gagal memuat artikel. Silakan coba lagi nanti.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

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

  if (!post) {
    return <div>Artikel tidak ditemukan</div>;
  }

  return (
    <section className="py-8 bg-gradient-to-t from-blue-100 via-blue-50 to-white dark:from-white dark:via-gray-50 dark:to-gray-300">
      <div className="max-w-4xl p-5 mx-auto text-gray-100 bg-gray-200 sm:p-10 md:p-16 dark:bg-gray-600 dark:text-gray-800">
        <div className="flex justify-start mb-6">
          <a
            href="/"
            className="px-4 py-2 text-sm font-bold text-white bg-blue-500 rounded-full hover:bg-blue-700"
          >
            Kembali ke Blog
          </a>
        </div>
        <div className="flex items-center justify-center mb-6">
          <AspectRatio ratio={4 / 3} className="w-full max-w-3xl">
            <img
              src={post.feature_image}
              alt={post.title}
              className="object-cover rounded-lg"
            />
          </AspectRatio>
        </div>

        <h1 className="mt-16 mb-6 text-3xl font-bold text-center text-gray-800 dark:text-gray-200">
          {post.title}
        </h1>

        <div className="prose prose-lg dark:prose-invert">
          {post.body.split("\n\n").map((paragraph, index) => (
            <p key={index} className="mb-4 text-gray-700 dark:text-gray-300">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SingleBlogSection;
