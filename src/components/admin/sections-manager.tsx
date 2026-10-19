"use client";

import { GripVertical } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { ReorderButtons } from "@/components/admin/reorder-buttons";
import { moveSection, toggleSectionVisibility } from "@/lib/actions/sections";
import type { SiteSection } from "@/lib/types";

const DESCRIPTIONS: Partial<Record<string, string>> = {
  hero: "Your name, headline, and call-to-action at the top of the page.",
  about: "Bio, photo, and résumé download.",
  projects: "AI Automation projects grid.",
  webapps: "Web App projects grid.",
  experience: "Work history timeline.",
  skills: "Skills grouped by category.",
  certifications: "Certifications and training.",
  blog: "Latest posts teaser.",
  contact: "Contact form and details.",
};

export function SectionsManager({ sections }: { sections: SiteSection[] }) {
  const sorted = [...sections].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div className="flex flex-col gap-2">
      {sorted.map((section, i) => {
        const isHero = section.key === "hero";
        return (
          <div
            key={section.id}
            className="flex items-center gap-3 rounded-[var(--radius-md)] border border-border-strong p-4"
          >
            <GripVertical className="h-4 w-4 shrink-0 text-muted-foreground" />
            <ReorderButtons
              disableUp={isHero || i === 0}
              disableDown={isHero || i === sorted.length - 1}
              onMoveUp={() => moveSection(sorted, section.id, "up")}
              onMoveDown={() => moveSection(sorted, section.id, "down")}
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">{section.label}</p>
              <p className="text-xs text-muted-foreground">
                {isHero ? "Always shown first — can be hidden, not reordered." : DESCRIPTIONS[section.key]}
              </p>
            </div>
            <Switch
              defaultChecked={section.visible}
              onCheckedChange={(checked) => toggleSectionVisibility(section.id, checked)}
              aria-label={`Toggle ${section.label} visibility`}
            />
          </div>
        );
      })}
    </div>
  );
}
