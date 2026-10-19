import Link from "next/link";
import Image from "next/image";
import { Reveal } from "@/components/reveal";
import { formatDate } from "@/lib/utils";
import type { BlogPost } from "@/lib/types";

export function BlogCard({ post, delay = 0 }: { post: BlogPost; delay?: number }) {
  return (
    <Reveal delay={delay}>
      <Link
        href={`/blog/${post.slug}`}
        className="glass group flex h-full flex-col overflow-hidden rounded-[var(--radius-lg)] transition-all hover:-translate-y-1 hover:border-accent/40"
      >
        {post.cover_image_url && (
          <div className="relative aspect-[16/9] w-full overflow-hidden border-b border-border bg-background-alt">
            <Image
              src={post.cover_image_url}
              alt={post.title}
              fill
              sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-contain transition-transform duration-500 group-hover:scale-[1.03]"
            />
          </div>
        )}
        <div className="flex flex-1 flex-col gap-2 p-6">
          {post.published_at && (
            <span className="text-xs text-muted-foreground">
              {formatDate(post.published_at, { month: "long", day: "numeric", year: "numeric" })}
            </span>
          )}
          <h3 className="font-display text-lg font-medium leading-snug">{post.title}</h3>
          <p className="line-clamp-2 text-sm text-muted-foreground">{post.excerpt}</p>
        </div>
      </Link>
    </Reveal>
  );
}
