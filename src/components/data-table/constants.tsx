import type { ColumnDef } from '@tanstack/react-table';
import {
  CheckCircle2Icon,
  LoaderIcon,
  MoreVerticalIcon,
  OctagonAlert,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import type z from 'zod';

import type { schema } from '@/components/data-table/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { MessageKeys } from '@/hooks/useTypedTranslations';
import { useTypedTranslations } from '@/hooks/useTypedTranslations';
import { formattedDate, numberFormat } from '@/lib/utils';

export const columns: ColumnDef<z.infer<typeof schema>>[] = [
  {
    accessorKey: 'employeeName',
    header: 'employeeName',
    enableSorting: false,
    cell: ({ row }) => (
      <div className="w-fit">
        <Badge variant="secondary" className="px-1.5 text-muted-foreground">
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
      <div className="w-fit">
        <div className="text-muted-foreground">{row.original.clientName}</div>
      </div>
    ),
  },
  {
    accessorKey: 'status',
    header: 'status',
    enableSorting: true,
    cell: ({ row }) => <StatusCell status={row.original.status} />,
  },
  {
    accessorKey: 'price',
    header: 'price',
    enableSorting: true,
    cell: ({ row }) => (
      <div className="flex w-fit items-center gap-1 text-center text-muted-foreground [&_svg]:size-3">
        {numberFormat(row.original.price) ?? 0}
      </div>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: 'createdAt',
    enableSorting: true,
    cell: ({ row }) => <CreatedAtCell date={row.original.createdAt} />,
  },
  {
    id: 'actions',
    cell: ({ row }) => <ActionsCell id={row.id} />,
  },
];
const CreatedAtCell: React.FC<{ date: Date }> = ({ date }) => {
  const locale = useLocale();
  return (
    <div className="flex w-fit gap-1 text-muted-foreground [&_svg]:size-3">
      {formattedDate({ date, locale })}
    </div>
  );
};
const ActionsCell: React.FC<{ id: string }> = ({ id }) => {
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
        <DropdownMenuItem onClick={() => router.push('recipes/' + id)}>
          {t('link')}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>{t('delete')}</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const StatusCell: React.FC<{ status: string }> = ({ status }) => {
  const t = useTypedTranslations();
  return (
    <div className="flex w-fit items-center gap-1 text-center text-muted-foreground [&_svg]:size-3">
      {status === 'COMPLETED' ? (
        <CheckCircle2Icon className="text-green-500 dark:text-green-400" />
      ) : status === 'NEW' ? (
        <OctagonAlert />
      ) : (
        <LoaderIcon className="animate-spin" />
      )}
      {t(status as MessageKeys)}
    </div>
  );
};
