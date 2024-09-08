// Menu for mode Mobile

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { ModeToggle } from "@/components/custom/ModeToggle";
import AvatarComponent from "@/components/custom/AvatarComponent";
import LoginButtons from "@/components/custom/LoginButtons";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

import { Nav } from "rsuite";

type MenuItem = {
  title: string;
  path?: string;
  items?: { title: string; path: string }[];
  badge?: boolean;
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
        <div className="absolute left-0 right-0 z-50 text-left bg-white rounded-b-lg shadow-lg dark:bg-gray-900">
          <Nav className="flex flex-col w-full text-gray-800 dark:text-gray-200">
            {menuitems.map((item, index) =>
              item.items ? (
                <Nav.Menu
                  key={index}
                  title={item.title}
                  className="w-full hover:bg-gray-200 dark:hover:bg-gray-800 dark:text-gray-100"
                >
                  {item.items.map((subItem, subIndex) => (
                    <Nav.Item
                      key={subIndex}
                      href={subItem.path}
                      className="w-full pl-4 hover:bg-gray-100 dark:hover:bg-gray-700 "
                    >
                      {subItem.title}
                    </Nav.Item>
                  ))}
                </Nav.Menu>
              ) : (
                <Nav.Item
                  key={index}
                  href={item.path}
                  className="flex justify-start w-full text-left hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-green-100"
                >
                  {item.title}
                </Nav.Item>
              )
            )}
          </Nav>
          <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700 ">
            <div className="flex flex-col items-center px-5 py-2 space-y-3">
              <AvatarComponent />
              <LoginButtons />
              <ModeToggle />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeaderMenu;
