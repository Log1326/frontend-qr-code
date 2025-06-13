import { Badge } from '@/components/ui/badge';
import { useTypedTranslations } from '@/hooks/useTypedTranslations';

interface HeaderEmployeesProps {
  data: {
    name: string;
    id: string;
  }[];
}
export const HeaderEmployees: React.FC<HeaderEmployeesProps> = ({ data }) => {
  const t = useTypedTranslations();
  return (
    <div>
      <h3>
        {t('onlineEmployees')}: {data.length}
      </h3>
      <div>
        <h3 className="text-lg font-semibold">{t('connectedEmployees')}:</h3>
        <div className="flex w-fit flex-col gap-1">
          {data?.map((employee: { id: string; name: string }) => (
            <Badge variant="outline" key={employee.id}>
              <div className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                <p>{employee.name}</p>
              </div>
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};
