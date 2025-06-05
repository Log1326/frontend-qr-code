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
- [shadcn/ui](https://ui.shadcn.com/) — headless UI-компоненты

---

## ▶️ Как запустить

# Запуск приложения в режиме разработки
```bash
pnpm run dev
# Линтинг проекта (ESLint + TypeScript)
pnpm run lint

# Сборка production-версии
pnpm run build

# Запуск production-сервера
pnpm start

💡 Полезные команды разработки
# Установка зависимостей
pnpm install

# Очистить .next, node_modules, и переустановить зависимости
rm -rf node_modules .next && pnpm install

# Обновить Prisma схему и сгенерировать клиент
pnpm prisma generate

# Выполнить миграции в базу данных
pnpm prisma migrate dev

# Подключиться к базе через Prisma Studio (UI)
pnpm prisma studio

💾 Развёртывание

Vercel, платформу от создателей Next.js. Хранилище можно подключить к Neon.tech или любому PostgreSQL-хостингу.

Документация по деплою: Deploying Next.js

⸻

📚 Дополнительно
	•	Документация Next.js
	•	Примеры с React Hook Form
	•	Prisma + Next.js Guide
