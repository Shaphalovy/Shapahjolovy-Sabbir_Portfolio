import { ResumeManager } from "@/components/admin/resume-manager";
import { getProfile } from "@/lib/queries";
import { PROFILE_ID } from "@/lib/types";

export default async function AdminResumePage() {
  const profile = await getProfile();

  const safeProfile = profile ?? {
    id: PROFILE_ID,
    full_name: "",
    headline: "",
    bio: "",
    avatar_url: null,
    location: null,
    years_experience: null,
    email: null,
    phone: null,
    resume_url: null,
    resume_updated_at: null,
    meta_title: null,
    meta_description: null,
    updated_at: new Date().toISOString(),
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl font-medium">Resume</h1>
        <p className="mt-1 text-muted-foreground">
          Replace your CV anytime — the download link on your site updates instantly.
        </p>
      </div>
      <ResumeManager profile={safeProfile} />
    </div>
  );
}
