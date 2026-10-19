import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, FileText, Play } from "lucide-react";
import { TbBrandGithub } from "react-icons/tb";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Markdown } from "@/components/site/markdown";
import { ProjectGallery } from "@/components/site/project-gallery";
import { getEmbedUrl } from "@/lib/video-embed";
import { formatDate } from "@/lib/utils";
import {
  getProfile,
  getProjectBySlug,
  getProjects,
  getSections,
  getSocials,
} from "@/lib/queries";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.summary,
    openGraph: {
      title: project.title,
      description: project.summary,
      images: project.cover_image_url ? [project.cover_image_url] : [],
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [project, profile, sections, socials] = await Promise.all([
    getProjectBySlug(slug),
    getProfile(),
    getSections(),
    getSocials(),
  ]);

  if (!project || project.status !== "published") notFound();

  const embedUrl = project.demo_video_url ? getEmbedUrl(project.demo_video_url) : null;
  const gallery = [project.cover_image_url, ...project.images].filter(
    (v): v is string => Boolean(v)
  );

  return (
    <div>
      <Navbar
        fullName={profile?.full_name ?? ""}
        sections={sections}
        resumeUrl={profile?.resume_url}
      />

      <article className="mx-auto max-w-[96rem] px-6 py-16">
        <Link
          href={project.project_type === "webapp" ? "/#webapps" : "/#projects"}
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to projects
        </Link>

        <div>
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <Badge>{project.category}</Badge>
          {project.project_date && <span>{formatDate(project.project_date)}</span>}
        </div>

        <h1 className="mt-4 font-display text-4xl font-medium sm:text-5xl">{project.title}</h1>
        <p className="mt-4 text-lg text-muted-foreground">{project.summary}</p>

        <div className="mt-6 flex flex-wrap gap-3">
          {project.live_url && (
            <Button
              asChild
              className="bg-emerald-600 text-white shadow-[0_6px_20px_-8px_rgba(5,150,105,0.6)] hover:bg-emerald-500"
            >
              <a href={project.live_url} target="_blank" rel="noopener noreferrer">
                <Play className="h-4 w-4 fill-current" /> Live demo
              </a>
            </Button>
          )}
          {project.github_url && (
            <Button asChild variant="outline">
              <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                <TbBrandGithub className="h-4 w-4" /> Source
              </a>
            </Button>
          )}
          {project.docs_url && (
            <Button asChild variant="outline">
              <a href={project.docs_url} target="_blank" rel="noopener noreferrer">
                <FileText className="h-4 w-4" /> Docs
              </a>
            </Button>
          )}
        </div>

        {project.tech_stack.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-1.5">
            {project.tech_stack.map((t) => (
              <Badge key={t} variant="outline">
                {t}
              </Badge>
            ))}
          </div>
        )}

        </div>

        {embedUrl && (
          <div className="relative mt-10 aspect-video max-h-[85vh] w-full overflow-hidden rounded-[var(--radius-lg)] border border-border">
            <iframe
              src={embedUrl}
              className="absolute inset-0 h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}

        {gallery.length > 0 && (
          <div className="mt-10">
            <ProjectGallery images={gallery} title={project.title} />
          </div>
        )}

        {project.description && (
          <div className="mt-10">
            <Markdown content={project.description} />
          </div>
        )}
      </article>

      <Footer fullName={profile?.full_name ?? ""} socials={socials} />
    </div>
  );
}

export async function generateStaticParams() {
  const projects = await getProjects({ onlyPublished: true }).catch(() => []);
  return projects.map((p) => ({ slug: p.slug }));
}
