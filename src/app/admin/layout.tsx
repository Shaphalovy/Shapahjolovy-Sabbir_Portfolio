import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { getCurrentUser } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  // Login page renders its own full-screen layout with no sidebar.
  if (!user) return <>{children}</>;

  return (
    <div className="mx-auto flex max-w-6xl gap-4 px-4 py-4">
      <AdminSidebar email={user.email} />
      <main className="min-w-0 flex-1 pb-16">{children}</main>
    </div>
  );
}
