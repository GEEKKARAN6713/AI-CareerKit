import {
  LayoutDashboard,
  FileText,
  Globe,
  Linkedin,
  Compass,
  Settings,
  type LucideIcon,
} from "lucide-react";

export type NavLink = { href: string; label: string; icon: LucideIcon };

export const navLinks: NavLink[] = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/resumes", label: "Resumes", icon: FileText },
  { href: "/dashboard/portfolio", label: "Portfolio", icon: Globe },
  { href: "/dashboard/linkedin", label: "LinkedIn AI", icon: Linkedin },
  { href: "/dashboard/career", label: "Career AI", icon: Compass },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];
