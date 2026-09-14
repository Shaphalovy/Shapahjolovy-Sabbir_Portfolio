"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Award,
  Briefcase,
  FolderKanban,
  LayoutDashboard,
  Layers,
  LogOut,
  Mail,
  Newspaper,
  Sparkles,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import { logout } from "@/lib/actions/auth";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/about", label: "About & contact", icon: User },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/experience", label: "Experience", icon: Briefcase },
  { href: "/admin/skills", label: "Skills", icon: Sparkles },
  { href: "/admin/certifications", label: "Certifications", icon: Award },
  { href: "/admin/resume", label: "Resume", icon: Newspaper },
  { href: "/admin/blog", label: "Blog", icon: Newspaper },
  { href: "/admin/sections", label: "Sections", icon: Layers },
  { href: "/admin/messages", label: "Messages", icon: Mail },
];

export function AdminSidebar({ email }: { email?: string }) {
  const pathname = usePathname();

  return (
    <aside className="glass sticky top-4 flex h-[calc(100vh-2rem)] w-64 shrink-0 flex-col rounded-[var(--radius-lg)] p-4">
      <div className="px-2 py-2">
        <p className="font-display text-lg font-medium">Admin</p>
        {email && <p className="truncate text-xs text-muted-foreground">{email}</p>}
      </div>

      <nav className="mt-4 flex flex-1 flex-col gap-1 overflow-y-auto">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2.5 rounded-[var(--radius-sm)] px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center justify-between gap-2 border-t border-border pt-3">
        <ThemeToggle />
        <Link
          href="/"
          target="_blank"
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          View site ↗
        </Link>
        <form action={logout}>
          <button
            type="submit"
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-danger"
          >
            <LogOut className="h-3.5 w-3.5" /> Log out
          </button>
        </form>
      </div>
    </aside>
  );
}
