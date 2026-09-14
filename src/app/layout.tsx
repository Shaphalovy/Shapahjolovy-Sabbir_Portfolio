import type { Metadata } from "next";
import { Fraunces, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { getProfile } from "@/lib/queries";
import { absoluteUrl } from "@/lib/utils";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz", "SOFT", "WONK"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile().catch(() => null);
  const title = profile?.meta_title || profile?.full_name || "Portfolio";
  const description =
    profile?.meta_description || profile?.headline || "Personal portfolio";

  return {
    metadataBase: new URL(absoluteUrl("/")),
    title: {
      default: title,
      template: `%s — ${profile?.full_name || "Portfolio"}`,
    },
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: profile?.avatar_url ? [profile.avatar_url] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${fraunces.variable} ${spaceGrotesk.variable}`}
    >
      <body className="min-h-screen antialiased selection:bg-accent-soft">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <div className="grain" />
          {children}
          <Toaster position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
