'use client';
import Image from 'next/image';
import { useLocale } from 'next-intl';

import { renderers } from '@/app/dashboard/recipes/[id]/components/Renderers';
import { ShareButton } from '@/components/share-button';
import { Button } from '@/components/ui/button';
import { useTypedTranslations } from '@/hooks/useTypedTranslations';
import { downloadAsDoc } from '@/lib/documentGenerator';
import { formattedDate, numberFormat } from '@/lib/utils';
import type { RecipeWithEmployeeAndParameters } from '@/services/recipeService';

export const Recipe: React.FC<{ recipe: RecipeWithEmployeeAndParameters }> = ({
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
            {formattedDate({ date: recipe.createdAt, locale })}
          </p>
          <p className="text-sm">
            <span className="font-medium">{t('clientName')}:&nbsp;</span>
            {recipe.client?.name}
          </p>
          <p className="text-sm">
            <span className="font-medium">{t('status')}:&nbsp;</span>
            {recipe.status}
          </p>
          <p className="text-sm">
            <span className="font-medium">{t('price')}:&nbsp;</span>
            {numberFormat(recipe.price ?? 0)}
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
              width={375}
              height={375}
              className="h-auto w-full rounded border ring-gray-200"
              style={{
                maxWidth: '100%',
                maxHeight: '375px',
                height: 'auto',
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
