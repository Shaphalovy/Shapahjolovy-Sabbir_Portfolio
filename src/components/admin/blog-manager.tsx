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
import { BlogPostForm } from "@/components/admin/blog-post-form";
import { ConfirmDeleteButton } from "@/components/admin/confirm-delete-button";
import { deleteBlogPost } from "@/lib/actions/blog";
import { formatDate } from "@/lib/utils";
import type { BlogPost } from "@/lib/types";

export function BlogManager({ posts }: { posts: BlogPost[] }) {
  const [addOpen, setAddOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<BlogPost | null>(null);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button type="button">
              <Plus className="h-4 w-4" /> New post
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>New post</DialogTitle>
            </DialogHeader>
            <BlogPostForm onSaved={() => setAddOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {posts.length === 0 && <p className="text-sm text-muted-foreground">No posts yet.</p>}

      <div className="flex flex-col gap-3">
        {posts.map((post) => (
          <div key={post.id} className="glass flex items-center gap-3 rounded-[var(--radius-md)] p-4">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="truncate font-medium">{post.title}</p>
                <Badge variant={post.published ? "solid" : "outline"}>
                  {post.published ? "Published" : "Draft"}
                </Badge>
              </div>
              <p className="truncate text-sm text-muted-foreground">
                {post.published_at
                  ? formatDate(post.published_at, { month: "short", day: "numeric", year: "numeric" })
                  : "Not published yet"}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <Dialog
                open={editing?.id === post.id}
                onOpenChange={(open) => setEditing(open ? post : null)}
              >
                <DialogTrigger asChild>
                  <Button type="button" variant="ghost" size="sm">
                    Edit
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-xl">
                  <DialogHeader>
                    <DialogTitle>Edit post</DialogTitle>
                  </DialogHeader>
                  <BlogPostForm post={post} onSaved={() => setEditing(null)} />
                </DialogContent>
              </Dialog>
              <ConfirmDeleteButton itemLabel={post.title} onConfirm={() => deleteBlogPost(post.id)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
