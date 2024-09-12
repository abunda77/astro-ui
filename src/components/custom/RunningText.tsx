import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import Marquee from "@/components/magicui/marquee";

interface NewsItem {
  title: string;
  link: string;
}

const RunningText: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const apitoken = import.meta.env.PUBLIC_API_NEWS;

      const params = {
        apikey: apitoken,
        q: "suku bunga",
      };

      const esc = encodeURIComponent;
      const query = Object.keys(params)
        .map((k) => `${esc(k)}=${esc(params[k as keyof typeof params])}`)
        .join("&");

      const url = `https://newsdata.io/api/1/latest?${query}`;

      const requestOptions: RequestInit = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      };

      try {
        const response = await fetch(url, requestOptions);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        console.log("API Response:", result);

        if (
          result.status === "success" &&
          result.results &&
          Array.isArray(result.results)
        ) {
          setNews(
            result.results.slice(0, 5).map((item: any) => ({
              title:
                item.title.length > 50
                  ? item.title.substring(0, 50) + "..."
                  : item.title,
              link: item.link,
            }))
          );
        } else {
          console.error("Unexpected data structure:", result);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % news.length);
    }, 5000); // Ganti berita setiap 5 detik

    return () => clearInterval(interval);
  }, [news]);

  if (news.length === 0) {
    return (
      <div
        className="skeleton"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Skeleton className="w-[100px] h-[20px] rounded-md bg-gray-300 dark:bg-gray-200" />
      </div>
    );
  }

  const NewsCard = ({ title, link }: NewsItem) => {
    return (
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className={cn("relative h-10 w-full cursor-pointer overflow-hidden")}
      >
        <p className="text-sm font-medium dark:text-white">{title}</p>
      </a>
    );
  };

  return (
    <div className="relative flex h-[50px] w-full flex-row items-center justify-center overflow-hidden md:shadow-xl bg-slate-300 dark:bg-slate-600">
      <Marquee pauseOnHover className="[--duration:5s]" vertical>
        <div className="flex items-center justify-center w-full h-full">
          <NewsCard {...news[currentIndex]} />
        </div>
      </Marquee>
    </div>
  );
};

export default RunningText;
