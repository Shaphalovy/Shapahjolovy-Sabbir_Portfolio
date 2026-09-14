import { SkillsManager } from "@/components/admin/skills-manager";
import { getSkills } from "@/lib/queries";

export default async function AdminSkillsPage() {
  const skills = await getSkills();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl font-medium">Skills</h1>
        <p className="mt-1 text-muted-foreground">
          Grouped by category automatically — just type a category name.
        </p>
      </div>
      <SkillsManager skills={skills} />
    </div>
  );
}
