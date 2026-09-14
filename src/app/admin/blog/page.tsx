import { BlogManager } from "@/components/admin/blog-manager";
import { getBlogPosts } from "@/lib/queries";

export default async function AdminBlogPage() {
  const posts = await getBlogPosts();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl font-medium">Blog</h1>
        <p className="mt-1 text-muted-foreground">Optional — only shown if you publish posts.</p>
      </div>
      <BlogManager posts={posts} />
    </div>
  );
}
