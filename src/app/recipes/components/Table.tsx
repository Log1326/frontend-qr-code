'use client'
import { Button } from "@/components/ui/button";
import { Document, ImageRun, Packer, Paragraph } from 'docx';
import { saveAs } from 'file-saver';
import Image from "next/image";
interface TableProps {
  recipe: {
    title: string;
    parameters: {
      id: string;
      type: "TEXT" | "AREA" | "FILE";
      value: string;
      order: number;
    }[];
    createdAt: Date;
  };
}

const renderers = {
  TEXT: (value: string) => <span>{value}</span>,
  AREA: (value: string) => <div className="break-words whitespace-pre-wrap">{value}</div>,
  FILE: (value: string) => (
    <Image src={value} alt="Uploaded content" height={100} width={320} className="mx-auto" priority />
  ),
};

export const Table: React.FC<TableProps> = ({ recipe }) => {
  const downloadAsDoc = async () => {
      const doc = new Document({
        sections: [{
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
            ...recipe.parameters.map(param => {
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
                text: `${param.type}: ${param.value}`,
                spacing: { after: 200 },
              });
            }),
          ],
        }],
      });

      try {
        const blob = await Packer.toBlob(doc);
        saveAs(blob, `${recipe.title}.docx`);
      } catch (error) {
        console.error('Error creating document:', error);
      }
    };
  return (
    <div className="max-w-2xl border-4 mx-auto p-6 bg-background text-foreground shadow-lg rounded-md">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold w-2/3 p-2">{recipe.title}</h1>
        <Button
                  onClick={downloadAsDoc}
                >
                  Download as DOC
                </Button>
      </div>
      <div className="w-2/3 p-2">{recipe.createdAt.toLocaleString()}</div>
      <div className="mt-4">
        {recipe.parameters.map((param) => (
          <div key={param.id} className="flex border border-gray-300">
            <div className="w-1/3 p-2 font-medium border-r border-gray-300">{param.type}</div>
            <div className="w-2/3 p-2">{renderers[param.type]?.(param.value)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
