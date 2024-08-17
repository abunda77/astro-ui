import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { ModeToggle } from "@/components/custom/ModeToggle";
import AvatarComponent from "@/components/custom/AvatarComponent";
import LoginButtons from "@/components/custom/LoginButtons";

interface MenuItem {
  title: string;
  path: string;
  badge?: boolean;
  children?: MenuItem[];
}

interface HeaderMenuProps {
  menuitems: MenuItem[];
}

const HeaderMenu: React.FC<HeaderMenuProps> = ({ menuitems }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="md:hidden">
      <Button variant="secondary" size="icon" onClick={toggleMenu}>
        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </Button>

      {isMenuOpen && (
        <div className="absolute left-0 right-0 z-50 bg-gray-100 dark:bg-gray-900">
          <ul className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {menuitems.map((item, index) => (
              <li key={index}>
                <a
                  href={item.path}
                  className="block px-3 py-2 text-base font-medium text-gray-800 rounded-md hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  {item.title}
                  {item.badge && (
                    <span className="ml-1 px-2 py-0.5 text-[10px] animate-pulse font-semibold uppercase text-white bg-indigo-600 rounded-full">
                      New
                    </span>
                  )}
                </a>
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
