import Image from "next/image";
import { Reveal } from "@/components/reveal";
import type { Skill } from "@/lib/types";

export function SkillsSection({ skills }: { skills: Skill[] }) {
  if (skills.length === 0) return null;

  const grouped = skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    (acc[skill.category] ??= []).push(skill);
    return acc;
  }, {});

  return (
    <section id="skills" className="mx-auto max-w-7xl px-6 py-20 sm:py-28">
      <Reveal>
        <h2 className="font-display text-3xl font-medium sm:text-4xl">Skills</h2>
      </Reveal>

      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        {Object.entries(grouped).map(([category, items], i) => (
          <Reveal key={category} delay={Math.min(i, 4) * 0.06}>
            <div className="glass h-full rounded-[var(--radius-lg)] p-6">
              <h3 className="mb-5 font-display text-lg font-medium text-accent">{category}</h3>
              <div className="flex flex-wrap gap-2.5">
                {items.map((skill) => (
                  <div
                    key={skill.id}
                    className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-2 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/40 hover:bg-white/[0.06]"
                  >
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/5">
                      {skill.icon_url ? (
                        <Image
                          src={skill.icon_url}
                          alt={skill.name}
                          width={14}
                          height={14}
                          className="object-contain"
                        />
                      ) : (
                        <span className="text-[9px] font-medium text-muted-foreground">
                          {skill.name.slice(0, 1)}
                        </span>
                      )}
                    </div>
                    <span className="text-sm">{skill.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
