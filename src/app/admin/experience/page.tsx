import { ExperienceManager } from "@/components/admin/experience-manager";
import { getExperience } from "@/lib/queries";

export default async function AdminExperiencePage() {
  const experience = await getExperience();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl font-medium">Experience</h1>
        <p className="mt-1 text-muted-foreground">Your work history timeline.</p>
      </div>
      <ExperienceManager experience={experience} />
    </div>
  );
}
