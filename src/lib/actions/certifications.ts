"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { certificationSchema } from "@/lib/validations";
import type { Certification } from "@/lib/types";
import type { FormState } from "@/lib/actions/form-state";

function parseForm(formData: FormData) {
  return certificationSchema.safeParse({
    title: formData.get("title"),
    issuing_organization: formData.get("issuing_organization"),
    issue_date: formData.get("issue_date") || null,
    expiry_date: formData.get("expiry_date") || null,
    credential_url: formData.get("credential_url") || "",
    file_url: formData.get("file_url") || null,
    file_type: formData.get("file_type") || null,
  });
}

export async function createCertification(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = parseForm(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };

  const supabase = await createClient();
  const { count } = await supabase
    .from("certifications")
    .select("id", { count: "exact", head: true });
  const { error } = await supabase
    .from("certifications")
    .insert({ ...parsed.data, sort_order: count ?? 0 });

  if (error) return { error: error.message };
  revalidatePath("/");
  revalidatePath("/admin/certifications");
  return { error: undefined, success: true };
}

export async function updateCertification(
  id: string,
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const parsed = parseForm(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };

  const supabase = await createClient();
  const { error } = await supabase
    .from("certifications")
    .update({ ...parsed.data, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/");
  revalidatePath("/admin/certifications");
  return { error: undefined, success: true };
}

export async function deleteCertification(id: string) {
  const supabase = await createClient();
  await supabase.from("certifications").delete().eq("id", id);
  revalidatePath("/");
  revalidatePath("/admin/certifications");
}

async function reorder(orderedIds: string[]) {
  const supabase = await createClient();
  await Promise.all(
    orderedIds.map((id, index) =>
      supabase.from("certifications").update({ sort_order: index }).eq("id", id)
    )
  );
  revalidatePath("/");
  revalidatePath("/admin/certifications");
}

export async function moveCertification(
  all: Certification[],
  id: string,
  direction: "up" | "down"
) {
  const sorted = [...all].sort((a, b) => a.sort_order - b.sort_order);
  const index = sorted.findIndex((p) => p.id === id);
  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || swapWith < 0 || swapWith >= sorted.length) return;
  const ids = sorted.map((p) => p.id);
  [ids[index], ids[swapWith]] = [ids[swapWith], ids[index]];
  await reorder(ids);
}
