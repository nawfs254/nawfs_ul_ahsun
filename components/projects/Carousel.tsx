"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type CarouselProps = {
  images: Array<string>;
  alt?: string;
};

export default function Carousel({
  images,
  alt = "project image",
}: CarouselProps) {
  const [current, setCurrent] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  // Auto‑play (optional – you can adjust speed or disable)
  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000); // 5 s per slide
    return () => {
      resetTimeout();
    };
  }, [current, images.length]);

  const prev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  };
  const next = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrent((prev) => (prev + 1) % images.length);
  };

  return (
    <div className="relative h-full w-full overflow-hidden rounded-t-sm">
      {images.map((src, idx) => (
        <div
          key={src}
          className={`absolute inset-0 transition-opacity duration-500 ${idx === current ? "opacity-100" : "opacity-0"}`}
        >
          <img
            src={src}
            alt={alt}
            className="object-cover w-full h-full"
            loading={idx === 0 ? "eager" : "lazy"}
          />
        </div>
      ))}

      {/* Navigation arrows */}
      <button
        onClick={prev}
        className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/30 p-1 text-white hover:bg-black/50"
        aria-label="Previous slide"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={next}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/30 p-1 text-white hover:bg-black/50"
        aria-label="Next slide"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
