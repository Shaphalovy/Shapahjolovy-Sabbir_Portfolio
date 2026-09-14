"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileUpload } from "@/components/admin/file-upload";
import { updateProfile } from "@/lib/actions/profile";
import type { Profile } from "@/lib/types";

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving…" : "Save changes"}
    </Button>
  );
}

export function ProfileForm({ profile }: { profile: Profile }) {
  const [state, formAction] = useActionState(updateProfile, { error: undefined });
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url ?? "");

  useEffect(() => {
    if (state.success) toast.success("Profile updated");
    else if (state.error) toast.error(state.error);
  }, [state]);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <input type="hidden" name="avatar_url" value={avatarUrl} />

      <div>
        <Label>Avatar / headshot</Label>
        <div className="mt-1.5">
          <FileUpload
            folder="avatar"
            value={avatarUrl || null}
            onChange={(url) => setAvatarUrl(url ?? "")}
            label="Upload photo"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="full_name">Full name</Label>
          <Input id="full_name" name="full_name" defaultValue={profile.full_name} required />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="location">Location</Label>
          <Input id="location" name="location" defaultValue={profile.location ?? ""} />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="headline">Headline</Label>
        <Input
          id="headline"
          name="headline"
          placeholder="e.g. AI Automation Engineer & Founder"
          defaultValue={profile.headline}
          required
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="bio">About me</Label>
        <Textarea id="bio" name="bio" rows={7} defaultValue={profile.bio} required />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Contact email</Label>
          <Input id="email" name="email" type="email" defaultValue={profile.email ?? ""} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="phone">Phone (optional)</Label>
          <Input id="phone" name="phone" defaultValue={profile.phone ?? ""} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="years_experience">Years of experience</Label>
          <Input
            id="years_experience"
            name="years_experience"
            type="number"
            min={0}
            defaultValue={profile.years_experience ?? ""}
          />
        </div>
      </div>

      <div className="rounded-[var(--radius-md)] border border-border-strong p-4">
        <p className="mb-3 text-sm font-medium">SEO</p>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="meta_title">Meta title</Label>
            <Input id="meta_title" name="meta_title" defaultValue={profile.meta_title ?? ""} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="meta_description">Meta description</Label>
            <Textarea
              id="meta_description"
              name="meta_description"
              rows={2}
              defaultValue={profile.meta_description ?? ""}
            />
          </div>
        </div>
      </div>

      <div>
        <SaveButton />
      </div>
    </form>
  );
}
