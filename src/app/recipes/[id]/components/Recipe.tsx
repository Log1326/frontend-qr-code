'use client';
import type { Prisma } from '@prisma/client';
import Image from 'next/image';
import { useLocale } from 'next-intl';

import { ShareButton } from '@/components/share-button';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { useTypedTranslations } from '@/hooks/useTypedTranslations';
import { downloadAsDoc } from '@/lib/documentGenerator';

type RecipeWithParameters = Prisma.RecipeGetPayload<{
  include: {
    employee: {
      select: {
        name: true;
      };
    };
    parameters: true;
  };
}>;

const renderers = {
  TEXT: (value: string) => <span>{value}</span>,
  AREA: (value: string) => (
    <div className="whitespace-pre-wrap break-words">{value}</div>
  ),
  FILE: (value: string) => (
    <Dialog>
      <DialogTrigger asChild>
        <AspectRatio ratio={16 / 9} className="relaitve bg-muted">
          <Image
            src={value}
            alt="Uploaded content"
            fill
            className="mx-auto"
            priority
          />
        </AspectRatio>
      </DialogTrigger>
      <DialogContent className="h-full w-full">
        <AspectRatio ratio={16 / 9} className="relative bg-muted">
          <Image
            src={value}
            alt="Uploaded content"
            fill
            className="mx-auto p-3"
            priority
          />
        </AspectRatio>
      </DialogContent>
    </Dialog>
  ),
};

export const Recipe: React.FC<{ recipe: RecipeWithParameters }> = ({
  recipe,
}) => {
  const t = useTypedTranslations();
  const locale = useLocale();
  return (
    <div className="relative flex w-full flex-col justify-start gap-2 overflow-x-hidden rounded-md p-4">
      {recipe.qrCodeUrl && (
        <div className="absolute right-3 top-3">
          <ShareButton url={recipe.qrCodeUrl} />
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="w-2/3 space-y-1 p-2">
          <h1 className="text-3xl font-bold">
            <span className="font-medium">{t('employeeName')}:</span>
            {recipe.employee.name}
          </h1>
          <p className="text-sm">
            {new Intl.DateTimeFormat(locale, {
              dateStyle: 'medium',
            }).format(new Date(recipe.createdAt))}
          </p>
          <p className="text-sm">
            <span className="font-medium">{t('clientName')}:&nbsp;</span>
            {recipe.clientName}
          </p>
          <p className="text-sm">
            <span className="font-medium">{t('status')}:&nbsp;</span>
            {recipe.status}
          </p>
          <p className="text-sm">
            <span className="font-medium">{t('price')}:&nbsp;</span>
            {Intl.NumberFormat('he-HE', {
              style: 'currency',
              currency: 'ILS',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(recipe.price ?? 0)}
          </p>
        </div>

        <div className="flex flex-col items-center gap-2 border">
          <Button variant="secondary" onClick={() => downloadAsDoc(recipe)}>
            Download as DOC
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {recipe.parameters.map((param) => (
          <div
            key={param.id}
            className="flex overflow-hidden rounded ring-1 ring-gray-300">
            <div className="w-1/3 p-2 font-medium">{param.name}</div>
            <div className="w-2/3 p-2">
              {renderers[param.type]?.(param.description) || param.description}
            </div>
          </div>
        ))}
        {recipe.qrCodeUrl && (
          <div className="mx-auto w-full max-w-sm">
            <Image
              src={recipe.qrCodeUrl}
              alt="QR Code"
              width={384}
              height={384}
              className="h-auto w-full rounded border ring-gray-200"
              style={{
                maxWidth: '100%',
                maxHeight: '384px',
                height: 'auto',
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
