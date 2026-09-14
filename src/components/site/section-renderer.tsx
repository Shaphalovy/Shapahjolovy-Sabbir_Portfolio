import { AboutSection } from "@/components/site/about-section";
import { ProjectsSection } from "@/components/site/projects-section";
import { ExperienceSection } from "@/components/site/experience-section";
import { SkillsSection } from "@/components/site/skills-section";
import { CertificationsSection } from "@/components/site/certifications-section";
import { BlogSection } from "@/components/site/blog-section";
import { ContactSection } from "@/components/site/contact-section";
import type {
  BlogPost,
  Certification,
  Experience,
  Profile,
  Project,
  SiteSection,
  Skill,
} from "@/lib/types";

interface SectionRendererProps {
  sections: SiteSection[];
  profile: Profile;
  projects: Project[];
  experience: Experience[];
  skills: Skill[];
  certifications: Certification[];
  blogPosts: BlogPost[];
}

export function SectionRenderer({
  sections,
  profile,
  projects,
  experience,
  skills,
  certifications,
  blogPosts,
}: SectionRendererProps) {
  const visible = sections
    .filter((s) => s.visible && s.key !== "hero")
    .sort((a, b) => a.sort_order - b.sort_order);

  return (
    <>
      {visible.map((section) => {
        switch (section.key) {
          case "about":
            return <AboutSection key={section.id} profile={profile} />;
          case "projects":
            return <ProjectsSection key={section.id} projects={projects} />;
          case "experience":
            return <ExperienceSection key={section.id} experience={experience} />;
          case "skills":
            return <SkillsSection key={section.id} skills={skills} />;
          case "certifications":
            return (
              <CertificationsSection key={section.id} certifications={certifications} />
            );
          case "blog":
            return <BlogSection key={section.id} posts={blogPosts} />;
          case "contact":
            return <ContactSection key={section.id} profile={profile} />;
          default:
            return null;
        }
      })}
    </>
  );
}
