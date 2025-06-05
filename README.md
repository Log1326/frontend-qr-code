📦 QR Code Recipes — Next.js Fullstack App

Это fullstack-приложение, созданное на базе Next.js с использованием create-next-app. Оно позволяет создавать рецепты (или инструкции) с параметрами различных типов и мгновенно генерировать уникальные QR-коды для доступа к ним.

⸻

🚀 Функциональность
	•	📄 Создание рецептов с параметрами: текст, область ввода или файл.
	•	📁 Загрузка и обработка файлов с преобразованием в Base64 для хранения.
	•	🔐 Интеграция с PostgreSQL через Prisma — надёжное хранение данных.
	•	🧾 Генерация QR-кодов с помощью qr-code-styling — поддержка логотипов, цветных точек и фона.
	•	🌐 Поддержка маршрутов через App Router и UI на базе React Server Components.
	•	📊 Удобная таблица параметров — структурированный вывод всех деталей рецепта.

⸻

🛠️ Технологии
	•	Next.js (App Router) — современная архитектура с серверными компонентами
	•	TypeScript — типизация всего проекта
	•	Prisma + PostgreSQL (Neon) — типобезопасный доступ к БД
	•	React Hook Form — валидация и работа с формами
	•	qr-code-styling — кастомизация QR-кодов
	•	Tailwind CSS — современная стилизация компонентов
	•	Zod — схема валидации
	•	Shadcn ui — headless библиотека готовых компонентов

▶️ Как запустить
# Запустить приложение в режиме разработки
pnpm run dev

# Линтинг проекта (ESLint + TypeScript)
pnpm run lint

# Сборка production-версии
pnpm run build

# Запуск production-сервера (после сборки)
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
