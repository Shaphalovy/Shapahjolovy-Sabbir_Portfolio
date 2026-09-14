import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileForm } from "@/components/admin/profile-form";
import { SocialsManager } from "@/components/admin/socials-manager";
import { getProfile, getSocials } from "@/lib/queries";
import { PROFILE_ID } from "@/lib/types";

export default async function AdminAboutPage() {
  const [profile, socials] = await Promise.all([getProfile(), getSocials()]);

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
        <h1 className="font-display text-3xl font-medium">About &amp; contact</h1>
        <p className="mt-1 text-muted-foreground">
          This powers your hero, about section, and footer.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <ProfileForm profile={safeProfile} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Socials</CardTitle>
        </CardHeader>
        <CardContent>
          <SocialsManager socials={socials} />
        </CardContent>
      </Card>
    </div>
  );
}
