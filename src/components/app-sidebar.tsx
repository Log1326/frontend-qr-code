'use client';

import type { LucideIcon } from 'lucide-react';
import {
  BarChartIcon,
  FolderIcon,
  HelpCircleIcon,
  LayoutDashboardIcon,
  SearchIcon,
  SettingsIcon,
  UsersIcon,
} from 'lucide-react';

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
import { useLocale } from 'next-intl';

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
    { title: 'dashboard', url: '#', icon: LayoutDashboardIcon },
    { title: 'analytics', url: '#', icon: BarChartIcon },
    { title: 'projects', url: '#', icon: FolderIcon },
    { title: 'team', url: '#', icon: UsersIcon },
  ],
  navSecondary: [
    { title: 'settings', url: '#', icon: SettingsIcon },
    { title: 'getHelp', url: '#', icon: HelpCircleIcon },
    { title: 'search', url: '#', icon: SearchIcon },
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
              <a href="#">
                <span className="text-base font-semibold">Furniture Inc.</span>
              </a>
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
