import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const AvatarComponent = () => {
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return (
    <Avatar>
      {loading ? (
        <Skeleton className="w-[40px] h-[40px] rounded-full bg-gray-400 dark:bg-gray-200" />
      ) : (
        <AvatarImage src="https://github.com/shadcn.png" alt="User" />
      )}
      {/* <AvatarFallback>CN</AvatarFallback> */}
    </Avatar>
  );
};
export default AvatarComponent;