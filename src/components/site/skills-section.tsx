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
    <section id="skills" className="mx-auto max-w-5xl px-6 py-20 sm:py-28">
      <Reveal>
        <h2 className="font-display text-3xl font-medium sm:text-4xl">Skills</h2>
      </Reveal>

      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        {Object.entries(grouped).map(([category, items], i) => (
          <Reveal key={category} delay={Math.min(i, 4) * 0.06}>
            <div className="glass h-full rounded-[var(--radius-lg)] p-6">
              <h3 className="mb-5 font-display text-lg font-medium text-accent">{category}</h3>
              <ul className="flex flex-col gap-4">
                {items.map((skill) => (
                  <li key={skill.id} className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-md bg-white/5">
                      {skill.icon_url ? (
                        <Image
                          src={skill.icon_url}
                          alt={skill.name}
                          width={20}
                          height={20}
                          className="object-contain"
                        />
                      ) : (
                        <span className="text-xs font-medium text-muted-foreground">
                          {skill.name.slice(0, 1)}
                        </span>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-sm">
                        <span>{skill.name}</span>
                        <span className="text-xs text-muted-foreground">{skill.proficiency}%</span>
                      </div>
                      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                        <div
                          className="h-full rounded-full bg-accent transition-all duration-700"
                          style={{ width: `${skill.proficiency}%` }}
                        />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
