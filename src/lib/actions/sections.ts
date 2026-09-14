"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { SiteSection } from "@/lib/types";

export async function toggleSectionVisibility(id: string, visible: boolean) {
  const supabase = await createClient();
  await supabase.from("sections").update({ visible }).eq("id", id);
  revalidatePath("/");
  revalidatePath("/admin/sections");
}

async function reorder(orderedIds: string[]) {
  const supabase = await createClient();
  await Promise.all(
    orderedIds.map((id, index) =>
      supabase.from("sections").update({ sort_order: index }).eq("id", id)
    )
  );
  revalidatePath("/");
  revalidatePath("/admin/sections");
}

export async function moveSection(all: SiteSection[], id: string, direction: "up" | "down") {
  const sorted = [...all].sort((a, b) => a.sort_order - b.sort_order);
  const index = sorted.findIndex((s) => s.id === id);
  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || swapWith < 0 || swapWith >= sorted.length) return;
  const ids = sorted.map((s) => s.id);
  [ids[index], ids[swapWith]] = [ids[swapWith], ids[index]];
  await reorder(ids);
}
