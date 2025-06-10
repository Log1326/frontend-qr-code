import { DataTable } from '@/components/data-table';
import { generateRecipes } from './generate';

export default function Page() {
  const data = generateRecipes(60);
  return (
    <div className="w-full px-10">
      <DataTable data={data} />
    </div>
  );
}
