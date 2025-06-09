interface HeaderEmployeesProps {
  employeesIds: string[];
}
export const HeaderEmployees: React.FC<HeaderEmployeesProps> = ({
  employeesIds,
}) => {
  return <div>Сотрудников онлайн: {employeesIds.length}</div>;
};
