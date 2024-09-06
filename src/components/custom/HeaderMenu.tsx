// Menu for mode Mobile

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { ModeToggle } from "@/components/custom/ModeToggle";
import AvatarComponent from "@/components/custom/AvatarComponent";
import LoginButtons from "@/components/custom/LoginButtons";

type MenuItem = {
  title: string;
  path?: string;
  items?: { title: string; path: string }[];
};

interface HeaderMenuProps {
  menuitems: MenuItem[];
}

const HeaderMenu: React.FC<HeaderMenuProps> = ({ menuitems }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="block lg:hidden">
      <Button variant="secondary" size="icon" onClick={toggleMenu}>
        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </Button>

      {isMenuOpen && (
        <div className="absolute left-0 right-0 z-50 bg-gray-100 dark:bg-gray-900">
          <ul>
            {menuitems.map((item, index) => (
              <li key={index}>
                <a href={item.path}>{item.title}</a>
                {item.items && (
                  <ul>
                    {item.items.map((subItem, subIndex) => (
                      <li key={subIndex}>
                        <a href={subItem.path}>{subItem.title}</a>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
          <div className="pt-4 pb-3 border-t border-gray-700">
            <div className="flex items-center justify-between px-5 py-2">
              <div className="flex items-center space-x-3">
                <AvatarComponent />
                <LoginButtons />
              </div>
              <ModeToggle />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeaderMenu;
