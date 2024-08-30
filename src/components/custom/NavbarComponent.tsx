import * as React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { Phone } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

interface Component {
  title: string;
  href: string;
  description: string;
}

const components: Component[] = [
  {
    title: "Alert Dialog",
    href: "/docs/primitives/alert-dialog",
    description:
      "Modal dialog yang mengganggu pengguna dengan konten penting dan mengharapkan respons.",
  },
  {
    title: "Hover Card",
    href: "/docs/primitives/hover-card",
    description:
      "Untuk pengguna yang dapat melihat untuk mempratinjau konten yang tersedia di balik tautan.",
  },
  {
    title: "Progress",
    href: "/docs/primitives/progress",
    description:
      "Menampilkan indikator yang menunjukkan kemajuan penyelesaian tugas, biasanya ditampilkan sebagai progress bar.",
  },
  {
    title: "Scroll-area",
    href: "/docs/primitives/scroll-area",
    description: "Memisahkan konten secara visual atau semantik.",
  },
  {
    title: "Tabs",
    href: "/docs/primitives/tabs",
    description:
      "Serangkaian bagian konten berlapis—dikenal sebagai panel tab—yang ditampilkan satu per satu.",
  },
  {
    title: "Tooltip",
    href: "/docs/primitives/tooltip",
    description:
      "Popup yang menampilkan informasi terkait elemen ketika elemen menerima fokus keyboard atau mouse melayang di atasnya.",
  },
];

export const NavigationMenuDemo: React.FC = () => {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Memulai</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <a
                    className="flex flex-col justify-end w-full h-full p-6 no-underline rounded-md outline-none select-none bg-gradient-to-b from-muted/50 to-muted focus:shadow-md"
                    href="/"
                  >
                    <Phone className="w-6 h-6" />
                    <div className="mt-4 mb-2 text-lg font-medium">
                      shadcn/ui
                    </div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      Komponen yang dirancang dengan indah yang dapat Anda salin
                      dan tempel ke dalam aplikasi Anda. Dapat diakses. Dapat
                      disesuaikan. Sumber Terbuka.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <ListItem href="/docs" title="Pengenalan">
                Komponen yang dapat digunakan kembali dibangun menggunakan Radix
                UI dan Tailwind CSS.
              </ListItem>
              <ListItem href="/docs/installation" title="Instalasi">
                Cara menginstal dependensi dan menyusun aplikasi Anda.
              </ListItem>
              <ListItem href="/docs/primitives/typography" title="Tipografi">
                Gaya untuk judul, paragraf, daftar...dll
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Komponen</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              {components.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/docs" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Dokumentasi
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

interface ListItemProps extends React.ComponentPropsWithoutRef<"a"> {
  title: string;
}

const ListItem = React.forwardRef<React.ElementRef<"a">, ListItemProps>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              className
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="text-sm leading-snug line-clamp-2 text-muted-foreground">
              {children}
            </p>
          </a>
        </NavigationMenuLink>
      </li>
    );
  }
);
ListItem.displayName = "ListItem";

export default NavigationMenuDemo;
