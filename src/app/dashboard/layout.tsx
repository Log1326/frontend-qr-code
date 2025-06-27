'use client';

import { DashboardSidebar } from '@/app/dashboard/components/dashboard-sidebar';
import { SiteHeader } from '@/components/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { useUser } from '@/hooks/useUser';

export default function AuthorizedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = useUser();
  return (
    <>
      <SidebarProvider>
        <DashboardSidebar user={user} />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-col items-center justify-center gap-3">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
