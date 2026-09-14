"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { socialSchema } from "@/lib/validations";
import type { Social } from "@/lib/types";
import type { FormState } from "@/lib/actions/form-state";

function parseForm(formData: FormData) {
  return socialSchema.safeParse({
    platform: formData.get("platform"),
    url: formData.get("url"),
    icon: formData.get("icon"),
    visible: formData.get("visible") === "on",
  });
}

export async function createSocial(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = parseForm(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };

  const supabase = await createClient();
  const { count } = await supabase.from("socials").select("id", { count: "exact", head: true });
  const { error } = await supabase.from("socials").insert({ ...parsed.data, sort_order: count ?? 0 });

  if (error) return { error: error.message };
  revalidatePath("/");
  revalidatePath("/admin/about");
  return { error: undefined, success: true };
}

export async function updateSocial(id: string, _prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = parseForm(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };

  const supabase = await createClient();
  const { error } = await supabase.from("socials").update(parsed.data).eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/");
  revalidatePath("/admin/about");
  return { error: undefined, success: true };
}

export async function deleteSocial(id: string) {
  const supabase = await createClient();
  await supabase.from("socials").delete().eq("id", id);
  revalidatePath("/");
  revalidatePath("/admin/about");
}

async function reorder(orderedIds: string[]) {
  const supabase = await createClient();
  await Promise.all(
    orderedIds.map((id, index) =>
      supabase.from("socials").update({ sort_order: index }).eq("id", id)
    )
  );
  revalidatePath("/");
  revalidatePath("/admin/about");
}

export async function moveSocial(all: Social[], id: string, direction: "up" | "down") {
  const sorted = [...all].sort((a, b) => a.sort_order - b.sort_order);
  const index = sorted.findIndex((p) => p.id === id);
  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || swapWith < 0 || swapWith >= sorted.length) return;
  const ids = sorted.map((p) => p.id);
  [ids[index], ids[swapWith]] = [ids[swapWith], ids[index]];
  await reorder(ids);
}
