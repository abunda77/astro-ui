import React, { useEffect, useState } from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import AttractiveLoadingAnimation from "@/components/custom/AttractiveLoadingAnimation";
import { Loader, Placeholder } from "rsuite";
import { Button, ButtonGroup, ButtonToolbar } from "rsuite";
import "rsuite/dist/rsuite-no-reset.min.css";
import { createUniqueSlug } from "@/lib/utils";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import SocialShare from "./SocialShare";

interface BlogPost {
  id: number;
  title: string;
  body: string;
  feature_image: string;
  created_at: string;
}

interface SocialShareProps {
  url: string;
  title: string;
  short_desc?: string;
  image_url?: string;
}

interface SingleBlogSectionProps {
  postId: number;
}

const getCleanImageUrl = (imageUrl: string) => {
  if (imageUrl === null) {
    return "images/home_fallback.png";
  }
  let cleanUrl = imageUrl.startsWith("/") ? imageUrl.substring(1) : imageUrl;
  const publicHomeDomain = import.meta.env.PUBLIC_HOME_DOMAIN;
  if (cleanUrl.startsWith(publicHomeDomain)) {
    return cleanUrl;
  }
  if (cleanUrl.startsWith("http://") || cleanUrl.startsWith("https://")) {
    return cleanUrl;
  }
  cleanUrl = cleanUrl.replace(/[",/\\]/g, "");
  return `${publicHomeDomain}/storage/${cleanUrl}`;
};

const renderHtmlContent = (content: string) => {
  return { __html: content };
};

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
        if (data.data && data.data.title) {
          const uniqueSlug = createUniqueSlug(data.data.id, data.data.title);
          window.history.replaceState(null, "", `/blog/${uniqueSlug}`);
        }
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
    <section className="py-12 bg-gradient-to-t from-blue-200 via-blue-100 to-white dark:from-gray-800 dark:via-gray-700 dark:to-gray-600">
      <div className="max-w-4xl p-8 mx-auto text-gray-900 bg-white rounded-lg shadow-lg sm:p-12 md:p-20 dark:bg-gray-700 dark:text-gray-200">
        <div className="flex justify-start mb-8">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Beranda</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/blog">Blog</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{post.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="flex justify-center">
          <AspectRatio ratio={16 / 9} className="w-full max-w-7xl">
            <img
              src={getCleanImageUrl(post.feature_image)}
              alt={post.title}
              className="object-cover rounded-lg shadow-md"
            />
          </AspectRatio>
        </div>
        <h1 className="mb-8 text-4xl font-extrabold text-center text-gray-900 mt-36 dark:text-gray-100">
          {post.title}
        </h1>
        <p className="mt-2 mb-16 text-center text-gray-600 dark:text-gray-400">
          {new Date(post.created_at).toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>

        <div
          className="prose prose-lg dark:prose-invert"
          dangerouslySetInnerHTML={renderHtmlContent(post.body)}
        />

        <div className="mt-8">
          <h3 className="mb-4 text-xl font-semibold">Bagikan Artikel Ini:</h3>
          <SocialShare
            url={window.location.href}
            title={post.title}
            short_desc={post.body.substring(0, 100)}
            image_url={getCleanImageUrl(post.feature_image)}
          />
        </div>
      </div>
    </section>
  );
};

export default SingleBlogSection;
