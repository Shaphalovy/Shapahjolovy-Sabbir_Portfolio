"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { projectSchema } from "@/lib/validations";
import type { Project } from "@/lib/types";
import type { FormState } from "@/lib/actions/form-state";

function parseProjectForm(formData: FormData) {
  return projectSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    summary: formData.get("summary"),
    description: formData.get("description"),
    category: formData.get("category"),
    tech_stack: String(formData.get("tech_stack") || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
    cover_image_url: formData.get("cover_image_url") || null,
    images: String(formData.get("images") || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
    demo_video_url: formData.get("demo_video_url") || "",
    docs_url: formData.get("docs_url") || "",
    github_url: formData.get("github_url") || "",
    live_url: formData.get("live_url") || "",
    featured: formData.get("featured") === "on",
    status: formData.get("status") || "published",
    project_date: formData.get("project_date") || null,
  });
}

export async function createProject(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = parseProjectForm(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };

  const supabase = await createClient();
  const { count } = await supabase
    .from("projects")
    .select("id", { count: "exact", head: true });

  const { error } = await supabase
    .from("projects")
    .insert({ ...parsed.data, sort_order: count ?? 0 });

  if (error) return { error: error.message };

  revalidatePath("/");
  revalidatePath("/admin/projects");
  return { error: undefined, success: true };
}

export async function updateProject(
  id: string,
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const parsed = parseProjectForm(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };

  const supabase = await createClient();
  const { error } = await supabase
    .from("projects")
    .update({ ...parsed.data, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/");
  revalidatePath("/admin/projects");
  revalidatePath(`/projects/${parsed.data.slug}`);
  return { error: undefined, success: true };
}

export async function deleteProject(id: string) {
  const supabase = await createClient();
  await supabase.from("projects").delete().eq("id", id);
  revalidatePath("/");
  revalidatePath("/admin/projects");
}

export async function reorderProjects(orderedIds: string[]) {
  const supabase = await createClient();
  await Promise.all(
    orderedIds.map((id, index) =>
      supabase.from("projects").update({ sort_order: index }).eq("id", id)
    )
  );
  revalidatePath("/");
  revalidatePath("/admin/projects");
}

export async function moveProject(all: Project[], id: string, direction: "up" | "down") {
  const sorted = [...all].sort((a, b) => a.sort_order - b.sort_order);
  const index = sorted.findIndex((p) => p.id === id);
  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || swapWith < 0 || swapWith >= sorted.length) return;

  const ids = sorted.map((p) => p.id);
  [ids[index], ids[swapWith]] = [ids[swapWith], ids[index]];
  await reorderProjects(ids);
}
