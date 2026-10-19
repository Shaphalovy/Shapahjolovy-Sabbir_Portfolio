"use client";

import * as React from "react";
import { Reveal } from "@/components/reveal";
import { ProjectCard } from "@/components/site/project-card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Project } from "@/lib/types";

interface ProjectsSectionProps {
  projects: Project[];
  id?: string;
  title?: string;
  description?: string;
}

export function ProjectsSection({
  projects,
  id = "projects",
  title = "AI Automation Projects",
  description = "Workflows, agents, and automations I've designed, built, and shipped.",
}: ProjectsSectionProps) {
  const categories = React.useMemo(
    () => Array.from(new Set(projects.map((p) => p.category))),
    [projects]
  );
  const [active, setActive] = React.useState("all");

  if (projects.length === 0) return null;

  const visible = active === "all" ? projects : projects.filter((p) => p.category === active);

  return (
    <section id={id} className="mx-auto max-w-7xl px-6 py-20 sm:py-28">
      <Reveal>
        <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-display text-3xl font-medium sm:text-4xl">{title}</h2>
            <p className="mt-2 max-w-md text-muted-foreground">{description}</p>
          </div>
          {categories.length > 1 && (
            <Tabs value={active} onValueChange={setActive}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                {categories.map((c) => (
                  <TabsTrigger key={c} value={c}>
                    {c}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          )}
        </div>
      </Reveal>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((project, i) => (
          <Reveal key={project.id} delay={Math.min(i, 5) * 0.06}>
            <ProjectCard project={project} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
