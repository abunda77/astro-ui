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
  items?: MenuItem[];
  badge?: string;
}

const MenuItem = ({ item }: { item: MenuItem }) => {
  if (item.items) {
    return (
      <NavigationMenuItem>
        <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
            {item.items.map((subItem, index) => (
              <li key={index}>
                <NavigationMenuLink asChild>
                  <a
                    href={subItem.path}
                    className="block p-3 space-y-1 leading-none no-underline transition-colors rounded-md outline-none select-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  >
                    <div className="text-sm font-medium leading-none">
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
        <a href={item.path} className={navigationMenuTriggerStyle()}>
          {item.title}
          {item.badge && (
            <span className="px-2 py-1 ml-2 text-xs font-semibold rounded-full bg-primary text-primary-foreground">
              {item.badge}
            </span>
          )}
        </a>
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
};

const MainNavigation = ({ menuitems }: { menuitems: MenuItem[] }) => {
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
