import { DataTable } from '@/components/data-table';
import { recipeService } from '@/services/recipeService';

export default async function Page() {
  const data = await recipeService.getDataTable();

  return (
    <div className="w-full px-4">
      <DataTable data={data} />
    </div>
  );
}
