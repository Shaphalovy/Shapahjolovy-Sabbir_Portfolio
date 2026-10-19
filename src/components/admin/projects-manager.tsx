"use client";

import * as React from "react";
import Image from "next/image";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProjectForm } from "@/components/admin/project-form";
import { ConfirmDeleteButton } from "@/components/admin/confirm-delete-button";
import { ReorderButtons } from "@/components/admin/reorder-buttons";
import { deleteProject, moveProject } from "@/lib/actions/projects";
import type { Project } from "@/lib/types";

export function ProjectsManager({ projects }: { projects: Project[] }) {
  const [addOpen, setAddOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Project | null>(null);
  const sorted = [...projects].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button type="button">
              <Plus className="h-4 w-4" /> Add project
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>Add project</DialogTitle>
            </DialogHeader>
            <ProjectForm onSaved={() => setAddOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {sorted.length === 0 && <p className="text-sm text-muted-foreground">No projects yet.</p>}

      <div className="flex flex-col gap-3">
        {sorted.map((project, i) => (
          <div key={project.id} className="glass flex items-center gap-3 rounded-[var(--radius-md)] p-3">
            <ReorderButtons
              disableUp={i === 0}
              disableDown={i === sorted.length - 1}
              onMoveUp={() => moveProject(sorted, project.id, "up")}
              onMoveDown={() => moveProject(sorted, project.id, "down")}
            />
            <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-[var(--radius-sm)] bg-white/5">
              {project.cover_image_url && (
                <Image src={project.cover_image_url} alt="" fill className="object-cover" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="truncate font-medium">{project.title}</p>
                <Badge variant="outline">
                  {project.project_type === "webapp" ? "Web App" : "Automation"}
                </Badge>
                {project.featured && <Badge variant="solid">Featured</Badge>}
                {project.status === "draft" && <Badge variant="outline">Draft</Badge>}
              </div>
              <p className="truncate text-sm text-muted-foreground">
                {project.category} · {project.tech_stack.slice(0, 3).join(", ")}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <Dialog
                open={editing?.id === project.id}
                onOpenChange={(open) => setEditing(open ? project : null)}
              >
                <DialogTrigger asChild>
                  <Button type="button" variant="ghost" size="sm">
                    Edit
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-xl">
                  <DialogHeader>
                    <DialogTitle>Edit project</DialogTitle>
                  </DialogHeader>
                  <ProjectForm project={project} onSaved={() => setEditing(null)} />
                </DialogContent>
              </Dialog>
              <ConfirmDeleteButton itemLabel={project.title} onConfirm={() => deleteProject(project.id)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
