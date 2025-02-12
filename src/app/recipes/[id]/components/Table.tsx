'use client';
import { QRGenerator } from '@/components/QRGenerator';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { downloadAsDoc } from '@/lib/documentGenerator';
import { getOrigin } from '@/lib/getOrigin';
import { Prisma } from '@prisma/client';
import { QrCode } from 'lucide-react';
import Image from 'next/image';

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
type RecipeWithParameters = Prisma.RecipeGetPayload<{
  include: {
    parameters: true;
  };
}>;
export const Table: React.FC<{ recipe: RecipeWithParameters }> = ({
  recipe,
}) => {
  return (
    <div className="w-full rounded-md p-6 shadow-lg ring-1 ring-gray-300">
      <div className="flex items-center justify-between">
        <h1 className="w-2/3 p-2 text-3xl font-bold">{recipe.title}</h1>
        <div className="flex flex-col items-center gap-2">
          <Button onClick={() => downloadAsDoc(recipe)}>Download as DOC</Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="primary">
                Open QR-Code
                <QrCode />
              </Button>
            </DialogTrigger>
            <DialogContent className="h-full w-full">
              <AspectRatio ratio={16 / 9} className="bg-muted">
                <QRGenerator data={`${getOrigin()}/recipes/${recipe.id}`} />
              </AspectRatio>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="w-2/3 p-2">{recipe.createdAt.toLocaleString()}</div>
      <div className="mt-4">
        {recipe.parameters.map((param) => (
          <div key={param.id} className="flex ring-1 ring-gray-300">
            <div className="w-1/3 p-2 font-medium ring-1 ring-gray-300">
              {param.name}
            </div>
            <div className="w-2/3 p-2">
              {renderers[param.type]?.(param.value)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
