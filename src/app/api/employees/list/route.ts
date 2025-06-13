import { db } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const idsParam = req.nextUrl.searchParams.get('ids');
  if (!idsParam) return NextResponse.json([], { status: 200 });
  const ids = idsParam.split(',');
  try {
    const employees = await db.employee.findMany({
      where: {
        id: {
          in: ids,
        },
      },
      select: {
        id: true,
        name: true,
      },
    });

    return NextResponse.json(employees, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Ошибка при получении данных сотрудников' },
      { status: 500 },
    );
  }
}
