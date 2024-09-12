import React from "react";
import { cn } from "@/lib/utils";
import Marquee from "@/components/magicui/marquee";

const testimonials = [
  {
    name: "Budi Santoso",
    username: "@budi",
    body: "Bosque Properti sangat membantu saya dalam menemukan rumah impian saya. Pelayanannya cepat dan profesional. Saya sangat merekomendasikan platform ini!",
    img: "https://i.pravatar.cc/100?img=7",
  },
  {
    name: "Siti Aminah",
    username: "@siti",
    body: "Sebagai developer, saya sangat terbantu dengan layanan Bosque Properti. Proses jual beli properti menjadi lebih mudah dan efisien. Terima kasih Bosque Properti!",
    img: "https://i.pravatar.cc/100?img=8",
  },
  {
    name: "Andi Wijaya",
    username: "@andi",
    body: "Saya berhasil menjual apartemen saya dengan cepat melalui Bosque Properti. Platform ini sangat user-friendly dan memiliki banyak fitur yang membantu.",
    img: "https://i.pravatar.cc/100?img=9",
  },
  {
    name: "Dewi Lestari",
    username: "@dewi",
    body: "Bosque Properti memberikan layanan yang sangat memuaskan. Saya berhasil menemukan kantor baru untuk bisnis saya dengan mudah. Sangat direkomendasikan!",
    img: "https://i.pravatar.cc/100?img=10",
  },
  {
    name: "Rudi Hartono",
    username: "@rudi",
    body: "Platform ini sangat membantu dalam mencari properti real estate. Saya sangat puas dengan layanan yang diberikan oleh Bosque Properti.",
    img: "https://i.pravatar.cc/100?img=11",
  },
  {
    name: "Lina Marlina",
    username: "@lina",
    body: "Bosque Properti memudahkan saya dalam mencari rumah baru. Pelayanannya sangat ramah dan profesional. Terima kasih Bosque Properti!",
    img: "https://i.pravatar.cc/100?img=12",
  },
];

const firstRow = testimonials.slice(0, testimonials.length / 2);
const secondRow = testimonials.slice(testimonials.length / 2);

const TestimonialCard = ({
  img,
  name,
  username,
  body,
}: {
  img: string;
  name: string;
  username: string;
  body: string;
}) => {
  return (
    <figure
      className={cn(
        "relative w-64 cursor-pointer overflow-hidden rounded-xl p-4 mx-2",
        "bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        "dark:bg-gradient-to-br dark:from-gray-700 dark:via-gray-900 dark:to-black dark:hover:bg-gradient-to-tl dark:hover:from-gray-600 dark:hover:via-gray-800 dark:hover:to-black"
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <img className="rounded-full" width="32" height="32" alt="" src={img} />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium dark:text-white">
            {name}
          </figcaption>
          <p className="text-xs font-medium dark:text-white/40">{username}</p>
        </div>
      </div>
      <blockquote className="mt-2 text-sm dark:text-gray-300">
        {body}
      </blockquote>
    </figure>
  );
};

const TestimonialSection: React.FC = () => {
  return (
    // <div className="flex items-center justify-center min-h-screen py-5 min-w-screen bg-gray-50 dark:bg-black">
    //   <div className="w-full px-5 py-12 text-gray-800 bg-white md:py-24 dark:bg-black ">

    <div className="flex items-center justify-center min-h-screen py-5 min-w-screen ">
      <div className="w-full px-5 py-12 text-gray-800 md:py-24">
        <div className="w-full max-w-6xl mx-auto">
          <div className="max-w-xl mx-auto mb-10 text-center">
            <h1 className="mb-5 text-6xl font-bold text-gray-600 md:text-7xl dark:text-gray-300">
              Apa yang orang <br />
              katakan.
            </h1>
            <h3 className="mb-5 text-xl font-light dark:text-gray-300">
              Berikut adalah beberapa testimoni dari pelanggan kami.
            </h3>
            <div className="text-center">
              <span className="inline-block w-1 h-1 ml-1 bg-indigo-500 rounded-full"></span>
              <span className="inline-block w-3 h-1 ml-1 bg-indigo-500 rounded-full"></span>
              <span className="inline-block w-40 h-1 bg-indigo-500 rounded-full"></span>
              <span className="inline-block w-3 h-1 ml-1 bg-indigo-500 rounded-full"></span>
              <span className="inline-block w-1 h-1 ml-1 bg-indigo-500 rounded-full"></span>
            </div>
          </div>
          <div className="relative w-full overflow-hidden ">
            <Marquee className="py-4 [--duration:40s]" pauseOnHover repeat={2}>
              {testimonials.map((testimonial) => (
                <TestimonialCard key={testimonial.username} {...testimonial} />
              ))}
            </Marquee>
            <Marquee
              className="py-4 [--duration:40s]"
              pauseOnHover
              repeat={2}
              reverse
            >
              {testimonials.map((testimonial) => (
                <TestimonialCard key={testimonial.username} {...testimonial} />
              ))}
            </Marquee>
            {/* <div className="absolute inset-y-0 left-0 w-1/3 pointer-events-none bg-gradient-to-r from-white dark:from-black"></div>
            <div className="absolute inset-y-0 right-0 w-1/3 pointer-events-none bg-gradient-to-l from-white dark:from-black"></div> */}

            <div className="absolute inset-y-0 left-0 w-1/3 pointer-events-none "></div>
            <div className="absolute inset-y-0 right-0 w-1/3 pointer-events-none "></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialSection;
