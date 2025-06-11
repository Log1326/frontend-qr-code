import { ColumnDef } from '@tanstack/react-table';
import {
  CheckCircle2Icon,
  OctagonAlert,
  LoaderIcon,
  GripVerticalIcon,
  MoreVerticalIcon,
} from 'lucide-react';
import z from 'zod';
import { schema } from './types';
import { Badge } from '../ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { useSortable } from '@dnd-kit/sortable';
import { Button } from '../ui/button';
import { useLocale } from 'next-intl';
import { useTypedTranslations } from '@/hooks/useTypedTranslations';
import { useRouter } from 'next/navigation';

export const columns: ColumnDef<z.infer<typeof schema>>[] = [
  {
    id: 'drag',
    header: () => null,
    enableSorting: false,
    cell: ({ row }) => <DragHandle id={row.original.id} />,
  },
  {
    accessorKey: 'employeeName',
    header: 'employeeName',
    enableSorting: false,
    cell: ({ row }) => (
      <div className="w-32">
        <Badge variant="outline" className="px-1.5 text-muted-foreground">
          {row.original.employeeName}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: 'clientName',
    header: 'clientName',
    enableSorting: false,
    cell: ({ row }) => (
      <div className="w-32">
        <div className="px-1.5 text-muted-foreground">
          {row.original.clientName}
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'status',
    header: 'status',
    enableSorting: true,
    cell: ({ row }) => (
      <div className="flex w-32 items-center gap-1 text-center text-muted-foreground [&_svg]:size-3">
        {row.original.status === 'COMPLETED' ? (
          <CheckCircle2Icon className="text-green-500 dark:text-green-400" />
        ) : row.original.status === 'NEW' ? (
          <OctagonAlert />
        ) : (
          <LoaderIcon className="animate-spin" />
        )}
        {row.original.status}
      </div>
    ),
  },
  {
    accessorKey: 'price',
    header: 'price',
    enableSorting: true,
    cell: ({ row }) => (
      <div className="flex w-32 items-center gap-1 text-center text-muted-foreground [&_svg]:size-3">
        {new Intl.NumberFormat('he-IL', {
          style: 'currency',
          currency: 'ILS',
          maximumFractionDigits: 0,
        }).format(Number(row.original.price) ?? 0)}
      </div>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: 'createdAt',
    enableSorting: true,
    cell: ({ row }) => {
      const locale = useLocale();
      return (
        <div className="flex w-fit gap-1 px-1.5 text-muted-foreground [&_svg]:size-3">
          {new Intl.DateTimeFormat(locale, {
            dateStyle: 'medium',
          }).format(new Date(row.original.createdAt))}
        </div>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const t = useTypedTranslations();
      const router = useRouter();
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex size-8 text-muted-foreground data-[state=open]:bg-muted"
              size="icon">
              <MoreVerticalIcon />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32">
            <DropdownMenuItem>{t('edit')}</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push('recipe/' + row.id)}>
              {t('link')}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>{t('delete')}</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

function DragHandle({ id }: { id: number }) {
  const { attributes, listeners } = useSortable({
    id,
  });

  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="size-7 text-muted-foreground hover:bg-transparent">
      <GripVerticalIcon className="size-3 text-muted-foreground" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  );
}
