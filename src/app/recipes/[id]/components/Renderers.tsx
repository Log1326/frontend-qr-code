import Image from 'next/image';

import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

export const renderers = {
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
