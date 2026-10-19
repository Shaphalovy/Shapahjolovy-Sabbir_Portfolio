import { z } from "zod";

export const profileSchema = z.object({
  full_name: z.string().min(1, "Required"),
  headline: z.string().min(1, "Required"),
  bio: z.string().min(1, "Required"),
  avatar_url: z.string().url().or(z.literal("")).nullable().optional(),
  location: z.string().optional().nullable(),
  years_experience: z.coerce.number().int().min(0).max(80).optional().nullable(),
  email: z.string().email("Enter a valid email").optional().or(z.literal("")),
  phone: z.string().optional().nullable(),
  meta_title: z.string().optional().nullable(),
  meta_description: z.string().optional().nullable(),
});
export type ProfileInput = z.infer<typeof profileSchema>;

export const socialSchema = z.object({
  platform: z.string().min(1, "Required"),
  url: z.string().url("Enter a valid URL"),
  icon: z.string().min(1, "Required"),
  visible: z.boolean().default(true),
});
export type SocialInput = z.infer<typeof socialSchema>;

export const projectSchema = z.object({
  title: z.string().min(1, "Required"),
  slug: z.string().min(1, "Required"),
  summary: z.string().min(1, "Required"),
  description: z.string().optional().default(""),
  category: z.string().min(1, "Required"),
  project_type: z.enum(["automation", "webapp"]).default("automation"),
  tech_stack: z.array(z.string()).default([]),
  cover_image_url: z.string().optional().nullable(),
  images: z.array(z.string()).default([]),
  demo_video_url: z.string().url().or(z.literal("")).optional().nullable(),
  docs_url: z.string().url().or(z.literal("")).optional().nullable(),
  github_url: z.string().url().or(z.literal("")).optional().nullable(),
  live_url: z.string().url().or(z.literal("")).optional().nullable(),
  featured: z.boolean().default(false),
  status: z.enum(["draft", "published"]).default("published"),
  project_date: z.string().optional().nullable(),
});
export type ProjectInput = z.infer<typeof projectSchema>;

export const experienceSchema = z.object({
  company: z.string().min(1, "Required"),
  role: z.string().min(1, "Required"),
  location: z.string().optional().nullable(),
  company_url: z.string().url().or(z.literal("")).optional().nullable(),
  logo_url: z.string().optional().nullable(),
  start_date: z.string().min(1, "Required"),
  end_date: z.string().optional().nullable(),
  is_current: z.boolean().default(false),
  responsibilities: z.array(z.string()).default([]),
  achievements: z.array(z.string()).default([]),
});
export type ExperienceInput = z.infer<typeof experienceSchema>;

export const skillSchema = z.object({
  name: z.string().min(1, "Required"),
  category: z.string().min(1, "Required"),
  proficiency: z.coerce.number().int().min(0).max(100).default(80),
  icon_url: z.string().optional().nullable(),
});
export type SkillInput = z.infer<typeof skillSchema>;

export const certificationSchema = z.object({
  title: z.string().min(1, "Required"),
  issuing_organization: z.string().min(1, "Required"),
  issue_date: z.string().optional().nullable(),
  expiry_date: z.string().optional().nullable(),
  credential_url: z.string().url().or(z.literal("")).optional().nullable(),
  file_url: z.string().optional().nullable(),
  file_type: z.enum(["image", "pdf"]).optional().nullable(),
});
export type CertificationInput = z.infer<typeof certificationSchema>;

export const blogPostSchema = z.object({
  title: z.string().min(1, "Required"),
  slug: z.string().min(1, "Required"),
  excerpt: z.string().min(1, "Required"),
  content: z.string().min(1, "Required"),
  cover_image_url: z.string().optional().nullable(),
  published: z.boolean().default(false),
});
export type BlogPostInput = z.infer<typeof blogPostSchema>;

export const contactMessageSchema = z.object({
  name: z.string().min(1, "Please enter your name"),
  email: z.string().email("Enter a valid email"),
  message: z.string().min(10, "Say a little more (10 characters minimum)"),
});
export type ContactMessageInput = z.infer<typeof contactMessageSchema>;

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Required"),
});
export type LoginInput = z.infer<typeof loginSchema>;
