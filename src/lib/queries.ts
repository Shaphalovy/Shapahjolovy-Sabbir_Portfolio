import { createClient } from "@/lib/supabase/server";
import { PROFILE_ID } from "@/lib/types";
import type {
  BlogPost,
  Certification,
  ContactMessage,
  Experience,
  Profile,
  Project,
  SiteSection,
  Skill,
  Social,
} from "@/lib/types";

export async function getProfile(): Promise<Profile | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("profile").select("*").eq("id", PROFILE_ID).single();
  return data;
}

export async function getSocials(): Promise<Social[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("socials").select("*").order("sort_order");
  return data ?? [];
}

export async function getSections(): Promise<SiteSection[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("sections").select("*").order("sort_order");
  return data ?? [];
}

export async function getProjects(opts: { onlyPublished?: boolean } = {}): Promise<Project[]> {
  const supabase = await createClient();
  let query = supabase.from("projects").select("*").order("sort_order");
  if (opts.onlyPublished) query = query.eq("status", "published");
  const { data } = await query;
  return data ?? [];
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("projects").select("*").eq("slug", slug).single();
  return data;
}

export async function getExperience(): Promise<Experience[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("experience")
    .select("*")
    .order("sort_order", { ascending: true });
  return data ?? [];
}

export async function getSkills(): Promise<Skill[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("skills").select("*").order("sort_order");
  return data ?? [];
}

export async function getCertifications(): Promise<Certification[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("certifications").select("*").order("sort_order");
  return data ?? [];
}

export async function getBlogPosts(opts: { onlyPublished?: boolean } = {}): Promise<BlogPost[]> {
  const supabase = await createClient();
  let query = supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
  if (opts.onlyPublished) query = query.eq("published", true);
  const { data } = await query;
  return data ?? [];
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("blog_posts").select("*").eq("slug", slug).single();
  return data;
}

export async function getMessages(): Promise<ContactMessage[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("messages")
    .select("*")
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
