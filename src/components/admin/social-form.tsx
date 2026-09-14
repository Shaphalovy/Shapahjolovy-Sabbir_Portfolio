"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DialogFooter } from "@/components/ui/dialog";
import { createSocial, updateSocial } from "@/lib/actions/socials";
import { SOCIAL_ICON_OPTIONS } from "@/lib/social-icons";
import type { Social } from "@/lib/types";

function SaveButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving…" : label}
    </Button>
  );
}

export function SocialForm({
  social,
  onSaved,
}: {
  social?: Social;
  onSaved: () => void;
}) {
  const action = social ? updateSocial.bind(null, social.id) : createSocial;
  const [state, formAction] = useActionState(action, { error: undefined });

  useEffect(() => {
    if (state.success) {
      toast.success(social ? "Social link updated" : "Social link added");
      onSaved();
    } else if (state.error) {
      toast.error(state.error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="platform">Platform label</Label>
          <Input
            id="platform"
            name="platform"
            placeholder="GitHub"
            defaultValue={social?.platform}
            required
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="icon">Icon</Label>
          <Select name="icon" defaultValue={social?.icon ?? "globe"}>
            <SelectTrigger id="icon">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SOCIAL_ICON_OPTIONS.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="url">URL</Label>
        <Input
          id="url"
          name="url"
          type="url"
          placeholder="https://github.com/you"
          defaultValue={social?.url}
          required
        />
      </div>

      <div className="flex items-center gap-2">
        <Switch id="visible" name="visible" defaultChecked={social?.visible ?? true} />
        <Label htmlFor="visible">Visible on site</Label>
      </div>

      {state.error && <p className="text-sm text-danger">{state.error}</p>}

      <DialogFooter>
        <SaveButton label={social ? "Save changes" : "Add link"} />
      </DialogFooter>
    </form>
  );
}
