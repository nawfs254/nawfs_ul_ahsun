"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useState } from "react";

interface Props {
  open: boolean;
  images: string[];
  title?: string;
  onClose: () => void;
}

export default function GalleryModal({ open, images, title, onClose }: Props) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (open) {
      setCurrent(0);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  if (!open || !images?.length) return null;

  return (
    <div className="fixed inset-0 z-[999] bg-black/95">
      <button
        onClick={onClose}
        className="absolute right-6 top-20 z-10 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
      >
        <X size={24} />
      </button>

      <div className="flex h-full items-center justify-center">
        {images.length > 1 && (
          <button
            onClick={() =>
              setCurrent((prev) => (prev - 1 + images.length) % images.length)
            }
            className="absolute left-6 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"
          >
            <ChevronLeft size={28} />
          </button>
        )}

        <img
          src={images[current]}
          alt={title}
          className="max-h-[90vh] max-w-[90vw] object-contain"
        />

        {images.length > 1 && (
          <button
            onClick={() => setCurrent((prev) => (prev + 1) % images.length)}
            className="absolute right-6 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"
          >
            <ChevronRight size={28} />
          </button>
        )}
      </div>

      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-2 rounded-full transition-all ${
              current === index ? "w-8 bg-white" : "w-2 bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
