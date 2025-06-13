'use client';

import type { LucideIcon } from 'lucide-react';
import {
  BarChartIcon,
  Calendar,
  FolderIcon,
  HandCoins,
  HelpCircleIcon,
  LayoutDashboardIcon,
  SearchIcon,
  SettingsIcon,
  UsersIcon,
} from 'lucide-react';
import Link from 'next/link';
import { useLocale } from 'next-intl';

import { NavMain } from '@/components/nav-main';
import { NavSecondary } from '@/components/nav-secondary';
import { NavUser } from '@/components/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import type { MessageKeys } from '@/hooks/useTypedTranslations';

const data: {
  user: { name: string; email: string; avatar: string };
  navMain: { title: MessageKeys; url: string; icon: LucideIcon }[];
  navSecondary: { title: MessageKeys; url: string; icon: LucideIcon }[];
} = {
  user: {
    name: 'Antonio',
    email: 'antony@mail.com',
    avatar: '',
  },
  navMain: [
    { title: 'dashboard', url: '/admin', icon: LayoutDashboardIcon },
    { title: 'analytics', url: '/analytics', icon: BarChartIcon },
    { title: 'projects', url: '/folders', icon: FolderIcon },
    { title: 'team', url: '/team', icon: UsersIcon },
    { title: 'calendar', url: '/calendar', icon: Calendar },
    { title: 'payment', url: '/payment', icon: HandCoins },
  ],
  navSecondary: [
    { title: 'settings', url: '/settings', icon: SettingsIcon },
    { title: 'getHelp', url: '/getHelp', icon: HelpCircleIcon },
    { title: 'search', url: '/search', icon: SearchIcon },
  ],
};

export const AppSidebar: React.FC<React.ComponentProps<typeof Sidebar>> = ({
  ...props
}) => {
  const locale = useLocale();
  return (
    <Sidebar
      side={locale === 'he' ? 'right' : 'left'}
      collapsible="offcanvas"
      {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5">
              <Link href="/">
                <span className="text-base font-semibold">Furniture Inc.</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
};
