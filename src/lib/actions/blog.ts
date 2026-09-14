"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { blogPostSchema } from "@/lib/validations";
import type { FormState } from "@/lib/actions/form-state";

function parseForm(formData: FormData) {
  return blogPostSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    excerpt: formData.get("excerpt"),
    content: formData.get("content"),
    cover_image_url: formData.get("cover_image_url") || null,
    published: formData.get("published") === "on",
  });
}

export async function createBlogPost(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = parseForm(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };

  const supabase = await createClient();
  const { error } = await supabase.from("blog_posts").insert({
    ...parsed.data,
    published_at: parsed.data.published ? new Date().toISOString() : null,
  });

  if (error) return { error: error.message };
  revalidatePath("/blog");
  revalidatePath("/admin/blog");
  return { error: undefined, success: true };
}

export async function updateBlogPost(id: string, _prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = parseForm(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("blog_posts")
    .select("published, published_at")
    .eq("id", id)
    .single();

  const justPublished = parsed.data.published && !existing?.published;

  const { error } = await supabase
    .from("blog_posts")
    .update({
      ...parsed.data,
      published_at: justPublished
        ? new Date().toISOString()
        : existing?.published_at ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/blog");
  revalidatePath(`/blog/${parsed.data.slug}`);
  revalidatePath("/admin/blog");
  return { error: undefined, success: true };
}

export async function deleteBlogPost(id: string) {
  const supabase = await createClient();
  await supabase.from("blog_posts").delete().eq("id", id);
  revalidatePath("/blog");
  revalidatePath("/admin/blog");
}
