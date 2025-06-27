'use client';

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
import { getSidebarItemsForRole } from '@/constants/sidebar.const';
import type { User } from '@/types/models/User';

interface DashboardSidebarProps {
  user?: User;
}
export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ user }) => {
  const locale = useLocale();
  const { navMain, navSecondary } = getSidebarItemsForRole(user?.role);
  return (
    <Sidebar side={locale === 'he' ? 'right' : 'left'} collapsible="offcanvas">
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
        <NavMain items={navMain} />
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
};
