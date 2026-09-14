import { ProjectsManager } from "@/components/admin/projects-manager";
import { getProjects } from "@/lib/queries";

export default async function AdminProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl font-medium">Projects</h1>
        <p className="mt-1 text-muted-foreground">
          Screenshots, videos, links, tech stack — everything for your showcase.
        </p>
      </div>
      <ProjectsManager projects={projects} />
    </div>
  );
}
