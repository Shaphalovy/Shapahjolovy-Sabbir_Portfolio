"use client";

import * as React from "react";
import Image from "next/image";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export function ProjectGallery({ images, title }: { images: string[]; title: string }) {
  const [index, setIndex] = React.useState<number | null>(null);
  const open = index !== null;

  const go = React.useCallback(
    (step: number) => {
      setIndex((i) => (i === null ? i : (i + step + images.length) % images.length));
    },
    [images.length]
  );

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, go]);

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

      <DialogPrimitive.Root open={open} onOpenChange={(o) => !o && setIndex(null)}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <DialogPrimitive.Content
            aria-describedby={undefined}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 focus:outline-none sm:p-10"
            onClick={(e) => {
              if (e.target === e.currentTarget) setIndex(null);
            }}
          >
            <DialogPrimitive.Title className="sr-only">
              {title} screenshot {index !== null ? index + 1 : ""} of {images.length}
            </DialogPrimitive.Title>

            {index !== null && (
              <div className="relative h-full w-full">
                <Image
                  src={images[index]}
                  alt={`${title} screenshot ${index + 1}`}
                  fill
                  sizes="100vw"
                  quality={90}
                  className="object-contain"
                  priority
                />
              </div>
            )}

            <DialogPrimitive.Close
              aria-label="Close"
              className="absolute right-3 top-3 rounded-full bg-black/60 p-2.5 text-white transition-colors hover:bg-black/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:right-5 sm:top-5"
            >
              <X className="h-5 w-5" />
            </DialogPrimitive.Close>

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  aria-label="Previous image"
                  onClick={() => go(-1)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-2.5 text-white transition-colors hover:bg-black/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:left-5"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  type="button"
                  aria-label="Next image"
                  onClick={() => go(1)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-2.5 text-white transition-colors hover:bg-black/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:right-5"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
                <p className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-xs text-white sm:bottom-5">
                  {(index ?? 0) + 1} / {images.length}
                </p>
              </>
            )}
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </>
  );
}
