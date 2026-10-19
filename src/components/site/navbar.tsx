"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X, Download } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { SiteSection } from "@/lib/types";

const LABELS: Partial<Record<string, string>> = {
  about: "About",
  projects: "Automation",
  webapps: "Web Apps",
  experience: "Experience",
  skills: "Skills",
  certifications: "Certifications",
  blog: "Writing",
  contact: "Contact",
};

export function Navbar({
  fullName,
  sections,
  resumeUrl,
}: {
  fullName: string;
  sections: SiteSection[];
  resumeUrl?: string | null;
}) {
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = sections.filter((s) => s.key !== "hero" && LABELS[s.key]);
  const initials = fullName
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-all duration-300",
        scrolled ? "py-3" : "py-5"
      )}
    >
      <div className="mx-auto flex max-w-[96rem] items-center justify-between px-6">
        <nav
          className={cn(
            "glass-nav flex w-full items-center justify-between rounded-full px-4 py-2 transition-shadow",
            scrolled && "shadow-lg"
          )}
        >
          <Link
            href="/#hero"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-soft font-display text-sm font-medium text-accent"
          >
            {initials || "•"}
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {links.map((section) => (
              <a
                key={section.id}
                href={`/#${section.key}`}
                className="rounded-full px-3.5 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground hover:bg-white/5"
              >
                {LABELS[section.key]}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            {resumeUrl && (
              <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
                <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                  <Download className="h-3.5 w-3.5" /> Resume
                </a>
              </Button>
            )}
            <ThemeToggle />
            <button
              className="inline-flex h-9 w-9 items-center justify-center rounded-full md:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </nav>
      </div>

      {open && (
        <div className="mx-6 mt-2">
          <div className="glass-nav flex flex-col gap-1 rounded-[var(--radius-lg)] p-3 md:hidden">
            {links.map((section) => (
              <a
                key={section.id}
                href={`/#${section.key}`}
                onClick={() => setOpen(false)}
                className="rounded-[var(--radius-sm)] px-3 py-2 text-sm text-muted-foreground hover:bg-white/5 hover:text-foreground"
              >
                {LABELS[section.key]}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
