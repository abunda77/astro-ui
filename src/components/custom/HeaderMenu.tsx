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
        <div className="absolute left-0 right-0 z-50 bg-white rounded-b-lg shadow-lg dark:bg-gray-900">
          <Nav className="w-full text-gray-800 dark:text-gray-200">
            {menuitems.map((item, index) =>
              item.items ? (
                <Nav.Menu
                  key={index}
                  title={item.title}
                  className="hover:bg-gray-200 dark:hover:bg-gray-800"
                >
                  {item.items.map((subItem, subIndex) => (
                    <Nav.Item
                      key={subIndex}
                      href={subItem.path}
                      className="hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      {subItem.title}
                    </Nav.Item>
                  ))}
                </Nav.Menu>
              ) : (
                <Nav.Item
                  key={index}
                  href={item.path}
                  className="hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {item.title}
                </Nav.Item>
              )
            )}
          </Nav>
          <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
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
