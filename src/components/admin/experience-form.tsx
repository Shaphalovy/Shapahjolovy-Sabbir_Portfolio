"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { DialogFooter } from "@/components/ui/dialog";
import { FileUpload } from "@/components/admin/file-upload";
import { createExperience, updateExperience } from "@/lib/actions/experience";
import type { Experience } from "@/lib/types";

function SaveButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving…" : label}
    </Button>
  );
}

export function ExperienceForm({
  experience,
  onSaved,
}: {
  experience?: Experience;
  onSaved: () => void;
}) {
  const action = experience ? updateExperience.bind(null, experience.id) : createExperience;
  const [state, formAction] = useActionState(action, { error: undefined });
  const [logoUrl, setLogoUrl] = useState(experience?.logo_url ?? "");
  const [isCurrent, setIsCurrent] = useState(experience?.is_current ?? false);

  useEffect(() => {
    if (state.success) {
      toast.success(experience ? "Experience updated" : "Experience added");
      onSaved();
    } else if (state.error) {
      toast.error(state.error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="logo_url" value={logoUrl} />

      <div>
        <Label>Company logo (optional)</Label>
        <div className="mt-1.5">
          <FileUpload
            folder="company-logos"
            value={logoUrl || null}
            onChange={(url) => setLogoUrl(url ?? "")}
            label="Upload logo"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="company">Company</Label>
          <Input id="company" name="company" defaultValue={experience?.company} required />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="role">Role / title</Label>
          <Input id="role" name="role" defaultValue={experience?.role} required />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="location">Location (optional)</Label>
          <Input id="location" name="location" defaultValue={experience?.location ?? ""} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="company_url">Company URL (optional)</Label>
          <Input
            id="company_url"
            name="company_url"
            type="url"
            defaultValue={experience?.company_url ?? ""}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="start_date">Start date</Label>
          <Input id="start_date" name="start_date" type="date" defaultValue={experience?.start_date} required />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="end_date">End date</Label>
          <Input
            id="end_date"
            name="end_date"
            type="date"
            defaultValue={experience?.end_date ?? ""}
            disabled={isCurrent}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Switch
          id="is_current"
          name="is_current"
          checked={isCurrent}
          onCheckedChange={setIsCurrent}
        />
        <Label htmlFor="is_current">I currently work here</Label>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="responsibilities">Responsibilities (one per line)</Label>
        <Textarea
          id="responsibilities"
          name="responsibilities"
          rows={4}
          defaultValue={experience?.responsibilities.join("\n")}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="achievements">Achievements (one per line)</Label>
        <Textarea
          id="achievements"
          name="achievements"
          rows={4}
          defaultValue={experience?.achievements.join("\n")}
        />
      </div>

      {state.error && <p className="text-sm text-danger">{state.error}</p>}

      <DialogFooter>
        <SaveButton label={experience ? "Save changes" : "Add experience"} />
      </DialogFooter>
    </form>
  );
}
