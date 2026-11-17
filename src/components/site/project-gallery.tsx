"use client";

import * as React from "react";
import Image from "next/image";
import { ImageLightbox } from "@/components/site/image-lightbox";

export function ProjectGallery({ images, title }: { images: string[]; title: string }) {
  const [index, setIndex] = React.useState<number | null>(null);

  if (images.length === 0) return null;

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {images.map((src, i) => (
          <button
            key={src + i}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`View ${title} screenshot ${i + 1} larger`}
            className="group relative aspect-[16/10] cursor-zoom-in overflow-hidden rounded-[var(--radius-md)] border border-border bg-background-alt transition-all duration-300 hover:border-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <Image
              src={src}
              alt={`${title} screenshot ${i + 1}`}
              fill
              sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-contain transition-transform duration-500 group-hover:scale-[1.02]"
            />
          </button>
        ))}
      </div>

      <ImageLightbox
        images={images.map((src, i) => ({ src, alt: `${title} screenshot ${i + 1}` }))}
        index={index}
        onIndexChange={setIndex}
      />
    </>
  );
}
