"use client";

import * as React from "react";
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
import { ExperienceForm } from "@/components/admin/experience-form";
import { ConfirmDeleteButton } from "@/components/admin/confirm-delete-button";
import { ReorderButtons } from "@/components/admin/reorder-buttons";
import { deleteExperience, moveExperience } from "@/lib/actions/experience";
import { formatDateRange } from "@/lib/utils";
import type { Experience } from "@/lib/types";

export function ExperienceManager({ experience }: { experience: Experience[] }) {
  const [addOpen, setAddOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Experience | null>(null);
  const sorted = [...experience].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button type="button">
              <Plus className="h-4 w-4" /> Add role
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add work experience</DialogTitle>
            </DialogHeader>
            <ExperienceForm onSaved={() => setAddOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {sorted.length === 0 && <p className="text-sm text-muted-foreground">No experience yet.</p>}

      <div className="flex flex-col gap-3">
        {sorted.map((role, i) => (
          <div key={role.id} className="glass flex items-start gap-3 rounded-[var(--radius-md)] p-4">
            <ReorderButtons
              disableUp={i === 0}
              disableDown={i === sorted.length - 1}
              onMoveUp={() => moveExperience(sorted, role.id, "up")}
              onMoveDown={() => moveExperience(sorted, role.id, "down")}
            />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-medium">{role.role}</p>
                {role.is_current && <Badge>Current</Badge>}
              </div>
              <p className="text-sm text-muted-foreground">
                {role.company} · {formatDateRange(role.start_date, role.end_date, role.is_current)}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <Dialog
                open={editing?.id === role.id}
                onOpenChange={(open) => setEditing(open ? role : null)}
              >
                <DialogTrigger asChild>
                  <Button type="button" variant="ghost" size="sm">
                    Edit
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-xl">
                  <DialogHeader>
                    <DialogTitle>Edit experience</DialogTitle>
                  </DialogHeader>
                  <ExperienceForm experience={role} onSaved={() => setEditing(null)} />
                </DialogContent>
              </Dialog>
              <ConfirmDeleteButton itemLabel={`${role.role} at ${role.company}`} onConfirm={() => deleteExperience(role.id)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
