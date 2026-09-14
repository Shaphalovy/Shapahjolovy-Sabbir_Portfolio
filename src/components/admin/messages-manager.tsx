"use client";

import { Mail, MailOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ConfirmDeleteButton } from "@/components/admin/confirm-delete-button";
import { deleteMessage, markMessageRead } from "@/lib/actions/messages";
import { formatDate } from "@/lib/utils";
import type { ContactMessage } from "@/lib/types";

export function MessagesManager({ messages }: { messages: ContactMessage[] }) {
  if (messages.length === 0) {
    return <p className="text-sm text-muted-foreground">No messages yet.</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`glass flex flex-col gap-2 rounded-[var(--radius-md)] p-4 ${
            !msg.read ? "border-accent/40" : ""
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="font-medium">{msg.name}</span>
              <a href={`mailto:${msg.email}`} className="text-sm text-accent hover:underline">
                {msg.email}
              </a>
              {!msg.read && <Badge variant="solid">New</Badge>}
            </div>
            <span className="text-xs text-muted-foreground">
              {formatDate(msg.created_at, { month: "short", day: "numeric", year: "numeric" })}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">{msg.message}</p>
          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={() => markMessageRead(msg.id, !msg.read)}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
            >
              {msg.read ? <Mail className="h-3.5 w-3.5" /> : <MailOpen className="h-3.5 w-3.5" />}
              Mark as {msg.read ? "unread" : "read"}
            </button>
            <ConfirmDeleteButton itemLabel="this message" onConfirm={() => deleteMessage(msg.id)} />
          </div>
        </div>
      ))}
    </div>
  );
}
