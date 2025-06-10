# 📦 QR Code Recipes — Next.js Fullstack App

Это fullstack-приложение, созданное на базе **Next.js**. Оно позволяет создавать рецепты (или инструкции) с параметрами различных типов и мгновенно генерировать уникальные QR-коды для доступа к ним.

---

## 🚀 Функциональность

- 📄 **Создание рецептов** с параметрами: текст, область ввода или файл.
- 📁 **Загрузка и обработка файлов** с преобразованием в Base64 для хранения.
- 🔐 **Интеграция с PostgreSQL** через Prisma — надёжное хранение данных.
- 🧾 **Генерация QR-кодов** с помощью `qr-code-styling` — поддержка логотипов, цветных точек и фона.
- 🌐 **App Router + React Server Components** — современная маршрутизация и рендеринг.
- 📊 **Удобная таблица параметров** — структурированный вывод всех деталей рецепта.

---

## 🛠️ Технологии

- [Next.js (App Router)](https://nextjs.org/docs/app) — серверные компоненты и маршруты
- [TypeScript](https://www.typescriptlang.org/) — строгая типизация
- [Prisma](https://www.prisma.io/) + [PostgreSQL](https://www.postgresql.org/) (Neon.tech) — работа с БД
- [React Hook Form](https://react-hook-form.com/) — формы и валидация
- [Zod](https://zod.dev/) — схема валидации
- [qr-code-styling](https://www.npmjs.com/package/qr-code-styling) — кастомизация QR-кодов
- [Tailwind CSS](https://tailwindcss.com/) — современная стилизация
- [shadcn/ui](https://ui.shadcn.com/) — headless готовые UI-компоненты

---

### 🧹 Линтинг и форматирование

- **[Prettier](https://prettier.io/)** — автоматическое форматирование кода
- **[ESLint](https://eslint.org/)** — анализ и проверка кода

---

## 💾 Развёртывание

Приложение можно развернуть на [Vercel](https://vercel.com) — платформе от создателей Next.js.
Хранилище данных подключается через [Neon.tech](https://neon.tech) или любой другой PostgreSQL-хостинг.

📄 Документация: [Deploying Next.js](https://nextjs.org/docs/app/building-your-application/deploying)

---

## 📚 Дополнительно

- [📘 Документация Next.js](https://nextjs.org/docs)
- [📘 Примеры с React Hook Form](https://react-hook-form.com/get-started)
- [📘 Prisma + Next.js Guide](https://www.prisma.io/docs/guides/nextjs)

## ▶️ Как запустить

## Установка зависимостей
```bash
pnpm install
```

## Запуск приложения в режиме разработки
```bash
pnpm run dev
```
## Линтинг проекта (ESLint + TypeScript)
```bash
pnpm run lint
```

## Сборка production-версии
```bash
pnpm run build
```

## Запуск production-сервера
```bash
pnpm start
```

💡 Полезные команды разработки

## Очистить .next, node_modules, и переустановить зависимости
```bash
rm -rf node_modules .next && pnpm install
```
## Обновить Prisma схему и сгенерировать клиент
```bash
pnpm prisma generate
```
## Выполнить миграции в базу данных
```bash
pnpm prisma migrate dev
```
## Подключиться к базе через Prisma Studio (UI)
```bash
pnpm prisma studio
```

## 🌍 Интернационализация (i18n)

Приложение поддерживает **мультиязычный интерфейс** с помощью библиотеки [`next-intl`](https://next-intl-docs.vercel.app/). Это позволяет легко адаптировать UI под разные языки пользователей.

### 🌐 Поддерживаемые языки:

- 🇷🇺 Русский (`ru`)
- 🇺🇸 Английский (`en`)
- 🇮🇱 Иврит (`he`)

### 🧩 Структура переводов

## Пример работы с базой данных (Prisma)

```bash
import { db } from '@/lib/prisma';

/**
 * Получить рецепт по ID с параметрами,
 * отсортированными по полю `order` в порядке возрастания
 */
const getRecipeById = async (id: string) => {
  try {
    const recipe = await db.recipe.findUnique({
      where: { id },
      include: {
        parameters: {
          orderBy: { order: 'asc' },
        },
      },
    });
    return recipe;
  } catch (error) {
    console.error('Ошибка при получении рецепта:', error);
    return null;
  }
};
````

## 🧑‍💼 Employee Page — Kanban-доска заказов

Страница сотрудника представляет собой **Kanban-доску**, которая отображает все его заказы по статусам:

- 🆕 `NEW` — Новый заказ
- 🔄 `IN_PROGRESS` — В процессе выполнения
- ✅ `COMPLETED` — Завершён

### 📦 Возможности доски:

- 🧲 **Drag & Drop** заказов между колонками с помощью [`@dnd-kit`](https://dndkit.com/)
- ⚡ **Реальное время** — изменения сразу видны другим сотрудникам благодаря [`Socket.IO`](https://socket.io/)
- 🧑‍🤝‍🧑 **Фильтрация заказов** по текущему сотруднику
- ✅ **Сохранение изменений** в базе данных через Prisma

## 🛠️ Admin Page — Аналитика и управление

Админ-панель предоставляет удобные средства для анализа и контроля активности:

- 📊 **Графики** с использованием [`Recharts`](https://recharts.org/)
  - Динамика заказов по времени
  - Распределение заказов по статусам и сотрудникам
- 📋 **Таблица заказов** на основе [`@tanstack/react-table`](https://tanstack.com/table)
  - Сортировка, пагинация, фильтрация
  - Просмотр подробностей заказа
- 🧑‍💼 **Контроль сотрудников** — общее количество заказов, эффективность
