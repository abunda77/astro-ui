import React from "react";
import { Check, Clock } from "lucide-react";

const Section01 = () => {
  const brands = [
    { name: "CNN", logo: "images/cnn.png" },
    { name: "VICE", logo: "images/vice.png" },
    { name: "Bloomberg", logo: "images/bloomberg.png" },
    { name: "FASHIONISTA", logo: "images/fashionita.png" },
    { name: "NEW YORK POST", logo: "images/newyorktime.png" },
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
    { name: "Harsco", logo: "images/harsco.png" },
    { name: "Rogers", logo: "images/rogers.png" },
    { name: "Berkeley", logo: "images/berkeley.png" },
    { name: "NCR", logo: "images/ncr.png" },
    { name: "Octa", logo: "images/octa.png" },
    { name: "WarnerMedia", logo: "images/warnermedia.png" },
  ];

  return (
    <section className="px-4 py-12 bg-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* As seen on logos */}
        <div className="flex flex-wrap justify-center mb-12 space-x-4 sm:space-x-0 sm:space-y-4">
          <p className="self-center text-gray-500">As seen on:</p>
          {brands.map((brand) => (
            <img
              key={brand.name}
              src={brand.logo}
              alt={`${brand.name} logo`}
              className="object-contain h-8 sm:w-1/2 sm:mb-4"
            />
          ))}
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
