// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const employees = await prisma.employee.createMany({
    data: [
      { name: 'Антон Панов', avatarUrl: 'https://i.pravatar.cc/150?img=1' },
    ],
  });

  console.log(`✅ Создано сотрудников: ${employees.count}`);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
