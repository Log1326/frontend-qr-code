import { fileToBase64 } from '@/lib/fileToBase64';
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const title = formData.get('title') as string;

    if (!title) throw new Error('Title is required');

    const parameters = [];
    let i = 0;

    while (formData.has(`parameters.${i}.type`)) {
      const name = formData.get(`parameters.${i}.name`) as string;
      const type = formData.get(`parameters.${i}.type`) as
        | 'TEXT'
        | 'AREA'
        | 'FILE';
      let value = formData.get(`parameters.${i}.value`) as string;
      const order = formData.get(`parameters.${i}.order`);

      if (type === 'FILE') {
        const file = formData.get(`parameters.${i}.file`) as File;
        if (file) value = await fileToBase64(file);
      }

      if (!type || !value || !name || order === null) continue;

      parameters.push({
        name,
        type,
        value,
        order: parseInt(order as string),
      });
      i++;
    }

    const recipe = await prisma.recipe.create({
      data: {
        title,
        parameters: {
          createMany: {
            data: parameters,
          },
        },
      },
      include: {
        parameters: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    return NextResponse.json({ id: recipe.id });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to create recipe',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
