"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DialogFooter } from "@/components/ui/dialog";
import { FileUpload } from "@/components/admin/file-upload";
import { FileUploadMulti } from "@/components/admin/file-upload-multi";
import { createProject, updateProject } from "@/lib/actions/projects";
import { slugify } from "@/lib/utils";
import type { Project, ProjectType } from "@/lib/types";

function SaveButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving…" : label}
    </Button>
  );
}

export function ProjectForm({ project, onSaved }: { project?: Project; onSaved: () => void }) {
  const action = project ? updateProject.bind(null, project.id) : createProject;
  const [state, formAction] = useActionState(action, { error: undefined });

  const [title, setTitle] = useState(project?.title ?? "");
  const [slug, setSlug] = useState(project?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(project));
  const [coverImage, setCoverImage] = useState(project?.cover_image_url ?? "");
  const [images, setImages] = useState<string[]>(project?.images ?? []);
  const [status, setStatus] = useState(project?.status ?? "published");
  const [projectType, setProjectType] = useState<ProjectType>(project?.project_type ?? "automation");
  const [featured, setFeatured] = useState(project?.featured ?? false);

  useEffect(() => {
    if (state.success) {
      toast.success(project ? "Project updated" : "Project added");
      onSaved();
    } else if (state.error) {
      toast.error(state.error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="cover_image_url" value={coverImage} />
      <input type="hidden" name="images" value={images.join(",")} />
      <input type="hidden" name="status" value={status} />
      <input type="hidden" name="project_type" value={projectType} />

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (!slugTouched) setSlug(slugify(e.target.value));
          }}
          required
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="slug">Slug</Label>
        <Input
          id="slug"
          name="slug"
          value={slug}
          onChange={(e) => {
            setSlugTouched(true);
            setSlug(slugify(e.target.value));
          }}
          required
        />
        <p className="text-xs text-muted-foreground">yoursite.com/projects/{slug || "…"}</p>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="summary">Short summary</Label>
        <Textarea
          id="summary"
          name="summary"
          rows={2}
          placeholder="One or two sentences for the project card"
          defaultValue={project?.summary}
          required
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="description">Full description (markdown supported)</Label>
        <Textarea id="description" name="description" rows={6} defaultValue={project?.description} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="project-type-select">Project type (which homepage section)</Label>
        <Select value={projectType} onValueChange={(v) => setProjectType(v as ProjectType)}>
          <SelectTrigger id="project-type-select">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="automation">AI Automation Project</SelectItem>
            <SelectItem value="webapp">Web App Project</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="category">Category</Label>
          <Input
            id="category"
            name="category"
            placeholder="e.g. Voice Agent, RAG, Dashboard, SaaS"
            defaultValue={project?.category}
            required
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="project_date">Date</Label>
          <Input id="project_date" name="project_date" type="date" defaultValue={project?.project_date ?? ""} />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="tech_stack">Tech stack (comma separated)</Label>
        <Input
          id="tech_stack"
          name="tech_stack"
          placeholder="Next.js, n8n, Supabase"
          defaultValue={project?.tech_stack.join(", ")}
        />
      </div>

      <div>
        <Label>Cover image</Label>
        <div className="mt-1.5">
          <FileUpload
            folder="projects"
            value={coverImage || null}
            onChange={(url) => setCoverImage(url ?? "")}
            label="Upload cover image"
          />
        </div>
      </div>

      <div>
        <Label>Screenshots</Label>
        <div className="mt-1.5">
          <FileUploadMulti folder="projects" value={images} onChange={setImages} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="demo_video_url">Demo video URL</Label>
          <Input
            id="demo_video_url"
            name="demo_video_url"
            type="url"
            placeholder="YouTube / Vimeo / Loom link"
            defaultValue={project?.demo_video_url ?? ""}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="docs_url">Docs URL</Label>
          <Input id="docs_url" name="docs_url" type="url" defaultValue={project?.docs_url ?? ""} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="github_url">GitHub URL</Label>
          <Input id="github_url" name="github_url" type="url" defaultValue={project?.github_url ?? ""} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="live_url">Live demo URL</Label>
          <Input id="live_url" name="live_url" type="url" defaultValue={project?.live_url ?? ""} />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-6">
        <div className="flex items-center gap-2">
          <Switch id="featured" name="featured" checked={featured} onCheckedChange={setFeatured} />
          <Label htmlFor="featured">Featured</Label>
        </div>

        <div className="flex items-center gap-2">
          <Label htmlFor="status-select" className="text-sm text-muted-foreground">
            Status
          </Label>
          <Select value={status} onValueChange={(v) => setStatus(v as "draft" | "published")}>
            <SelectTrigger id="status-select" className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {state.error && <p className="text-sm text-danger">{state.error}</p>}

      <DialogFooter>
        <SaveButton label={project ? "Save changes" : "Add project"} />
      </DialogFooter>
    </form>
  );
}
