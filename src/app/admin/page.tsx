import { DataTable } from '@/components/data-table';
import { db } from '@/lib/prisma';
import { RecipeStatus } from '@prisma/client';

async function getDataTable(): Promise<
  {
    id: string;
    employeeName: string;
    clientName: string;
    price: number;
    status: RecipeStatus;
    createdAt: string;
  }[]
> {
  try {
    const recipes = await db.recipe.findMany({
      include: {
        employee: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const formatted = recipes.map((recipe) => ({
      id: recipe.id,
      employeeName: recipe.employee.name,
      clientName: recipe.clientName,
      price: recipe.price ?? 0,
      status: recipe.status,
      createdAt: recipe.createdAt.toISOString(),
    }));

    return formatted;
  } catch (err) {
    console.log('getDataTable: ', err);
    return [];
  }
}

export default async function Page() {
  const data = await getDataTable();
  return (
    <div className="w-full px-10">
      <DataTable data={data} />
    </div>
  );
}
