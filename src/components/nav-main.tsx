'use client';

import { type LucideIcon, PlusCircleIcon } from 'lucide-react';

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import type { MessageKeys } from '@/hooks/useTypedTranslations';
import { useTypedTranslations } from '@/hooks/useTypedTranslations';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function NavMain({
  items,
}: {
  items: {
    title: MessageKeys;
    url: string;
    icon?: LucideIcon;
  }[];
}) {
  const t = useTypedTranslations();
  const pathname = usePathname();

  const linkBaseClass =
    'flex items-center gap-2 min-w-8 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200 ease-linear';

  const activeClass = 'bg-primary text-primary-foreground hover:bg-primary/90';
  const inactiveClass =
    'text-muted-foreground hover:bg-muted hover:text-foreground';

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <Link
              href="/"
              className={cn(
                linkBaseClass,
                pathname === '/' ? activeClass : inactiveClass,
              )}>
              <PlusCircleIcon className="mr-2 h-4 w-4" />
              {t('quickCreate')}
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>

        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <Link
                href={item.url}
                className={cn(
                  linkBaseClass,
                  pathname === item.url ? activeClass : inactiveClass,
                )}>
                {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                {t(item.title)}
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
