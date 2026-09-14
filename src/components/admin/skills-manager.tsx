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
import { SkillForm } from "@/components/admin/skill-form";
import { ConfirmDeleteButton } from "@/components/admin/confirm-delete-button";
import { ReorderButtons } from "@/components/admin/reorder-buttons";
import { deleteSkill, moveSkill } from "@/lib/actions/skills";
import type { Skill } from "@/lib/types";

export function SkillsManager({ skills }: { skills: Skill[] }) {
  const [addOpen, setAddOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Skill | null>(null);
  const sorted = [...skills].sort((a, b) => a.sort_order - b.sort_order);

  const grouped = sorted.reduce<Record<string, Skill[]>>((acc, s) => {
    (acc[s.category] ??= []).push(s);
    return acc;
  }, {});

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-end">
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button type="button">
              <Plus className="h-4 w-4" /> Add skill
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add skill</DialogTitle>
            </DialogHeader>
            <SkillForm onSaved={() => setAddOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {sorted.length === 0 && <p className="text-sm text-muted-foreground">No skills yet.</p>}

      {Object.entries(grouped).map(([category, items]) => (
        <div key={category} className="glass rounded-[var(--radius-lg)] p-5">
          <p className="mb-3 text-sm font-medium text-accent">{category}</p>
          <div className="flex flex-col gap-2">
            {items.map((skill) => {
              const globalIndex = sorted.findIndex((s) => s.id === skill.id);
              return (
                <div
                  key={skill.id}
                  className="flex items-center gap-3 rounded-[var(--radius-sm)] border border-border-strong p-2.5"
                >
                  <ReorderButtons
                    disableUp={globalIndex === 0}
                    disableDown={globalIndex === sorted.length - 1}
                    onMoveUp={() => moveSkill(sorted, skill.id, "up")}
                    onMoveDown={() => moveSkill(sorted, skill.id, "down")}
                  />
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded bg-white/5">
                    {skill.icon_url ? (
                      <Image src={skill.icon_url} alt="" width={18} height={18} className="object-contain" />
                    ) : (
                      <span className="text-xs text-muted-foreground">{skill.name[0]}</span>
                    )}
                  </div>
                  <span className="flex-1 text-sm">{skill.name}</span>
                  <span className="text-xs text-muted-foreground">{skill.proficiency}%</span>
                  <Dialog
                    open={editing?.id === skill.id}
                    onOpenChange={(open) => setEditing(open ? skill : null)}
                  >
                    <DialogTrigger asChild>
                      <Button type="button" variant="ghost" size="sm">
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit skill</DialogTitle>
                      </DialogHeader>
                      <SkillForm skill={skill} onSaved={() => setEditing(null)} />
                    </DialogContent>
                  </Dialog>
                  <ConfirmDeleteButton itemLabel={skill.name} onConfirm={() => deleteSkill(skill.id)} />
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
