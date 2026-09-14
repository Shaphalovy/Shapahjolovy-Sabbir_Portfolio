"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogFooter } from "@/components/ui/dialog";
import { FileUpload } from "@/components/admin/file-upload";
import { createSkill, updateSkill } from "@/lib/actions/skills";
import type { Skill } from "@/lib/types";

function SaveButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving…" : label}
    </Button>
  );
}

export function SkillForm({ skill, onSaved }: { skill?: Skill; onSaved: () => void }) {
  const action = skill ? updateSkill.bind(null, skill.id) : createSkill;
  const [state, formAction] = useActionState(action, { error: undefined });
  const [iconUrl, setIconUrl] = useState(skill?.icon_url ?? "");
  const [proficiency, setProficiency] = useState(skill?.proficiency ?? 80);

  useEffect(() => {
    if (state.success) {
      toast.success(skill ? "Skill updated" : "Skill added");
      onSaved();
    } else if (state.error) {
      toast.error(state.error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="icon_url" value={iconUrl} />

      <div>
        <Label>Icon (optional)</Label>
        <div className="mt-1.5">
          <FileUpload folder="skill-icons" value={iconUrl || null} onChange={(url) => setIconUrl(url ?? "")} label="Upload icon" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="name">Skill name</Label>
          <Input id="name" name="name" placeholder="n8n" defaultValue={skill?.name} required />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="category">Category</Label>
          <Input
            id="category"
            name="category"
            placeholder="Automation & AI"
            defaultValue={skill?.category}
            required
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="proficiency">Proficiency</Label>
          <span className="text-sm text-muted-foreground">{proficiency}%</span>
        </div>
        <input
          id="proficiency"
          name="proficiency"
          type="range"
          min={0}
          max={100}
          value={proficiency}
          onChange={(e) => setProficiency(Number(e.target.value))}
          className="h-2 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-[var(--accent)]"
        />
      </div>

      {state.error && <p className="text-sm text-danger">{state.error}</p>}

      <DialogFooter>
        <SaveButton label={skill ? "Save changes" : "Add skill"} />
      </DialogFooter>
    </form>
  );
}
