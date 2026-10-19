import Image from "next/image";
import { ExternalLink, FileText } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { formatDate } from "@/lib/utils";
import type { Certification } from "@/lib/types";

export function CertificationsSection({
  certifications,
}: {
  certifications: Certification[];
}) {
  if (certifications.length === 0) return null;

  return (
    <section id="certifications" className="mx-auto max-w-7xl px-6 py-20 sm:py-28">
      <Reveal>
        <h2 className="font-display text-3xl font-medium sm:text-4xl">
          Certifications &amp; training
        </h2>
      </Reveal>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {certifications.map((cert, i) => (
          <Reveal key={cert.id} delay={Math.min(i, 5) * 0.06}>
            <div className="glass flex h-full flex-col gap-4 rounded-[var(--radius-lg)] p-6">
              <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-[var(--radius-sm)] bg-white/5">
                {cert.file_url && cert.file_type === "image" ? (
                  <Image
                    src={cert.file_url}
                    alt={cert.title}
                    width={56}
                    height={56}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <FileText className="h-6 w-6 text-accent" />
                )}
              </div>
              <div>
                <h3 className="font-display text-base font-medium leading-snug">{cert.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{cert.issuing_organization}</p>
                {cert.issue_date && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Issued {formatDate(cert.issue_date)}
                    {cert.expiry_date ? ` · Expires ${formatDate(cert.expiry_date)}` : ""}
                  </p>
                )}
              </div>
              <div className="mt-auto flex gap-3 pt-1 text-sm">
                {cert.credential_url && (
                  <a
                    href={cert.credential_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-accent hover:underline"
                  >
                    Verify <ExternalLink className="h-3 w-3" />
                  </a>
                )}
                {cert.file_url && (
                  <a
                    href={cert.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"
                  >
                    View file <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
