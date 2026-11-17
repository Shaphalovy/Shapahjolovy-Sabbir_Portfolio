"use client";

import * as React from "react";
import Image from "next/image";
import { ExternalLink, FileText } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { ImageLightbox } from "@/components/site/image-lightbox";
import { formatDate } from "@/lib/utils";
import type { Certification } from "@/lib/types";

const cardClass =
  "glass group flex h-full flex-col overflow-hidden rounded-[var(--radius-lg)] transition-all hover:-translate-y-1 hover:border-accent/40";

export function CertificationGrid({ certifications }: { certifications: Certification[] }) {
  const [index, setIndex] = React.useState<number | null>(null);

  // Only image certificates open in the viewer; PDFs open in a new tab.
  const viewable = certifications.filter((c) => c.file_url && c.file_type === "image");

  return (
    <>
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {certifications.map((cert, i) => {
          const isImage = !!cert.file_url && cert.file_type === "image";
          const isPdf = !!cert.file_url && cert.file_type !== "image";

          const preview = (
            <div className="relative aspect-[4/3] w-full overflow-hidden border-b border-border bg-background-alt">
              {isImage ? (
                <Image
                  src={cert.file_url!}
                  alt={cert.title}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-contain transition-transform duration-500 group-hover:scale-[1.03]"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted-foreground">
                  <FileText className="h-10 w-10 text-accent" />
                  {isPdf && <span className="text-xs">PDF certificate</span>}
                </div>
              )}
            </div>
          );

          const details = (
            <div className="flex flex-1 flex-col gap-1.5 p-6">
              <h3 className="font-display text-lg font-medium leading-snug">{cert.title}</h3>
              <p className="text-sm text-muted-foreground">{cert.issuing_organization}</p>
              {cert.issue_date && (
                <p className="text-xs text-muted-foreground">
                  Issued {formatDate(cert.issue_date, { month: "long", year: "numeric" })}
                  {cert.expiry_date
                    ? ` · Expires ${formatDate(cert.expiry_date, { month: "long", year: "numeric" })}`
                    : ""}
                </p>
              )}
            </div>
          );

          const verify = cert.credential_url && (
            <div className="px-6 pb-5">
              <a
                href={cert.credential_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-accent hover:underline"
              >
                Verify credential <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          );

          return (
            <Reveal key={cert.id} delay={Math.min(i, 5) * 0.06}>
              <div className={cardClass}>
                {isImage ? (
                  <button
                    type="button"
                    onClick={() => setIndex(viewable.findIndex((v) => v.id === cert.id))}
                    aria-label={`View ${cert.title} certificate larger`}
                    className="flex flex-1 cursor-zoom-in flex-col text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    {preview}
                    {details}
                  </button>
                ) : isPdf ? (
                  <a
                    href={cert.file_url!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-1 flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    {preview}
                    {details}
                  </a>
                ) : (
                  <div className="flex flex-1 flex-col">
                    {preview}
                    {details}
                  </div>
                )}
                {verify}
              </div>
            </Reveal>
          );
        })}
      </div>

      <ImageLightbox
        images={viewable.map((c) => ({ src: c.file_url!, alt: `${c.title} certificate` }))}
        index={index}
        onIndexChange={setIndex}
      />
    </>
  );
}
