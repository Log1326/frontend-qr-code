// app/api/employees/route.ts
import { NextResponse } from 'next/server';

import { db } from '@/lib/prisma';

export async function GET() {
  try {
    const employees = await db.employee.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    return NextResponse.json(employees);
  } catch (error) {
    console.error('Failed to fetch employees', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
