"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { skillSchema } from "@/lib/validations";
import type { Skill } from "@/lib/types";
import type { FormState } from "@/lib/actions/form-state";

function parseForm(formData: FormData) {
  return skillSchema.safeParse({
    name: formData.get("name"),
    category: formData.get("category"),
    proficiency: formData.get("proficiency"),
    icon_url: formData.get("icon_url") || null,
  });
}

export async function createSkill(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = parseForm(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };

  const supabase = await createClient();
  const { count } = await supabase.from("skills").select("id", { count: "exact", head: true });
  const { error } = await supabase.from("skills").insert({ ...parsed.data, sort_order: count ?? 0 });

  if (error) return { error: error.message };
  revalidatePath("/");
  revalidatePath("/admin/skills");
  return { error: undefined, success: true };
}

export async function updateSkill(id: string, _prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = parseForm(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };

  const supabase = await createClient();
  const { error } = await supabase
    .from("skills")
    .update({ ...parsed.data, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/");
  revalidatePath("/admin/skills");
  return { error: undefined, success: true };
}

export async function deleteSkill(id: string) {
  const supabase = await createClient();
  await supabase.from("skills").delete().eq("id", id);
  revalidatePath("/");
  revalidatePath("/admin/skills");
}

async function reorder(orderedIds: string[]) {
  const supabase = await createClient();
  await Promise.all(
    orderedIds.map((id, index) =>
      supabase.from("skills").update({ sort_order: index }).eq("id", id)
    )
  );
  revalidatePath("/");
  revalidatePath("/admin/skills");
}

export async function moveSkill(all: Skill[], id: string, direction: "up" | "down") {
  const sorted = [...all].sort((a, b) => a.sort_order - b.sort_order);
  const index = sorted.findIndex((p) => p.id === id);
  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || swapWith < 0 || swapWith >= sorted.length) return;
  const ids = sorted.map((p) => p.id);
  [ids[index], ids[swapWith]] = [ids[swapWith], ids[index]];
  await reorder(ids);
}
