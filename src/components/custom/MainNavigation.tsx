import React from "react";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
interface MenuItem {
  title: string;
  path?: string;
  items?: { title: string; path: string }[];
  badge?: boolean;
}

interface MainNavigationProps {
  menuitems: MenuItem[];
}

const MenuItem = ({ item }: { item: MenuItem }) => {
  if (item.items) {
    return (
      <NavigationMenuItem>
        <NavigationMenuTrigger className="hover:bg-gray-400 dark:hover:bg-gray-600 dark:text-gray-200">
          {item.title}
        </NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul className="grid w-[400px] gap-2 p-1 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
            {item.items.map((subItem, index) => (
              <li key={index} className="mb-2">
                <NavigationMenuLink asChild>
                  <a
                    href={subItem.path}
                    className="block p-1 transition-colors duration-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-700"
                  >
                    <div className="mb-1 text-sm font-medium leading-none">
                      {subItem.title}
                    </div>
                    <p className="text-sm leading-snug line-clamp-2 text-muted-foreground">
                      Deskripsi singkat tentang{" "}
                      {subItem.title?.toLowerCase() ?? "item"}.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
            ))}
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
    );
  }

  return (
    <NavigationMenuItem>
      <NavigationMenuLink asChild>
        <a
          href={item.path}
          className={`${navigationMenuTriggerStyle()} hover:bg-gray-200 dark:hover:bg-gray-600 dark:text-gray-200 `}
        >
          {item.title}
          {item.badge && (
            <span className="px-2 py-1 ml-2 text-xs font-semibold rounded-full bg-primary text-primary-foreground hover:bg-primary-dark">
              {item.badge}
            </span>
          )}
        </a>
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
};

const MainNavigation: React.FC<MainNavigationProps> = ({ menuitems }) => {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        {menuitems.map((item, index) => (
          <MenuItem key={index} item={item} />
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default MainNavigation;
