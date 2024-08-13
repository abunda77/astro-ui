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

      // Setelah mengubah currentIndex, pastikan item baru berada di tengah (opsional)
      setTimeout(() => {
        const marqueeElement = document.querySelector(".animate-marquee");
        if (marqueeElement) {
          marqueeElement.scrollTop =
            (marqueeElement.scrollHeight - marqueeElement.clientHeight) / 2;
        }
      }, 0);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  if (news.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex items-center w-auto h-8 overflow-hidden bg-gray-300 dark:bg-gray-800">
      {" "}
      {/* Tambahkan flex dan items-center */}
      <div className="container h-full mx-auto">
        {" "}
        {/* Tambahkan h-full */}
        <div className="relative h-full py-2 text-sm font-medium text-gray-800 dark:text-gray-300 whitespace-nowrap">
          {" "}
          {/* Tambahkan relative dan h-full */}
          <div className="absolute top-0 left-0 flex flex-col justify-center w-full h-full animate-marquee">
            {" "}
            {/* Tambahkan absolute, flex-col, dan justify-center */}
            {news.map((item, index) => (
              <a
                key={index}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-block mr-8 ${
                  index === currentIndex ? "opacity-100" : "opacity-0"
                } transition-opacity duration-2000`}
              >
                {item.title}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RunningText;
