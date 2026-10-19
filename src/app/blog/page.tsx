import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { BlogCard } from "@/components/site/blog-card";
import { getBlogPosts, getProfile, getSections, getSocials } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Writing",
};

export default async function BlogIndexPage() {
  const [posts, profile, sections, socials] = await Promise.all([
    getBlogPosts({ onlyPublished: true }),
    getProfile(),
    getSections(),
    getSocials(),
  ]);

  return (
    <div>
      <Navbar
        fullName={profile?.full_name ?? ""}
        sections={sections}
        resumeUrl={profile?.resume_url}
      />
      <div className="pt-10">
        <div className="mx-auto max-w-[96rem] px-6">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to home
          </Link>
        </div>
        <h1 className="mx-auto max-w-[96rem] px-6 font-display text-4xl font-medium sm:text-5xl">
          Writing
        </h1>
        {posts.length === 0 ? (
          <p className="mx-auto mt-6 max-w-[96rem] px-6 text-muted-foreground">
            No posts yet — check back soon.
          </p>
        ) : (
          <section className="mx-auto max-w-[96rem] px-6 py-12">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {posts.map((post, i) => (
                <BlogCard key={post.id} post={post} delay={Math.min(i, 5) * 0.06} />
              ))}
            </div>
          </section>
        )}
      </div>
      <Footer fullName={profile?.full_name ?? ""} socials={socials} />
    </div>
  );
}
