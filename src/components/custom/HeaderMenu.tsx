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
        <div className="absolute left-0 right-0 z-50 bg-gray-100 rounded-b-lg shadow-lg dark:bg-gray-900">
          <NavigationMenu className="w-full">
            <NavigationMenuList className="flex flex-col w-full">
              {menuitems.map((item, index) => (
                <NavigationMenuItem key={index} className="w-full">
                  {item.items ? (
                    <>
                      <NavigationMenuTrigger className="justify-between w-full px-4 py-3 hover:bg-gray-200 dark:hover:bg-gray-700 dark:text-gray-200">
                        {item.title}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent className="w-screen">
                        <ul className="grid w-full gap-2 p-4 md:grid-cols-2">
                          {item.items.map((subItem, subIndex) => (
                            <li key={subIndex} className="mb-2">
                              <NavigationMenuLink asChild>
                                <a
                                  href={subItem.path}
                                  className="block p-3 transition-colors duration-200 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
                                >
                                  <div className="mb-1 text-sm font-medium leading-none">
                                    {subItem.title}
                                  </div>
                                  <p className="text-xs leading-snug line-clamp-2 text-muted-foreground">
                                    Deskripsi singkat tentang{" "}
                                    {subItem.title.toLowerCase()}.
                                  </p>
                                </a>
                              </NavigationMenuLink>
                            </li>
                          ))}
                        </ul>
                      </NavigationMenuContent>
                    </>
                  ) : (
                    <NavigationMenuLink asChild>
                      <a
                        href={item.path}
                        className={`${navigationMenuTriggerStyle()} w-full justify-start hover:bg-gray-200 dark:hover:bg-gray-700 dark:text-gray-200 py-3 px-4`}
                      >
                        {item.title}
                      </a>
                    </NavigationMenuLink>
                  )}
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
          <div className="pt-4 pb-3 border-t border-gray-300 dark:border-gray-700">
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
