import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getBlogPosts,
  getCertifications,
  getExperience,
  getMessages,
  getProjects,
  getSkills,
} from "@/lib/queries";

export default async function AdminDashboardPage() {
  const [projects, experience, skills, certifications, blogPosts, messages] = await Promise.all([
    getProjects(),
    getExperience(),
    getSkills(),
    getCertifications(),
    getBlogPosts(),
    getMessages(),
  ]);

  const unread = messages.filter((m) => !m.read).length;

  const stats = [
    { label: "Projects", value: projects.length, href: "/admin/projects" },
    { label: "Experience entries", value: experience.length, href: "/admin/experience" },
    { label: "Skills", value: skills.length, href: "/admin/skills" },
    { label: "Certifications", value: certifications.length, href: "/admin/certifications" },
    { label: "Blog posts", value: blogPosts.length, href: "/admin/blog" },
    { label: "Unread messages", value: unread, href: "/admin/messages" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl font-medium">Dashboard</h1>
        <p className="mt-1 text-muted-foreground">Everything on your site, at a glance.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card className="transition-colors hover:border-accent/40">
              <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="font-display text-3xl font-medium">{stat.value}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
