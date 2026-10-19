import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { Markdown } from "@/components/site/markdown";
import { formatDate } from "@/lib/utils";
import {
  getBlogPostBySlug,
  getBlogPosts,
  getProfile,
  getSections,
  getSocials,
} from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.cover_image_url ? [post.cover_image_url] : [],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [post, profile, sections, socials] = await Promise.all([
    getBlogPostBySlug(slug),
    getProfile(),
    getSections(),
    getSocials(),
  ]);

  if (!post || !post.published) notFound();

  return (
    <div>
      <Navbar
        fullName={profile?.full_name ?? ""}
        sections={sections}
        resumeUrl={profile?.resume_url}
      />

      <article className="mx-auto max-w-[96rem] px-6 py-16">
        <Link
          href="/blog"
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to writing
        </Link>

        {post.published_at && (
          <p className="text-sm text-muted-foreground">
            {formatDate(post.published_at, { month: "long", day: "numeric", year: "numeric" })}
          </p>
        )}
        <h1 className="mt-2 font-display text-4xl font-medium sm:text-5xl">{post.title}</h1>

        {post.cover_image_url && (
          <div className="relative mt-8 aspect-[16/9] max-h-[70vh] w-full overflow-hidden rounded-[var(--radius-lg)] border border-border bg-background-alt">
            <Image src={post.cover_image_url} alt={post.title} fill sizes="100vw" className="object-contain" />
          </div>
        )}

        <div className="mt-10">
          <Markdown content={post.content} />
        </div>
      </article>

      <Footer fullName={profile?.full_name ?? ""} socials={socials} />
    </div>
  );
}

export async function generateStaticParams() {
  const posts = await getBlogPosts({ onlyPublished: true }).catch(() => []);
  return posts.map((p) => ({ slug: p.slug }));
}
