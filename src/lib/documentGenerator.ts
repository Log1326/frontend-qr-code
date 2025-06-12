import type { Prisma } from '@prisma/client';
import {
  Document,
  ExternalHyperlink,
  ImageRun,
  Packer,
  Paragraph,
  TextRun,
} from 'docx';
import { saveAs } from 'file-saver';

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

export const downloadAsDoc = async (
  recipe: RecipeWithParameters,
): Promise<void> => {
  try {
    const paragraphs: Paragraph[] = [];

    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `🧾 Заказ от: ${recipe.clientName}`,
            bold: true,
          }),
        ],
        spacing: { after: 200 },
      }),
      new Paragraph({
        text: `Сотрудник: ${recipe.employee.name}`,
        spacing: { after: 100 },
      }),
      new Paragraph({
        text: `Статус: ${recipe.status}`,
        spacing: { after: 100 },
      }),
      new Paragraph({
        text: `Цена: ${recipe.price} ₪`,
        spacing: { after: 100 },
      }),
      new Paragraph({
        text: `Создан: ${new Date(recipe.createdAt).toLocaleString()}`,
        spacing: { after: 300 },
      }),
    );

    if (recipe.qrCodeUrl) {
      paragraphs.push(
        new Paragraph({
          children: [
            new ExternalHyperlink({
              link: recipe.qrCodeUrl,
              children: [
                new TextRun({
                  text: `QR код`,
                  style: 'Hyperlink',
                }),
              ],
            }),
          ],
          spacing: { after: 300 },
        }),
      );
    }

    recipe.parameters?.forEach((param, i) => {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${i + 1}. ${param.name}:`,
              bold: true,
            }),
          ],
          spacing: { after: 100 },
        }),
      );

      if (param.type === 'FILE' && param.description.startsWith('data:')) {
        try {
          const base64Data = param.description.split(',')[1];
          const imageBuffer = Uint8Array.from(atob(base64Data), (c) =>
            c.charCodeAt(0),
          ).buffer;

          paragraphs.push(
            new Paragraph({
              children: [
                new ImageRun({
                  data: imageBuffer,
                  transformation: {
                    width: 400,
                    height: 300,
                  },
                  type: 'png',
                }),
              ],
              spacing: { after: 300 },
            }),
          );
        } catch {
          paragraphs.push(
            new Paragraph({
              text: '❌ Не удалось загрузить изображение.',
              spacing: { after: 300 },
            }),
          );
        }
      } else {
        paragraphs.push(
          new Paragraph({
            text: param.description,
            spacing: { after: 200 },
          }),
        );
      }
    });

    const doc = new Document({
      sections: [{ children: paragraphs }],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${recipe.clientName}_recipe.docx`);
  } catch (error) {
    console.log('Ошибка создания документа:', error);
  }
};
