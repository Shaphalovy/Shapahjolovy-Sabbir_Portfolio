import Link from "next/link";
import { getSocialIcon } from "@/lib/social-icons";
import type { Social } from "@/lib/types";

export function Footer({
  fullName,
  socials,
}: {
  fullName: string;
  socials: Social[];
}) {
  const visible = socials.filter((s) => s.visible);

  return (
    <footer className="mx-auto max-w-7xl px-6 pb-10 pt-6">
      <div className="glass flex flex-col items-center gap-5 rounded-[var(--radius-lg)] px-6 py-8 text-center sm:flex-row sm:justify-between sm:text-left">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} {fullName}. Built with care.
        </p>
        <div className="flex items-center gap-2">
          {visible.map((social) => {
            const Icon = getSocialIcon(social.icon);
            return (
              <Link
                key={social.id}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.platform}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border-strong text-muted-foreground transition-colors hover:border-accent/50 hover:text-accent"
              >
                <Icon className="h-4 w-4" />
              </Link>
            );
          })}
        </div>
      </div>
    </footer>
  );
}
