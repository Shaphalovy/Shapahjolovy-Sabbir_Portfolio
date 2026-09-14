"use client";

import * as React from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUpload } from "@/components/admin/file-upload";
import { updateResume } from "@/lib/actions/profile";
import { formatDate } from "@/lib/utils";
import type { Profile } from "@/lib/types";

export function ResumeManager({ profile }: { profile: Profile }) {
  const [saving, setSaving] = React.useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resume / CV</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <FileUpload
          folder="resume"
          value={profile.resume_url}
          accept="application/pdf"
          label="Upload résumé (PDF)"
          hint="Uploading a new file replaces the one visitors can currently download."
          onChange={async (url) => {
            setSaving(true);
            const res = await updateResume(url ?? "");
            setSaving(false);
            if (res?.error) toast.error(res.error);
            else toast.success(url ? "Résumé updated" : "Résumé removed");
          }}
        />
        {saving && <p className="text-xs text-muted-foreground">Saving…</p>}
        {profile.resume_updated_at && (
          <p className="text-xs text-muted-foreground">
            Last updated {formatDate(profile.resume_updated_at, {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
