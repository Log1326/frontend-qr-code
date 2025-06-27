import type { LucideIcon } from 'lucide-react';
import {
  BarChartIcon,
  Calendar,
  FolderIcon,
  HandCoins,
  HelpCircleIcon,
  LayoutDashboardIcon,
  MapPin,
  SearchIcon,
  SettingsIcon,
  UsersIcon,
} from 'lucide-react';

import type { MessageKeys } from '@/hooks/useTypedTranslations';
import { Role } from '@/types/models/enums';

type SidebarItem = {
  title: MessageKeys;
  url: string;
  icon: LucideIcon;
  roles?: Role[];
};

const sidebarItems: {
  navMain: SidebarItem[];
  navSecondary: SidebarItem[];
} = {
  navMain: [
    { title: 'panel', url: '/dashboard/panel', icon: LayoutDashboardIcon },
    {
      title: 'analytics',
      url: '/dashboard/analytics',
      icon: BarChartIcon,
      roles: [Role.ADMIN, Role.SUPERUSER],
    },
    { title: 'projects', url: '/dashboard/folders', icon: FolderIcon },
    {
      title: 'team',
      url: '/dashboard/team',
      icon: UsersIcon,
      roles: [Role.ADMIN, Role.SUPERUSER],
    },
    { title: 'calendar', url: '/dashboard/calendar', icon: Calendar },
    {
      title: 'payment',
      url: '/dashboard/payment',
      icon: HandCoins,
      roles: [Role.ADMIN, Role.SUPERUSER],
    },
    { title: 'map', url: '/dashboard/map', icon: MapPin },
  ],
  navSecondary: [
    { title: 'settings', url: '/dashboard/settings', icon: SettingsIcon },
    { title: 'getHelp', url: '/dashboard/getHelp', icon: HelpCircleIcon },
    { title: 'search', url: '/dashboard/search', icon: SearchIcon },
  ],
};
export function getSidebarItemsForRole(role?: Role) {
  const filterByRole = (item: SidebarItem) => {
    if (!item.roles) return true;
    if (!role) return false;
    return item.roles.includes(role);
  };

  return {
    navMain: sidebarItems.navMain.filter(filterByRole),
    navSecondary: sidebarItems.navSecondary.filter(filterByRole),
  };
}
