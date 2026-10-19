import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { Project } from "@/lib/types";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group glass relative flex h-full flex-col overflow-hidden rounded-[var(--radius-lg)] transition-all duration-300 hover:-translate-y-1.5 hover:border-accent/40 hover:shadow-[0_20px_50px_-20px_var(--glow-amber)]"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-border bg-background-alt">
        {project.cover_image_url ? (
          <Image
            src={project.cover_image_url}
            alt={project.title}
            fill
            sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-contain transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-background-alt font-display text-3xl text-muted-foreground">
            {project.title.slice(0, 1)}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-6">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-lg font-medium leading-snug">{project.title}</h3>
          {project.featured && <Badge variant="solid">Featured</Badge>}
        </div>
        <p className="line-clamp-2 text-sm text-muted-foreground">{project.summary}</p>
        <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
          {project.tech_stack.slice(0, 4).map((tech) => (
            <Badge key={tech} variant="outline">
              {tech}
            </Badge>
          ))}
        </div>
      </div>
    </Link>
  );
}
