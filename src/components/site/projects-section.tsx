"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, MoveHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoopingRow, type LoopingRowHandle } from "@/components/site/looping-row";
import { Reveal } from "@/components/reveal";
import { ProjectCard } from "@/components/site/project-card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Project } from "@/lib/types";

interface ProjectsSectionProps {
  projects: Project[];
  id?: string;
  title?: string;
  description?: string;
  /** "grid" wraps cards into rows; "scroll" keeps one horizontally scrollable row. */
  layout?: "grid" | "scroll";
}

export function ProjectsSection({
  projects,
  id = "projects",
  title = "AI Automation Projects",
  description = "Workflows, agents, and automations I've designed, built, and shipped.",
  layout = "grid",
}: ProjectsSectionProps) {
  const categories = React.useMemo(
    () => Array.from(new Set(projects.map((p) => p.category))),
    [projects]
  );
  const [active, setActive] = React.useState("all");

  const rowRef = React.useRef<LoopingRowHandle>(null);

  if (projects.length === 0) return null;

  const visible = active === "all" ? projects : projects.filter((p) => p.category === active);
  const loop = layout === "scroll" && visible.length >= 2;

  return (
    <section id={id} className="mx-auto max-w-[96rem] px-6 py-20 sm:py-28">
      <Reveal>
        <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-display text-3xl font-medium sm:text-4xl">{title}</h2>
            <p className="mt-2 max-w-md text-muted-foreground">{description}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
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
            {loop && (
              <div className="flex items-center gap-2">
                <span className="mr-1 hidden items-center gap-1.5 text-xs text-muted-foreground lg:inline-flex">
                  <MoveHorizontal className="h-3.5 w-3.5" /> Drag to explore
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  aria-label="Scroll projects left"
                  onClick={() => rowRef.current?.nudge(-1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  aria-label="Scroll projects right"
                  onClick={() => rowRef.current?.nudge(1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </Reveal>

      {loop ? (
        <LoopingRow
          ref={rowRef}
          resetKey={active}
          peek
          itemClassName="w-[85cqw] sm:w-[calc((100cqw-1.5rem)/2)] lg:w-[calc((100cqw-3rem)/3)] xl:w-[calc((100cqw-4.5rem)/4)]"
          items={visible.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visible.map((project, i) => (
            <Reveal key={project.id} delay={Math.min(i, 5) * 0.06}>
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}
