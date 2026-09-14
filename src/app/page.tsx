import { Hero } from "@/components/site/hero";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { SectionRenderer } from "@/components/site/section-renderer";
import {
  getBlogPosts,
  getCertifications,
  getExperience,
  getProfile,
  getProjects,
  getSections,
  getSkills,
  getSocials,
} from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [profile, sections, projects, experience, skills, certifications, blogPosts, socials] =
    await Promise.all([
      getProfile(),
      getSections(),
      getProjects({ onlyPublished: true }),
      getExperience(),
      getSkills(),
      getCertifications(),
      getBlogPosts({ onlyPublished: true }),
      getSocials(),
    ]);

  const safeProfile =
    profile ?? {
      id: "",
      full_name: "Your Name",
      headline: "Set up your profile from the admin panel.",
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

  const heroVisible = sections.find((s) => s.key === "hero")?.visible ?? true;

  return (
    <div className="relative">
      <Navbar
        fullName={safeProfile.full_name}
        sections={sections}
        resumeUrl={safeProfile.resume_url}
      />
      {heroVisible && <Hero profile={safeProfile} />}
      <SectionRenderer
        sections={sections}
        profile={safeProfile}
        projects={projects}
        experience={experience}
        skills={skills}
        certifications={certifications}
        blogPosts={blogPosts}
      />
      <Footer fullName={safeProfile.full_name} socials={socials} />
    </div>
  );
}
