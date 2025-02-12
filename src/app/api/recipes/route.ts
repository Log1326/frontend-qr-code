import { fileToBase64 } from '@/lib/fileToBase64';
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const title = formData.get('title') as string;

    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    const parameters = [];
    let i = 0;

    while (formData.has(`parameters.${i}.type`)) {
      const name = formData.get(`parameters.${i}.name`) as string;
      const type = formData.get(`parameters.${i}.type`) as 'TEXT' | 'AREA' | 'FILE';
      let value = formData.get(`parameters.${i}.value`) as string;
      const order = formData.get(`parameters.${i}.order`);

      if (type === 'FILE') {
        const file = formData.get(`parameters.${i}.file`) as File;
        if (file) {
          try {
            value = await fileToBase64(file);
          } catch (error) {
            return NextResponse.json(
              { error: 'Failed to process file', details: error instanceof Error ? error.message : 'Unknown error' },
              { status: 400 }
            );
          }
        }
      }

      if (!type || !value || !name || order === null) {
        i++;
        continue;
      }

      parameters.push({
        name,
        type,
        value,
        order: parseInt(order as string),
      });
      i++;
    }

    if (parameters.length === 0) {
      return NextResponse.json(
        { error: 'No valid parameters provided' },
        { status: 400 }
      );
    }

    try {
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
    } catch (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        {
          error: 'Database error',
          details: dbError instanceof Error ? dbError.message : 'Unknown database error'
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('General error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
