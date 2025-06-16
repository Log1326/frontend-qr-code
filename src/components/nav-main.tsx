'use client';

import { type LucideIcon, PlusCircleIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import type { MessageKeys } from '@/hooks/useTypedTranslations';
import { useTypedTranslations } from '@/hooks/useTypedTranslations';
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

  const activeClass =
    'bg-blue-600 text-white shadow hover:bg-blue-700 active:bg-blue-800 focus-visible:ring-2 focus-visible:ring-blue-300';
  const inactiveClass =
    'text-muted-foreground hover:bg-muted hover:text-foreground';

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <Link
              href="https://t.me/qrcode1841bot?start=1"
              className={cn(linkBaseClass)}>
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
