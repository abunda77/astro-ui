import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RefreshBrowserProps {
  className?: string;
  onRefresh: () => void;
}

const RefreshBrowser: React.FC<RefreshBrowserProps> = ({
  className,
  onRefresh,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleRefresh = () => {
    setIsLoading(true);
    // Memanggil fungsi onRefresh yang diberikan oleh komponen induk
    onRefresh();
    // Mengembalikan status loading ke false setelah 2 detik
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  return (
    <Button
      onClick={handleRefresh}
      className={`${className} bg-red-500 hover:bg-red-600 dark:bg-red-700 dark:hover:bg-red-800 text-white`}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Memuat...
        </>
      ) : (
        <span className="text-white dark:text-gray-200">Refresh Dashboard</span>
      )}
    </Button>
  );
};

export default RefreshBrowser;
