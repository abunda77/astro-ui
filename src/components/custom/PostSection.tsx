import React, { useState, useEffect, useId, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowDownIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "@/hooks/use-outside-click";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface Property {
  id: number;
  title: string;
  short_desc: string;
  price: number;
  province: { name: string };
  district: { name: string };
  category_id: number;
  city: { name: string };
  user: { name: string };
  images: { image_url: string; is_primary: boolean }[];
  created_at: string;
}

interface PropertyResponse {
  items: Property[];
}

const homedomain = import.meta.env.PUBLIC_HOME_DOMAIN;

const PostSection: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;
  const urlendpoint = import.meta.env.PUBLIC_FASTAPI_ENDPOINT;
  const [active, setActive] = useState<Property | boolean | null>(null);
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);

  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const handleCategoryChange = (value: string) => {
    setSelectedCategory(Number(value));
  };

  const categories = [
    { key: 11, value: "Home", badgeColor: "bg-blue-500 rounded-lg p-2" },
    { key: 12, value: "Apartment", badgeColor: "bg-red-500 rounded-lg p-2" },
    { key: 13, value: "Kavling", badgeColor: "bg-yellow-500 rounded-lg p-2" },
    { key: 14, value: "Office", badgeColor: "bg-purple-500 rounded-lg p-2" },
    { key: 15, value: "Warehouse", badgeColor: "bg-green-500 rounded-lg p-2" },
  ];

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${urlendpoint}/properties/?page=${currentPage}&size=${pageSize}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: PropertyResponse = await response.json();
        const sortedProperties = data.items.sort((a, b) => {
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        });
        setProperties((prevProperties) => [
          ...prevProperties,
          ...sortedProperties,
        ]);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching properties:", error);
        setLoading(false);
      }
    };
    fetchProperties();
  }, [currentPage]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActive(false);
      }
    }
    if (active && typeof active === "object") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  const getImageUrl = (property: Property) => {
    const primaryImage = property.images.find((img) => img.is_primary);
    return primaryImage
      ? `${homedomain}/storage/${primaryImage.image_url}`
      : "images/home_fallback.png";
  };

  const handleLoadMore = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  if (loading && currentPage === 1) {
    return (
      <div className="skeleton">
        <Skeleton className="w-[100px] h-[20px] rounded-md" />
      </div>
    );
  }

  return (
    <section className="text-gray-800 bg-gray-100 dark:bg-gray-800 dark:text-gray-100">
      <div className="container max-w-6xl p-6 mx-auto space-y-6 sm:space-y-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">Property Listings</h2>
          <div className="w-48">
            <label
              htmlFor="category"
              className="block mb-1 text-sm font-medium text-gray-700"
            >
              Filter by Category
            </label>
            <Select
              value={selectedCategory?.toString() ?? ""}
              onValueChange={(value) => setSelectedCategory(Number(value))}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Categories</SelectLabel>
                  {categories.map((category) => (
                    <SelectItem
                      key={category.key}
                      value={category.key.toString()}
                    >
                      {category.value}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="container max-w-6xl p-6 mx-auto space-y-6 sm:space-y-12">
        <AnimatePresence>
          {active && typeof active === "object" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-10 w-full h-full bg-black/20"
            />
          )}
        </AnimatePresence>
        <AnimatePresence>
          {active && typeof active === "object" ? (
            <div className="fixed inset-0 grid place-items-center z-[100]">
              <motion.button
                key={`button-${active.title}-${id}`}
                layout
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                exit={{
                  opacity: 0,
                  transition: {
                    duration: 0.05,
                  },
                }}
                className="absolute flex items-center justify-center w-6 h-6 bg-white rounded-full top-2 right-2 lg:hidden"
                onClick={() => setActive(null)}
              >
                <CloseIcon />
              </motion.button>
              <motion.div
                layoutId={`card-${active.title}-${id}`}
                ref={ref}
                className="w-full max-w-[500px] h-full md:h-fit md:max-h-[90%] flex flex-col bg-white dark:bg-neutral-900 sm:rounded-3xl overflow-hidden"
              >
                <motion.div
                  layoutId={`image-${active.title}-${id}`}
                  className="relative"
                >
                  <img
                    src={getImageUrl(active)}
                    alt={active.title}
                    className="object-cover object-top w-full h-80 lg:h-80 sm:rounded-tr-lg sm:rounded-tl-lg"
                  />
                  {
                    categories.find(
                      (category) => category.key === active.category_id
                    )?.value
                  }
                </motion.div>

                <div>
                  <div className="flex items-start justify-between p-4">
                    <div className="">
                      <motion.h3
                        layoutId={`title-${active.title}-${id}`}
                        className="text-base font-medium text-neutral-700 dark:text-neutral-200"
                      >
                        {active.title}
                      </motion.h3>
                      <motion.p
                        layoutId={`description-${active.short_desc}-${id}`}
                        className="text-base text-neutral-600 dark:text-neutral-400"
                      >
                        {active.short_desc}
                      </motion.p>
                    </div>

                    <motion.a
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      href={`/post/${active.id}`}
                      className="px-4 py-3 text-sm font-bold text-white bg-green-500 rounded-full"
                    >
                      Detail
                    </motion.a>
                  </div>
                  <div className="relative px-4 pt-4">
                    <motion.div
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-neutral-600 text-xs md:text-sm lg:text-base h-40 md:h-fit pb-10 flex flex-col items-start gap-4 overflow-auto dark:text-neutral-400 [mask:linear-gradient(to_bottom,white,white,transparent)] [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch]"
                    >
                      <p> Created at : {active.created_at}</p>
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        {`${active.province.name}, ${active.district.name}, ${active.city.name}`}
                      </span>
                      <p>Post by: {active.user.name}</p>
                      <p>
                        Category:{" "}
                        {
                          categories.find(
                            (category) => category.key === active.category_id
                          )?.value
                        }
                      </p>
                      <p className="font-bold">
                        Price: Rp {active.price.toLocaleString()}
                      </p>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </div>
          ) : null}
        </AnimatePresence>
        <ul className="grid items-start w-full max-w-6xl grid-cols-1 gap-4 mx-auto md:grid-cols-2 lg:grid-cols-4">
          {properties.map((property, index) => (
            <motion.div
              layoutId={`card-${property.title}-${id}`}
              key={property.title}
              onClick={() => setActive(property)}
              className="flex flex-col p-4 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl"
            >
              <div className="flex flex-col w-full gap-4">
                <motion.div layoutId={`image-${property.title}-${id}`}>
                  <img
                    src={getImageUrl(property)}
                    alt={property.title}
                    className="object-cover object-top w-full rounded-lg h-60"
                  />
                  <Badge className="absolute m-2 text-white bg-green-500 bottom-2 right-2">
                    {
                      categories.find(
                        (category) => category.key === property.category_id
                      )?.value
                    }
                  </Badge>
                </motion.div>
                <div className="flex flex-col items-center justify-center">
                  <motion.h3
                    layoutId={`title-${property.title}-${id}`}
                    className="text-base font-medium text-center text-neutral-800 dark:text-neutral-200 md:text-left"
                  >
                    {property.title}
                  </motion.h3>
                  <motion.p
                    layoutId={`description-${property.short_desc}-${id}`}
                    className="text-base text-center text-neutral-600 dark:text-neutral-400 md:text-left"
                  >
                    {property.short_desc}
                  </motion.p>
                  <motion.p
                    layoutId={`category-${property.category_id}-${id}`}
                    className={`text-sm text-center md:text-left ${
                      categories.find(
                        (category) => category.key === property.category_id
                      )?.badgeColor
                    }`}
                  >
                    {
                      categories.find(
                        (category) => category.key === property.category_id
                      )?.value
                    }
                  </motion.p>
                </div>
              </div>
            </motion.div>
          ))}
        </ul>
        <div className="flex justify-center">
          <Button
            onClick={handleLoadMore}
            variant="outline"
            size="default"
            className="flex items-center px-6 py-3 text-sm text-gray-600 bg-gray-300 rounded-md hover:underline dark:bg-gray-900 dark:text-gray-400 animate-bounce"
            disabled={loading}
          >
            <span className="mr-2">
              {loading ? "Loading..." : "Load more properties..."}
            </span>
            <ArrowDownIcon className="w-5 h-5 animate-bounce" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export const CloseIcon = () => {
  return (
    <motion.svg
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
        transition: {
          duration: 0.05,
        },
      }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4 text-black"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  );
};

export default PostSection;
