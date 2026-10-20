"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
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

  const trackRef = React.useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = React.useState(false);
  const [canRight, setCanRight] = React.useState(false);

  const updateArrows = React.useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  React.useEffect(() => {
    if (layout !== "scroll") return;
    const el = trackRef.current;
    if (!el) return;
    updateArrows();
    el.addEventListener("scroll", updateArrows, { passive: true });
    const ro = new ResizeObserver(updateArrows);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      ro.disconnect();
    };
  }, [layout, updateArrows, active, projects.length]);

  // Jump back to the first card when the filter changes.
  React.useEffect(() => {
    trackRef.current?.scrollTo({ left: 0 });
  }, [active]);

  const scrollByPage = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.9, behavior: "smooth" });
  };

  if (projects.length === 0) return null;

  const visible = active === "all" ? projects : projects.filter((p) => p.category === active);

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
            {layout === "scroll" && (canLeft || canRight) && (
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  aria-label="Scroll projects left"
                  disabled={!canLeft}
                  onClick={() => scrollByPage(-1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  aria-label="Scroll projects right"
                  disabled={!canRight}
                  onClick={() => scrollByPage(1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </Reveal>

      {layout === "scroll" ? (
        <div
          ref={trackRef}
          className="-my-4 flex snap-x snap-mandatory items-stretch gap-6 overflow-x-auto scroll-smooth py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {visible.map((project) => (
            <div
              key={project.id}
              className="w-[85%] shrink-0 snap-start sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)] xl:w-[calc((100%-4.5rem)/4)]"
            >
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
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
