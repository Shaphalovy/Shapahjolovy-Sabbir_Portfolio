import Image from "next/image";
import { Download } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";
import type { Profile } from "@/lib/types";

export function AboutSection({ profile }: { profile: Profile }) {
  if (!profile.bio) return null;

  return (
    <section id="about" className="mx-auto max-w-5xl px-6 py-20 sm:py-28">
      <Reveal>
        <div className="glass grid gap-10 rounded-[var(--radius-lg)] p-8 sm:p-12 md:grid-cols-[auto_1fr] md:items-start">
          {profile.avatar_url && (
            <div className="relative mx-auto h-32 w-32 shrink-0 overflow-hidden rounded-[var(--radius-lg)] border border-border-strong sm:h-40 sm:w-40">
              <Image
                src={profile.avatar_url}
                alt={profile.full_name}
                fill
                sizes="160px"
                className="object-cover"
              />
            </div>
          )}

          <div className="flex flex-col gap-5">
            <h2 className="font-display text-3xl font-medium sm:text-4xl">About</h2>
            <p className="whitespace-pre-line text-balance leading-relaxed text-muted-foreground">
              {profile.bio}
            </p>
            {profile.resume_url && (
              <div>
                <Button asChild variant="outline">
                  <a href={profile.resume_url} target="_blank" rel="noopener noreferrer">
                    <Download className="h-4 w-4" /> Download résumé
                  </a>
                </Button>
              </div>
            )}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
