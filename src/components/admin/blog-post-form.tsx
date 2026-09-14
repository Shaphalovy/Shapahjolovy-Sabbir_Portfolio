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
import { createBlogPost, updateBlogPost } from "@/lib/actions/blog";
import { slugify } from "@/lib/utils";
import type { BlogPost } from "@/lib/types";

function SaveButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving…" : label}
    </Button>
  );
}

export function BlogPostForm({ post, onSaved }: { post?: BlogPost; onSaved: () => void }) {
  const action = post ? updateBlogPost.bind(null, post.id) : createBlogPost;
  const [state, formAction] = useActionState(action, { error: undefined });

  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(post));
  const [coverImage, setCoverImage] = useState(post?.cover_image_url ?? "");
  const [published, setPublished] = useState(post?.published ?? false);

  useEffect(() => {
    if (state.success) {
      toast.success(post ? "Post updated" : "Post created");
      onSaved();
    } else if (state.error) {
      toast.error(state.error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="cover_image_url" value={coverImage} />

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
        <p className="text-xs text-muted-foreground">yoursite.com/blog/{slug || "…"}</p>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="excerpt">Excerpt</Label>
        <Textarea id="excerpt" name="excerpt" rows={2} defaultValue={post?.excerpt} required />
      </div>

      <div>
        <Label>Cover image</Label>
        <div className="mt-1.5">
          <FileUpload
            folder="blog"
            value={coverImage || null}
            onChange={(url) => setCoverImage(url ?? "")}
            label="Upload cover image"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="content">Content (markdown supported)</Label>
        <Textarea id="content" name="content" rows={10} defaultValue={post?.content} required />
      </div>

      <div className="flex items-center gap-2">
        <Switch id="published" name="published" checked={published} onCheckedChange={setPublished} />
        <Label htmlFor="published">Published</Label>
      </div>

      {state.error && <p className="text-sm text-danger">{state.error}</p>}

      <DialogFooter>
        <SaveButton label={post ? "Save changes" : "Create post"} />
      </DialogFooter>
    </form>
  );
}
