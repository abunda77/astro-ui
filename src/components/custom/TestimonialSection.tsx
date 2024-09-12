import React from "react";
import { cn } from "@/lib/utils";
import Marquee from "@/components/magicui/marquee";

const testimonials = [
  {
    name: "Kenzie Edgar",
    username: "@kenzie",
    body: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos sunt ratione dolor exercitationem minima quas itaque saepe quasi architecto vel! Accusantium, vero sint recusandae cum tempora nemo commodi soluta deleniti.",
    img: "https://i.pravatar.cc/100?img=1",
  },
  {
    name: "Stevie Tifft",
    username: "@stevie",
    body: "Lorem ipsum, dolor sit amet, consectetur adipisicing elit. Dolore quod necessitatibus, labore sapiente, est, dignissimos ullam error ipsam sint quam tempora vel.",
    img: "https://i.pravatar.cc/100?img=2",
  },
  {
    name: "Tommie Ewart",
    username: "@tommie",
    body: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vitae, obcaecati ullam excepturi dicta error deleniti sequi.",
    img: "https://i.pravatar.cc/100?img=3",
  },
  {
    name: "Charlie Howse",
    username: "@charlie",
    body: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto inventore voluptatum nostrum atque, corrupti, vitae esse id accusamus dignissimos neque reprehenderit natus, hic sequi itaque dicta nisi voluptatem! Culpa, iusto.",
    img: "https://i.pravatar.cc/100?img=4",
  },
  {
    name: "Nevada Herbertson",
    username: "@nevada",
    body: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis, voluptatem porro obcaecati dicta, quibusdam sunt ipsum, laboriosam nostrum facere exercitationem pariatur deserunt tempora molestiae assumenda nesciunt alias eius? Illo, autem!",
    img: "https://i.pravatar.cc/100?img=5",
  },
  {
    name: "Kris Stanton",
    username: "@kris",
    body: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem iusto, explicabo, cupiditate quas totam!",
    img: "https://i.pravatar.cc/100?img=6",
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
        "relative w-64 cursor-pointer overflow-hidden rounded-xl border p-4 mx-2",
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]"
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
      <blockquote className="mt-2 text-sm">{body}</blockquote>
    </figure>
  );
};

const TestimonialSection: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen py-5 min-w-screen bg-gray-50">
      <div className="w-full px-5 py-16 text-gray-800 bg-white border-t border-b border-gray-200 md:py-24">
        <div className="w-full max-w-6xl mx-auto">
          <div className="max-w-xl mx-auto mb-10 text-center">
            <h1 className="mb-5 text-6xl font-bold text-gray-600 md:text-7xl">
              Apa yang orang <br />
              katakan.
            </h1>
            <h3 className="mb-5 text-xl font-light">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
            </h3>
            <div className="text-center">
              <span className="inline-block w-1 h-1 ml-1 bg-indigo-500 rounded-full"></span>
              <span className="inline-block w-3 h-1 ml-1 bg-indigo-500 rounded-full"></span>
              <span className="inline-block w-40 h-1 bg-indigo-500 rounded-full"></span>
              <span className="inline-block w-3 h-1 ml-1 bg-indigo-500 rounded-full"></span>
              <span className="inline-block w-1 h-1 ml-1 bg-indigo-500 rounded-full"></span>
            </div>
          </div>
          <div className="relative w-full overflow-hidden border rounded-lg bg-background md:shadow-xl">
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
            <div className="absolute inset-y-0 left-0 w-1/3 pointer-events-none bg-gradient-to-r from-white dark:from-background"></div>
            <div className="absolute inset-y-0 right-0 w-1/3 pointer-events-none bg-gradient-to-l from-white dark:from-background"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialSection;
