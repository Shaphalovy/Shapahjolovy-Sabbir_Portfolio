import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { BlogCard } from "@/components/site/blog-card";
import type { BlogPost } from "@/lib/types";

export function BlogSection({ posts }: { posts: BlogPost[] }) {
  if (posts.length === 0) return null;

  return (
    <section id="blog" className="mx-auto max-w-5xl px-6 py-20 sm:py-28">
      <Reveal>
        <div className="mb-10 flex items-end justify-between">
          <h2 className="font-display text-3xl font-medium sm:text-4xl">Writing</h2>
          <Link
            href="/blog"
            className="flex items-center gap-1 text-sm text-accent hover:underline"
          >
            View all <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </Reveal>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.slice(0, 3).map((post, i) => (
          <BlogCard key={post.id} post={post} delay={i * 0.08} />
        ))}
      </div>
    </section>
  );
}
