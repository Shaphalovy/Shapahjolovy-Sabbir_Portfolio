import Image from "next/image";
import { Reveal } from "@/components/reveal";
import { formatDateRange } from "@/lib/utils";
import type { Experience } from "@/lib/types";

export function ExperienceSection({ experience }: { experience: Experience[] }) {
  if (experience.length === 0) return null;

  const sorted = [...experience].sort(
    (a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
  );

  return (
    <section id="experience" className="mx-auto max-w-7xl px-6 py-20 sm:py-28">
      <Reveal>
        <h2 className="font-display text-3xl font-medium sm:text-4xl">Experience</h2>
      </Reveal>

      <div className="relative mt-12 flex max-w-4xl flex-col gap-10">
        <div
          aria-hidden
          className="absolute bottom-2 left-[19px] top-2 w-px bg-border sm:left-[23px]"
        />
        {sorted.map((role, i) => (
          <Reveal key={role.id} delay={Math.min(i, 4) * 0.06}>
            <div className="relative flex gap-5 pl-0 sm:gap-6">
              <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border-strong bg-background-alt sm:h-12 sm:w-12">
                {role.logo_url ? (
                  <Image src={role.logo_url} alt={role.company} fill className="object-cover" />
                ) : (
                  <span className="font-display text-sm text-muted-foreground">
                    {role.company.slice(0, 1)}
                  </span>
                )}
              </div>

              <div className="glass flex-1 rounded-[var(--radius-lg)] p-6">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h3 className="font-display text-lg font-medium">{role.role}</h3>
                  <span className="text-sm text-muted-foreground">
                    {formatDateRange(role.start_date, role.end_date, role.is_current)}
                  </span>
                </div>
                <p className="mt-0.5 text-sm text-accent">
                  {role.company_url ? (
                    <a href={role.company_url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {role.company}
                    </a>
                  ) : (
                    role.company
                  )}
                  {role.location ? ` · ${role.location}` : ""}
                </p>

                {role.responsibilities.length > 0 && (
                  <ul className="mt-4 space-y-1.5 text-sm text-muted-foreground">
                    {role.responsibilities.map((r, idx) => (
                      <li key={idx} className="flex gap-2">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground" />
                        {r}
                      </li>
                    ))}
                  </ul>
                )}

                {role.achievements.length > 0 && (
                  <ul className="mt-3 space-y-1.5 text-sm">
                    {role.achievements.map((a, idx) => (
                      <li key={idx} className="flex gap-2 text-foreground/90">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                        {a}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
