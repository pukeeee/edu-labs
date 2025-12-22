import {
  Home,
  BookOpen,
  Trophy,
  Heart,
  Settings,
  User as UserIcon,
  BarChart3,
} from "lucide-react";

export const mainNavItems = [
  {
    title: "Головна",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Мої курси",
    href: "/dashboard/courses",
    icon: BookOpen,
  },
  {
    title: "Статистика",
    href: "/dashboard/stats",
    icon: BarChart3,
  },
  {
    title: "Досягнення",
    href: "/dashboard/achievements",
    icon: Trophy,
  },
  {
    title: "Обрані",
    href: "/dashboard/favorites",
    icon: Heart,
  },
];

export const settingsNavItems = [
  {
    title: "Профіль",
    href: "/dashboard/profile",
    icon: UserIcon,
  },
  {
    title: "Налаштування",
    href: "/dashboard/settings",
    icon: Settings,
  },
];
