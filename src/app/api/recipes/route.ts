import type { FieldType, RecipeStatus } from '@prisma/client';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { fileToBase64 } from '@/lib/fileToBase64';
import { db } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const employeeName = formData.get('employee') as string;
    const clientName = formData.get('clientName') as string;
    const status = formData.get('status') as RecipeStatus;
    const priceRaw = formData.get('price') as string | null;
    const price = priceRaw ? parseFloat(priceRaw) : 0;
    if (!employeeName || !clientName || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }
    const employee = await db.employee.findFirst({
      where: { name: employeeName },
    });

    const parameters = [];
    let i = 0;

    while (formData.has(`parameters[${i}][type]`)) {
      const name = formData.get(`parameters[${i}][name]`) as string;
      const type = formData.get(`parameters[${i}][type]`) as FieldType;
      let description = formData.get(`parameters[${i}][description]`) as string;
      const order = formData.get(`parameters[${i}][order]`);
      if (!name || !type || !order) {
        i++;
        continue;
      }

      if (type === 'FILE') {
        const file = formData.get(`parameters[${i}][file]`) as File;
        if (file) {
          try {
            description = await fileToBase64(file);
          } catch (error) {
            return NextResponse.json(
              {
                error: 'Failed to process file',
                details:
                  error instanceof Error ? error.message : 'Unknown error',
              },
              { status: 400 },
            );
          }
        }
      }

      parameters.push({
        name,
        type,
        description,
        order: parseInt(order as string),
      });

      i++;
    }

    const recipe = await db.recipe.create({
      data: {
        employee: {
          connect: {
            id: employee?.id,
          },
        },
        clientName,
        status,
        price,
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
    console.error('General error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  } finally {
    await db.$disconnect();
  }
}
