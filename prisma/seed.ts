import {
  PrismaClient,
  FieldType,
  EventType,
  RecipeStatus,
} from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const employee = await prisma.employee.create({
    data: {
      name: 'Антон Панов',
      avatarUrl: 'https://i.pravatar.cc/150?u=ivan',
    },
  });

  const clientNames = Array.from({ length: 10 }, (_, i) => `Клиент ${i}`);

  const getRandomPrice = () =>
    Math.floor(Math.random() * (100000 - 1000 + 1)) + 1000;

  for (let i = 0; i < 20; i++) {
    const clientName =
      clientNames[Math.floor(Math.random() * clientNames.length)];
    const statusValues: RecipeStatus[] = ['NEW', 'IN_PROGRESS', 'COMPLETED'];

    const recipe = await prisma.recipe.create({
      data: {
        employeeId: employee.id,
        clientName,
        price: getRandomPrice(),
        status: statusValues[Math.floor(Math.random() * statusValues.length)],
        qrCodeUrl: null,
        parameters: {
          create: [
            {
              name: 'Описание',
              type: FieldType.TEXT,
              description: 'Описание заказа ' + (i + 1),
              order: 1,
            },
            {
              name: 'Комментарий',
              type: FieldType.AREA,
              description: 'Комментарий клиента',
              order: 2,
            },
            ...(Math.random() > 0.5
              ? [
                  {
                    name: 'Файл',
                    type: FieldType.FILE,
                    description: 'https://example.com/image.jpg',
                    order: 3,
                  },
                ]
              : []),
          ],
        },
        events: {
          create: [
            {
              type: EventType.CREATED,
            },
          ],
        },
      },
    });

    console.log(`Создан заказ ${recipe.id} для ${clientName}`);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log('✅ Сид завершён');
  })
  .catch(async (e) => {
    console.error('❌ Ошибка сидирования:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
