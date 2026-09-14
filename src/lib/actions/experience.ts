"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { experienceSchema } from "@/lib/validations";
import type { Experience } from "@/lib/types";
import type { FormState } from "@/lib/actions/form-state";

function parseForm(formData: FormData) {
  return experienceSchema.safeParse({
    company: formData.get("company"),
    role: formData.get("role"),
    location: formData.get("location") || null,
    company_url: formData.get("company_url") || "",
    logo_url: formData.get("logo_url") || null,
    start_date: formData.get("start_date"),
    end_date: formData.get("end_date") || null,
    is_current: formData.get("is_current") === "on",
    responsibilities: String(formData.get("responsibilities") || "")
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean),
    achievements: String(formData.get("achievements") || "")
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean),
  });
}

export async function createExperience(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = parseForm(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };

  const supabase = await createClient();
  const { count } = await supabase
    .from("experience")
    .select("id", { count: "exact", head: true });

  const { error } = await supabase
    .from("experience")
    .insert({ ...parsed.data, end_date: parsed.data.is_current ? null : parsed.data.end_date, sort_order: count ?? 0 });

  if (error) return { error: error.message };
  revalidatePath("/");
  revalidatePath("/admin/experience");
  return { error: undefined, success: true };
}

export async function updateExperience(
  id: string,
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const parsed = parseForm(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };

  const supabase = await createClient();
  const { error } = await supabase
    .from("experience")
    .update({
      ...parsed.data,
      end_date: parsed.data.is_current ? null : parsed.data.end_date,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/");
  revalidatePath("/admin/experience");
  return { error: undefined, success: true };
}

export async function deleteExperience(id: string) {
  const supabase = await createClient();
  await supabase.from("experience").delete().eq("id", id);
  revalidatePath("/");
  revalidatePath("/admin/experience");
}

async function reorder(orderedIds: string[]) {
  const supabase = await createClient();
  await Promise.all(
    orderedIds.map((id, index) =>
      supabase.from("experience").update({ sort_order: index }).eq("id", id)
    )
  );
  revalidatePath("/");
  revalidatePath("/admin/experience");
}

export async function moveExperience(all: Experience[], id: string, direction: "up" | "down") {
  const sorted = [...all].sort((a, b) => a.sort_order - b.sort_order);
  const index = sorted.findIndex((p) => p.id === id);
  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || swapWith < 0 || swapWith >= sorted.length) return;
  const ids = sorted.map((p) => p.id);
  [ids[index], ids[swapWith]] = [ids[swapWith], ids[index]];
  await reorder(ids);
}
