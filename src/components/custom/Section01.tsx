import React from "react";
import { Check, Clock } from "lucide-react";

const Section01 = () => {
  const brands = [
    { name: "CNN", logo: "images/cnn.png" },
    { name: "VICE", logo: "images/vice.png" },
    { name: "Bloomberg", logo: "images/bloomberg.png" },
    { name: "FASHIONISTA", logo: "images/fashionita.png" },
    { name: "NEW YORK POST", logo: "images/newyorktime.png" },
    // { name: "NEW YORK POST", logo: "images/newyorktime.png" },
  ];

  const customerLogos = [
    { name: "HubSpot", logo: "images/hubspot.png" },
    { name: "Shopify", logo: "images/shopify.png" },
    { name: "eBay", logo: "images/ebay.png" },
    { name: "DELL", logo: "images/dell.png" },
    { name: "box", logo: "images/box.png" },
    { name: "stackoverflow", logo: "images/stackoverflow.png" },
  ];

  const customerLogos2 = [
    { name: "Kompas", logo: "images/kompas.png" },
    { name: "Media Indonesia", logo: "images/mediaindonesia.png" },
    { name: "RealEstate", logo: "images/realestate.webp" },
    { name: "Seputar Indonesia", logo: "images/seputarindonesia.webp" },
    { name: "Tech In Asia", logo: "images/techinasia.png" },
    { name: "WarnerMedia", logo: "images/warnermedia.png" },
  ];

  return (
    <section className="px-4 py-12 bg-gradient-to-t from-blue-100 via-blue-50 to-white dark:from-gray-100 dark:via-gray-50 dark:to-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* As seen on logos */}
        <div className="flex flex-col items-center mb-12">
          <p className="mb-1 text-2xl text-gray-500">As seen on:</p>
          {/* <div className="grid w-full max-w-6xl grid-cols-2 gap-1 sm:gap-8 sm:grid-cols-3 md:grid-cols-6 md:gap-x-2 md:gap-y-16"> */}
          <div className="flex flex-wrap items-center justify-center mt-2 space-x-4 space-y-8">
            {customerLogos2.map((brand) => (
              <div
                key={brand.name}
                className="flex items-center justify-center"
              >
                <img
                  src={brand.logo}
                  alt={`${brand.name} logo`}
                  className="object-contain h-12"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Left column */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">
              All photoshoots include
            </h3>
            <ul className="space-y-2">
              {[
                "80 headshots per person",
                "8 unique locations per shoot",
                "High quality photo size",
              ].map((item) => (
                <li key={item} className="flex items-center">
                  <Check className="mr-2 text-green-500" size={20} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Middle column */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">
              Why choose AI headshots?
            </h3>
            <ul className="space-y-2">
              {[
                "Indistinguishable from real photos",
                "No need for any physical shoot",
                "Matching photos, no matter where",
              ].map((item) => (
                <li key={item} className="flex items-center">
                  <Check className="mr-2 text-green-500" size={20} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right column */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">
              Why choose AI headshots?
            </h3>
            <ul className="space-y-2">
              {[
                "Indistinguishable from real photos",
                "No need for any physical shoot",
                "Matching photos, no matter where",
              ].map((item) => (
                <li key={item} className="flex items-center">
                  <Check className="mr-2 text-green-500" size={20} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Reviews & examples */}
        <div className="mt-12 text-center">
          <h2 className="mb-4 text-2xl font-semibold">Reviews & examples</h2>
          <div className="text-4xl font-bold text-teal-500">13,228,221</div>
          <div className="text-3xl">AI headshots already generated</div>
          <div className="mt-2 text-4xl">
            for <span className="font-bold text-yellow-500">80,469</span> happy
            customers!
          </div>
          <p className="mt-4 text-gray-600">
            You're in good company. Check out real customer headshots examples,
            shared with their permission.
          </p>
        </div>

        {/* Customer logos */}
        <div className="flex flex-wrap items-center justify-center mt-12 space-x-4 space-y-4">
          {customerLogos.map((customer) => (
            <img
              key={customer.name}
              src={customer.logo}
              alt={`${customer.name} logo`}
              className="object-contain h-8"
            />
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-center mt-12 space-x-4 space-y-4">
          {customerLogos2.map((customer) => (
            <img
              key={customer.name}
              src={customer.logo}
              alt={`${customer.name} logo`}
              className="object-contain h-8"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Section01;
