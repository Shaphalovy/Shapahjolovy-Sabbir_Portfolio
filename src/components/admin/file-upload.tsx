"use client";

import * as React from "react";
import Image from "next/image";
import { FileText, Loader2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  folder: string;
  value?: string | null;
  onChange: (url: string | null, fileType?: "image" | "pdf") => void;
  accept?: string;
  label?: string;
  hint?: string;
}

export function FileUpload({
  folder,
  value,
  onChange,
  accept = "image/*",
  label = "Upload file",
  hint,
}: FileUploadProps) {
  const [uploading, setUploading] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const isPdf = value?.toLowerCase().endsWith(".pdf");

  async function handleFile(file: File) {
    setUploading(true);
    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop();
      const path = `${folder}/${crypto.randomUUID()}.${ext}`;

      const { error } = await supabase.storage.from("media").upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      });
      if (error) throw error;

      const { data } = supabase.storage.from("media").getPublicUrl(path);
      onChange(data.publicUrl, file.type === "application/pdf" ? "pdf" : "image");
      toast.success("Uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />

      {value ? (
        <div className="relative flex items-center gap-3 rounded-[var(--radius-md)] border border-border-strong bg-white/[0.03] p-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-[var(--radius-sm)] bg-white/5">
            {isPdf ? (
              <FileText className="h-5 w-5 text-accent" />
            ) : (
              <Image src={value} alt="Preview" width={48} height={48} className="h-full w-full object-cover" />
            )}
          </div>
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 truncate text-sm text-muted-foreground hover:text-foreground"
          >
            {value.split("/").pop()}
          </a>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onChange(null)}
            aria-label="Remove file"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className={cn(
            "flex items-center justify-center gap-2 rounded-[var(--radius-md)] border border-dashed border-border-strong p-4 text-sm text-muted-foreground transition-colors hover:border-accent/50 hover:text-foreground",
            uploading && "pointer-events-none opacity-60"
          )}
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
          {uploading ? "Uploading…" : label}
        </button>
      )}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
