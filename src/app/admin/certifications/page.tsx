import { CertificationsManager } from "@/components/admin/certifications-manager";
import { getCertifications } from "@/lib/queries";

export default async function AdminCertificationsPage() {
  const certifications = await getCertifications();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl font-medium">Certifications &amp; training</h1>
        <p className="mt-1 text-muted-foreground">
          Upload the certificate image or PDF and keep issuing details up to date.
        </p>
      </div>
      <CertificationsManager certifications={certifications} />
    </div>
  );
}
