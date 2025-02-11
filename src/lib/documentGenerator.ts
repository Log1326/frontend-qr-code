import { Prisma } from '@prisma/client';
import { Document, ImageRun, Packer, Paragraph } from 'docx';
import { saveAs } from 'file-saver';

type RecipeWithParameters = Prisma.RecipeGetPayload<{
  include: { parameters: true };
}>;
export const downloadAsDoc = async (
  recipe: RecipeWithParameters,
): Promise<void> => {
  try {
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
          ],
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${recipe.title}.docx`);
  } catch (error) {
    console.error('Error creating document:', error);
  }
};
