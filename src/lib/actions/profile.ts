"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { profileSchema } from "@/lib/validations";
import { PROFILE_ID } from "@/lib/types";
import type { FormState } from "@/lib/actions/form-state";

export async function updateProfile(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = profileSchema.safeParse({
    full_name: formData.get("full_name"),
    headline: formData.get("headline"),
    bio: formData.get("bio"),
    avatar_url: formData.get("avatar_url") || null,
    location: formData.get("location") || null,
    years_experience: formData.get("years_experience") || null,
    email: formData.get("email") || "",
    phone: formData.get("phone") || null,
    meta_title: formData.get("meta_title") || null,
    meta_description: formData.get("meta_description") || null,
  });

  if (!parsed.success) return { error: parsed.error.issues[0]?.message };

  const supabase = await createClient();
  const { error } = await supabase
    .from("profile")
    .update({ ...parsed.data, updated_at: new Date().toISOString() })
    .eq("id", PROFILE_ID);

  if (error) return { error: error.message };
  revalidatePath("/");
  revalidatePath("/admin/about");
  return { error: undefined, success: true };
}

export async function updateResume(resumeUrl: string): Promise<FormState> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("profile")
    .update({ resume_url: resumeUrl, resume_updated_at: new Date().toISOString() })
    .eq("id", PROFILE_ID);

  if (error) return { error: error.message };
  revalidatePath("/");
  revalidatePath("/admin/resume");
  return { error: undefined, success: true };
}
