import React, { useEffect, useState } from "react";
import { Loader } from "rsuite";
import { Skeleton } from "@/components/ui/skeleton";

interface Quote {
  id: number;
  quotes: string;
  author: string;
}

const QuotesLocal: React.FC = () => {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        setIsLoading(true);
        const randomId = Math.floor(Math.random() * 100) + 1;
        const url = `${import.meta.env.PUBLIC_HOME_DOMAIN}/api/quotes/${randomId}`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setQuote(data.data);
      } catch (error) {
        console.error("Error mengambil kutipan:", error);
        setError("Gagal memuat kutipan. Silakan coba lagi nanti.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuote();
  }, []);

  if (isLoading) {
    return (
      <div className="absolute top-8 left-8 right-8">
        <Skeleton className="w-full h-6 mb-2" />
        <Skeleton className="w-3/4 h-6 mb-2" />
        <Skeleton className="w-1/2 h-4" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <>
      {quote && (
        <blockquote className="absolute mb-1 text-lg italic text-center top-8 left-8 right-8 animate-pulse">
          "{quote.quotes}"
          <footer className="mt-2 text-sm">- {quote.author}</footer>
        </blockquote>
      )}
    </>
  );
};

export default QuotesLocal;
