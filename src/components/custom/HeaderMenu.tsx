import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { ModeToggle } from "@/components/custom/ModeToggle";
import AvatarComponent from "@/components/custom/AvatarComponent";
import LoginButtons from "@/components/custom/LoginButtons";

//  import globals.css
import "@/styles/globals.css";

type MenuItem = {
  title: string;
  path?: string;
  items?: { title: string; path: string; icon?: string }[];
  badge?: boolean;
  icon?: string;
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
          <nav className="max-h-[80vh] overflow-y-auto">
            {menuitems.map((item, index) =>
              item.items ? (
                <details key={index} className="group">
                  <summary className="flex items-center justify-between p-4 font-medium text-gray-800 transition-colors duration-200 cursor-pointer hover:bg-gray-100 hover:text-gray-900 dark:text-gray-200 dark:hover:bg-gray-800 dark:hover:text-white">
                    <span className="flex items-center">{item.title}</span>
                    <svg
                      className="w-4 h-4 text-gray-600 transition-transform group-open:rotate-180 dark:text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </summary>
                  <ul className="pl-4 mt-2 space-y-1">
                    {item.items.map((subItem, subIndex) => (
                      <li key={subIndex}>
                        <a
                          href={subItem.path}
                          className="flex items-center p-2 text-sm text-gray-700 transition-colors duration-200 rounded-md hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
                        >
                          {subItem.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </details>
              ) : (
                <a
                  key={index}
                  href={item.path}
                  className="flex items-center p-4 text-gray-800 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-200 dark:hover:bg-gray-800 dark:hover:text-white"
                >
                  {item.title}
                </a>
              )
            )}
          </nav>
          <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col items-center px-5 py-2 space-y-3">
              <AvatarComponent />
              <LoginButtons />
              <div className="flex justify-end w-full">
                <ModeToggle />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeaderMenu;
