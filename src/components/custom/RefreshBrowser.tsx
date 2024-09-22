import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RefreshBrowserProps {
  className?: string;
}

const RefreshBrowser: React.FC<RefreshBrowserProps> = ({ className }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleRefresh = () => {
    setIsLoading(true);
    // Metode untuk me-refresh halaman setelah 2 detik
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };

  useEffect(() => {
    if (isLoading) {
      // Mengembalikan status loading ke false setelah 2 detik
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  return (
    <Button
      onClick={handleRefresh}
      className={`${className} bg-red-500 hover:bg-red-600 dark:bg-red-700 dark:hover:bg-red-800 text-white`}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Memuat...
        </>
      ) : (
        <span className="text-white dark:text-gray-200">Refresh Halaman</span>
      )}
    </Button>
  );
};

export default RefreshBrowser;
