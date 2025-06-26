import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

export default function AuthorizedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const { data } = useQuery({
  //   queryKey: ['currentUser'],
  //   queryFn: authService.getCurrentUser,
  //   staleTime: 1000 * 60 * 5,
  //   retry: false,
  // });
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
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
