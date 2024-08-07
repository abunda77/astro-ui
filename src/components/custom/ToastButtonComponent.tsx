import React from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";

const ToastButtonComponent = () => {
  const { toast } = useToast();

  const handleClick = () => {
    toast({
      title: "Scheduled: Catch up ",
      description: "Friday, February 10, 2023 at 5:57 PM",
      action: <ToastAction altText="Goto schedule to undo">Undo</ToastAction>,
    });
  };

  return (
    <Button variant="outline" onClick={handleClick}>
      Add to calendar
    </Button>
  );
};

export default ToastButtonComponent;
