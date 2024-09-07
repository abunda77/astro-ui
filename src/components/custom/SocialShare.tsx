import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Facebook, Twitter, Mail, Link, Share2 } from "lucide-react";
// import Whataspp icon form antd icon
import { WhatsAppOutlined } from "@ant-design/icons";
import { toast } from "@/components/ui/use-toast";

interface SocialShareProps {
  url: string;
  title: string;
  short_desc: string;
  image_url: string;
}

const SocialShare: React.FC<SocialShareProps> = ({
  url,
  title,
  short_desc,
  image_url,
}) => {
  const [copied, setCopied] = useState(false);

  const shareOnFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&picture=${encodeURIComponent(image_url)}`,
      "_blank"
    );
  };

  const shareOnTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}&image=${encodeURIComponent(image_url)}`,
      "_blank"
    );
  };

  const shareOnWhatsApp = () => {
    window.open(
      `https://api.whatsapp.com/send?text=${encodeURIComponent(title + " - " + short_desc + " " + url)}&image=${encodeURIComponent(image_url)}`,
      "_blank"
    );
  };

  const shareViaEmail = () => {
    window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(short_desc + "\n\n" + url + "\n\nGambar: " + image_url)}`;
  };

  const copyLink = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      toast({
        title: "Berhasil disalin",
        description: "Tautan telah disalin ke clipboard",
        duration: 2000,
      });
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="flex space-x-2">
      <Button
        variant="outline"
        size="icon"
        className="w-8 h-8 transition-colors rounded-md hover:bg-blue-100 dark:hover:bg-blue-900"
        onClick={shareOnFacebook}
      >
        <Facebook className="w-4 h-4 text-blue-600 dark:text-blue-400" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="w-8 h-8 transition-colors rounded-md hover:bg-blue-100 dark:hover:bg-blue-900"
        onClick={shareOnTwitter}
      >
        <Twitter className="w-4 h-4 text-blue-400 dark:text-blue-300" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="w-8 h-8 transition-colors rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
        onClick={shareOnWhatsApp}
      >
        <WhatsAppOutlined className="w-4 h-4 text-gray-600 dark:text-gray-400" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="w-8 h-8 transition-colors rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
        onClick={shareViaEmail}
      >
        <Mail className="w-4 h-4 text-gray-600 dark:text-gray-400" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="w-8 h-8 transition-colors rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
        onClick={copyLink}
      >
        <Link className="w-4 h-4 text-gray-600 dark:text-gray-400" />
      </Button>
    </div>
  );
};

export default SocialShare;
