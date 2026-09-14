"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { contactMessageSchema } from "@/lib/validations";
import type { FormState } from "@/lib/actions/form-state";

export async function sendMessage(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = contactMessageSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  });

  if (!parsed.success) return { error: parsed.error.issues[0]?.message };

  const supabase = await createClient();
  const { error } = await supabase.from("messages").insert(parsed.data);

  if (error) return { error: "Something went wrong sending your message. Please try again." };
  return { error: undefined, success: true };
}

export async function markMessageRead(id: string, read: boolean) {
  const supabase = await createClient();
  await supabase.from("messages").update({ read }).eq("id", id);
  revalidatePath("/admin/messages");
}

export async function deleteMessage(id: string) {
  const supabase = await createClient();
  await supabase.from("messages").delete().eq("id", id);
  revalidatePath("/admin/messages");
}
