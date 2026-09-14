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
import { SocialForm } from "@/components/admin/social-form";
import { ConfirmDeleteButton } from "@/components/admin/confirm-delete-button";
import { ReorderButtons } from "@/components/admin/reorder-buttons";
import { deleteSocial, moveSocial } from "@/lib/actions/socials";
import { getSocialIcon } from "@/lib/social-icons";
import type { Social } from "@/lib/types";

export function SocialsManager({ socials }: { socials: Social[] }) {
  const [addOpen, setAddOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Social | null>(null);
  const sorted = [...socials].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">Social links</p>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button type="button" variant="outline" size="sm">
              <Plus className="h-3.5 w-3.5" /> Add link
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add social link</DialogTitle>
            </DialogHeader>
            <SocialForm onSaved={() => setAddOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {sorted.length === 0 && (
        <p className="text-sm text-muted-foreground">No social links yet.</p>
      )}

      <div className="flex flex-col gap-2">
        {sorted.map((social, i) => {
          const Icon = getSocialIcon(social.icon);
          return (
            <div
              key={social.id}
              className="flex items-center gap-3 rounded-[var(--radius-md)] border border-border-strong p-3"
            >
              <ReorderButtons
                disableUp={i === 0}
                disableDown={i === sorted.length - 1}
                onMoveUp={() => moveSocial(sorted, social.id, "up")}
                onMoveDown={() => moveSocial(sorted, social.id, "down")}
              />
              <Icon className="h-4 w-4 shrink-0 text-accent" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{social.platform}</p>
                <p className="truncate text-xs text-muted-foreground">{social.url}</p>
              </div>
              {!social.visible && <Badge variant="outline">Hidden</Badge>}
              <Dialog
                open={editing?.id === social.id}
                onOpenChange={(open) => setEditing(open ? social : null)}
              >
                <DialogTrigger asChild>
                  <Button type="button" variant="ghost" size="sm">
                    Edit
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit social link</DialogTitle>
                  </DialogHeader>
                  <SocialForm social={social} onSaved={() => setEditing(null)} />
                </DialogContent>
              </Dialog>
              <ConfirmDeleteButton
                itemLabel={social.platform}
                onConfirm={() => deleteSocial(social.id)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
