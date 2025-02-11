'use client';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Prisma } from '@prisma/client';
import { Document, ImageRun, Packer, Paragraph } from 'docx';
import { saveAs } from 'file-saver';
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
  const downloadAsDoc = async () => {
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              text: recipe.title,
              spacing: { after: 200 },
            }),
            new Paragraph({
              text: `Created: ${recipe.createdAt.toLocaleString()}`,
              spacing: { after: 200 },
            }),
            ...(recipe.parameters?.map((param) => {
              if (param.type === 'FILE') {
                const base64Data = param.value.split(',')[1];

                return new Paragraph({
                  children: [
                    new ImageRun({
                      data: base64Data,
                      transformation: {
                        width: 400,
                        height: 300,
                      },
                      type: 'png',
                    }),
                  ],
                  spacing: { after: 200 },
                });
              }
              return new Paragraph({
                text: `${param.name}: ${param.value}`,
                spacing: { after: 200 },
              });
            }) || []),
            ...(recipe.qrCode
              ? [
                  new Paragraph({
                    children: [
                      new ImageRun({
                        data: recipe.qrCode.split(',')[1],
                        transformation: {
                          width: 200,
                          height: 200,
                        },
                        type: 'png',
                      }),
                    ],
                    spacing: { after: 200 },
                  }),
                ]
              : []),
          ],
        },
      ],
    });

    try {
      const blob = await Packer.toBlob(doc);
      saveAs(blob, `${recipe.title}.docx`);
    } catch (error) {
      console.error('Error creating document:', error);
    }
  };
  return (
    <div className="w-full rounded-md p-6 shadow-lg ring-1 ring-gray-300">
      <div className="flex items-center justify-between">
        <h1 className="w-2/3 p-2 text-3xl font-bold">{recipe.title}</h1>
        <div className="flex flex-col items-center gap-2">
          <Button onClick={downloadAsDoc}>Download as DOC</Button>
          {recipe.qrCode && (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="primary">
                  Open QR-Code
                  <QrCode />
                </Button>
              </DialogTrigger>
              <DialogContent className="h-full max-h-96 w-full">
                <AspectRatio
                  ratio={16 / 9}
                  className="relaite max-h-96 bg-muted">
                  <Image
                    src={recipe.qrCode}
                    alt="qrcode image"
                    fill
                    className="mx-auto max-h-96 p-3"
                    priority
                  />
                </AspectRatio>
              </DialogContent>
            </Dialog>
          )}
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
