"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogFooter } from "@/components/ui/dialog";
import { FileUpload } from "@/components/admin/file-upload";
import { createCertification, updateCertification } from "@/lib/actions/certifications";
import type { Certification, CertificationFileType } from "@/lib/types";

function SaveButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving…" : label}
    </Button>
  );
}

export function CertificationForm({
  certification,
  onSaved,
}: {
  certification?: Certification;
  onSaved: () => void;
}) {
  const action = certification
    ? updateCertification.bind(null, certification.id)
    : createCertification;
  const [state, formAction] = useActionState(action, { error: undefined });
  const [fileUrl, setFileUrl] = useState(certification?.file_url ?? "");
  const [fileType, setFileType] = useState<CertificationFileType | "">(
    certification?.file_type ?? ""
  );

  useEffect(() => {
    if (state.success) {
      toast.success(certification ? "Certification updated" : "Certification added");
      onSaved();
    } else if (state.error) {
      toast.error(state.error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="file_url" value={fileUrl} />
      <input type="hidden" name="file_type" value={fileType} />

      <div>
        <Label>Certificate file (image or PDF)</Label>
        <div className="mt-1.5">
          <FileUpload
            folder="certifications"
            value={fileUrl || null}
            accept="image/*,application/pdf"
            label="Upload certificate"
            onChange={(url, type) => {
              setFileUrl(url ?? "");
              setFileType(type ?? "");
            }}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="title">Certification title</Label>
        <Input id="title" name="title" defaultValue={certification?.title} required />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="issuing_organization">Issuing organization</Label>
        <Input
          id="issuing_organization"
          name="issuing_organization"
          defaultValue={certification?.issuing_organization}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="issue_date">Issue date</Label>
          <Input
            id="issue_date"
            name="issue_date"
            type="date"
            defaultValue={certification?.issue_date ?? ""}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="expiry_date">Expiry date (optional)</Label>
          <Input
            id="expiry_date"
            name="expiry_date"
            type="date"
            defaultValue={certification?.expiry_date ?? ""}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="credential_url">Credential URL (optional)</Label>
        <Input
          id="credential_url"
          name="credential_url"
          type="url"
          placeholder="https://…"
          defaultValue={certification?.credential_url ?? ""}
        />
      </div>

      {state.error && <p className="text-sm text-danger">{state.error}</p>}

      <DialogFooter>
        <SaveButton label={certification ? "Save changes" : "Add certification"} />
      </DialogFooter>
    </form>
  );
}
