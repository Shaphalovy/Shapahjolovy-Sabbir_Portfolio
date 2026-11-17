import { Reveal } from "@/components/reveal";
import { CertificationGrid } from "@/components/site/certification-grid";
import type { Certification } from "@/lib/types";

export function CertificationsSection({
  certifications,
}: {
  certifications: Certification[];
}) {
  if (certifications.length === 0) return null;

  return (
    <section id="certifications" className="mx-auto max-w-[96rem] px-6 py-20 sm:py-28">
      <Reveal>
        <h2 className="font-display text-3xl font-medium sm:text-4xl">
          Certifications &amp; training
        </h2>
      </Reveal>

      <CertificationGrid certifications={certifications} />
    </section>
  );
}
