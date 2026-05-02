import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  CalendarDays,
  BookOpenCheck,
  BriefcaseBusiness,
  Clock3,
  Boxes,
  CreditCard,
  BarChart3,
  Settings,
  Users,
  Building2,
  CalendarCheck2,
  FileText,
  ShieldCheck,
  SlidersHorizontal,
  ScrollText,
} from "lucide-react";

export type SidebarRole = "admin" | "organiser";

export type SidebarItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export type SidebarSection = {
  key: string;
  items: SidebarItem[];
};

export const SIDEBAR_CONFIG: Record<SidebarRole, SidebarSection[]> = {
  organiser: [
    {
      key: "main",
      items: [
        { label: "Dashboard", href: "/organizer/dashboard", icon: LayoutDashboard },
        { label: "Calendar", href: "/organizer/calendar", icon: CalendarDays },
        { label: "Bookings", href: "/organizer/bookings", icon: BookOpenCheck },
        { label: "Services", href: "/organizer/appointments", icon: BriefcaseBusiness },
        { label: "Availability", href: "/organizer/availability", icon: Clock3 },
        { label: "Resources", href: "/organizer/team", icon: Boxes },
        { label: "Payments", href: "/organizer/payments", icon: CreditCard },
        { label: "Insights", href: "/organizer/reports", icon: BarChart3 },
      ],
    },
    {
      key: "footer",
      items: [{ label: "Settings", href: "/organizer/settings", icon: Settings }],
    },
  ],
  admin: [
    {
      key: "main",
      items: [
        { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
        { label: "Users", href: "/admin/users", icon: Users },
        { label: "Organisers", href: "/admin/organisers", icon: Building2 },
        { label: "Appointments", href: "/admin/appointments", icon: CalendarCheck2 },
        { label: "Reports", href: "/admin/reports", icon: FileText },
        { label: "Roles & Permissions", href: "/admin/roles-permissions", icon: ShieldCheck },
        { label: "System Settings", href: "/admin/system-settings", icon: SlidersHorizontal },
        { label: "Logs", href: "/admin/logs", icon: ScrollText },
      ],
    },
  ],
};
