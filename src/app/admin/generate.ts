function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

type Employee = {
  id: string;
  name: string;
  avatarUrl?: string | null;
  createdAt: Date;
};

type RecipeStatus = 'NEW' | 'IN_PROGRESS' | 'COMPLETED';

type Recipe = {
  id: number;
  employeeName: string;
  clientName: string;
  price: string;
  status: RecipeStatus;
  createdAt: string;
};

export function generateRecipes(count = 6): Recipe[] {
  const employees: Employee[] = [
    {
      id: 'emp01',
      name: 'Иван Иванов',
      avatarUrl: null,
      createdAt: new Date(2023, 0, 10),
    },
    {
      id: 'emp02',
      name: 'Ольга Смирнова',
      avatarUrl: null,
      createdAt: new Date(2023, 1, 20),
    },
    {
      id: 'emp03',
      name: 'Павел Кузнецов',
      avatarUrl: null,
      createdAt: new Date(2023, 2, 15),
    },
  ];

  const recipeStatuses: RecipeStatus[] = ['NEW', 'IN_PROGRESS', 'COMPLETED'];
  const clients = [
    'ООО "Комфорт"',
    'ИП "Мебель-Сервис"',
    'Частное лицо – Сергей П.',
    'Компания "МебельПлюс"',
    'Частное лицо – Анна К.',
  ];

  const orders: Recipe[] = [];

  for (let i = 1; i <= count; i++) {
    const employee = randomChoice(employees);
    const status = randomChoice(recipeStatuses);
    const clientName = randomChoice(clients);
    const createdAt = new Date(2025, 5, 1 + i, 10, 0, 0).toDateString();
    const price = String(Math.floor(5000 + Math.random() * 20000));

    orders.push({
      id: i,
      employeeName: employee.name,
      clientName,
      price,
      status,
      createdAt,
    });
  }

  return orders;
}
