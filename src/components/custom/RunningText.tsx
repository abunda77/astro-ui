import { useState, useEffect } from "react";

interface NewsItem {
  title: string;
  url: string;
}

const RunningText: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const apiToken = import.meta.env.PUBLIC_API_NEWS;

      const params = {
        api_token: apiToken,
        categories: "",
        search: "suku bunga kpr",
        limit: "3",
        language: "id",
      };

      const esc = encodeURIComponent;
      const query = Object.keys(params)
        .map((k) => `${esc(k)}=${esc(params[k as keyof typeof params])}`)
        .join("&");

      const url = `https://api.thenewsapi.com/v1/news/all?${query}`;

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

        if (result.data && Array.isArray(result.data)) {
          setNews(
            result.data.map((item: any) => ({
              title: item.title,
              url: item.url,
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

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % news.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [news.length]);

  if (news.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-screen overflow-hidden bg-gray-300 dark:bg-gray-800">
      <div className="container mx-auto">
        <div className="py-2 text-sm font-medium text-gray-800 dark:text-gray-300 whitespace-nowrap">
          <a
            href={news[currentIndex]?.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block animate-marquee"
          >
            {news[currentIndex]?.title}
          </a>
        </div>
      </div>
    </div>
  );
};

export default RunningText;
