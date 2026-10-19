export const PROFILE_ID = "00000000-0000-0000-0000-000000000001";

export type SectionKey =
  | "hero"
  | "about"
  | "projects"
  | "webapps"
  | "experience"
  | "skills"
  | "certifications"
  | "blog"
  | "contact";

export interface Profile {
  id: string;
  full_name: string;
  headline: string;
  bio: string;
  avatar_url: string | null;
  location: string | null;
  years_experience: number | null;
  email: string | null;
  phone: string | null;
  resume_url: string | null;
  resume_updated_at: string | null;
  meta_title: string | null;
  meta_description: string | null;
  updated_at: string;
}

export interface Social {
  id: string;
  platform: string;
  url: string;
  icon: string;
  sort_order: number;
  visible: boolean;
  created_at: string;
}

export type ProjectType = "automation" | "webapp";

export type ProjectStatus = "draft" | "published";

export interface Project {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  category: string;
  project_type: ProjectType;
  tech_stack: string[];
  cover_image_url: string | null;
  images: string[];
  demo_video_url: string | null;
  docs_url: string | null;
  github_url: string | null;
  live_url: string | null;
  featured: boolean;
  status: ProjectStatus;
  project_date: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  location: string | null;
  company_url: string | null;
  logo_url: string | null;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  responsibilities: string[];
  achievements: string[];
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency: number;
  icon_url: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export type CertificationFileType = "image" | "pdf";

export interface Certification {
  id: string;
  title: string;
  issuing_organization: string;
  issue_date: string | null;
  expiry_date: string | null;
  credential_url: string | null;
  file_url: string | null;
  file_type: CertificationFileType | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image_url: string | null;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface SiteSection {
  id: string;
  key: SectionKey;
  label: string;
  visible: boolean;
  sort_order: number;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  created_at: string;
}
