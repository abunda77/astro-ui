import { useState, useEffect } from "react";

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
        // language: "id",
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
            result.results.slice(0, 3).map((item: any) => ({
              title: item.title,
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

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % 5);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  if (news.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-screen overflow-hidden bg-gray-300 dark:bg-gray-800">
      <div className="container mx-auto">
        <div className="py-2 text-sm font-medium text-gray-800 dark:text-gray-300 whitespace-nowrap">
          {news.map((item, index) => (
            <a
              key={index}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-block animate-marquee mr-8 ${
                index === currentIndex ? "opacity-100" : "opacity-0"
              } transition-opacity duration-2000`}
            >
              {item.title}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RunningText;
