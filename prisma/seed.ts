import {
  PrismaClient,
  FieldType,
  EventType,
  RecipeStatus,
} from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const employeeNames = ['Антон Панов', 'Елена Смирнова', 'Иван Кузнецов'];

  const employees = await Promise.all(
    employeeNames.map((name) => {
      const lowerName = name.toLowerCase();

      let avatarId = 'default';
      if (lowerName.includes('антон')) avatarId = 'anton';
      else if (lowerName.includes('иван')) avatarId = 'ivan';
      else if (lowerName.includes('елена')) avatarId = 'elena';

      return prisma.employee.create({
        data: {
          name,
          avatarUrl: `https://i.pravatar.cc/150?u=${avatarId}`,
        },
      });
    }),
  );

  const clientNames = Array.from({ length: 10 }, (_, i) => `Клиент ${i}`);
  const getRandomClientName = () =>
    clientNames[Math.floor(Math.random() * clientNames.length)];

  const getRandomPrice = () =>
    Math.floor(Math.random() * (100000 - 1000 + 1)) + 1000;

  const statusValues: RecipeStatus[] = ['NEW', 'IN_PROGRESS', 'COMPLETED'];

  for (const employee of employees) {
    console.log(`\n👤 Создаём заказы для сотрудника: ${employee.name}`);

    for (let i = 0; i < 15; i++) {
      const status =
        statusValues[Math.floor(Math.random() * statusValues.length)];

      const max = await prisma.recipe.aggregate({
        where: {
          status,
        },
        _max: {
          position: true,
        },
      });

      const nextPosition = (max._max?.position ?? -1) + 1;

      const recipe = await prisma.recipe.create({
        data: {
          employeeId: employee.id,
          clientName: getRandomClientName(),
          price: getRandomPrice(),
          status,
          position: nextPosition,
          qrCodeUrl: null,
          parameters: {
            create: [
              {
                name: 'Описание',
                type: FieldType.TEXT,
                description: `Описание заказа ${i + 1}`,
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

      console.log(
        `📝 Заказ ${recipe.id} (${recipe.clientName}) → статус "${status}", позиция ${nextPosition}`,
      );
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log('\n✅ Все заказы успешно созданы!');
  })
  .catch(async (e) => {
    console.error('❌ Ошибка:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
