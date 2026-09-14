"use client";

import * as React from "react";
import { FileText, Plus } from "lucide-react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CertificationForm } from "@/components/admin/certification-form";
import { ConfirmDeleteButton } from "@/components/admin/confirm-delete-button";
import { ReorderButtons } from "@/components/admin/reorder-buttons";
import { deleteCertification, moveCertification } from "@/lib/actions/certifications";
import { formatDate } from "@/lib/utils";
import type { Certification } from "@/lib/types";

export function CertificationsManager({ certifications }: { certifications: Certification[] }) {
  const [addOpen, setAddOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Certification | null>(null);
  const sorted = [...certifications].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button type="button">
              <Plus className="h-4 w-4" /> Add certification
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add certification</DialogTitle>
            </DialogHeader>
            <CertificationForm onSaved={() => setAddOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {sorted.length === 0 && (
        <p className="text-sm text-muted-foreground">No certifications yet.</p>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {sorted.map((cert, i) => (
          <div key={cert.id} className="glass flex gap-3 rounded-[var(--radius-md)] p-4">
            <ReorderButtons
              disableUp={i === 0}
              disableDown={i === sorted.length - 1}
              onMoveUp={() => moveCertification(sorted, cert.id, "up")}
              onMoveDown={() => moveCertification(sorted, cert.id, "down")}
            />
            <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-[var(--radius-sm)] bg-white/5">
              {cert.file_url && cert.file_type === "image" ? (
                <Image src={cert.file_url} alt="" width={44} height={44} className="h-full w-full object-cover" />
              ) : (
                <FileText className="h-5 w-5 text-accent" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{cert.title}</p>
              <p className="truncate text-xs text-muted-foreground">{cert.issuing_organization}</p>
              {cert.issue_date && (
                <p className="text-xs text-muted-foreground">{formatDate(cert.issue_date)}</p>
              )}
            </div>
            <div className="flex shrink-0 items-start gap-1">
              <Dialog
                open={editing?.id === cert.id}
                onOpenChange={(open) => setEditing(open ? cert : null)}
              >
                <DialogTrigger asChild>
                  <Button type="button" variant="ghost" size="sm">
                    Edit
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit certification</DialogTitle>
                  </DialogHeader>
                  <CertificationForm certification={cert} onSaved={() => setEditing(null)} />
                </DialogContent>
              </Dialog>
              <ConfirmDeleteButton itemLabel={cert.title} onConfirm={() => deleteCertification(cert.id)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
