import { SectionsManager } from "@/components/admin/sections-manager";
import { getSections } from "@/lib/queries";

export default async function AdminSectionsPage() {
  const sections = await getSections();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl font-medium">Sections</h1>
        <p className="mt-1 text-muted-foreground">
          Show, hide, and reorder the sections on your homepage.
        </p>
      </div>
      <SectionsManager sections={sections} />
    </div>
  );
}
