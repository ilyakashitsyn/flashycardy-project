# FlashyCardy - Умные карточки для изучения

Приложение для создания и изучения карточек с использованием современных технологий.

## Возможности

- 🔐 Аутентификация пользователей через Clerk
- 📚 Создание и управление колодами карточек
- 🎯 Изучение карточек с системой прогресса
- 🌙 Поддержка темной и светлой темы
- 📱 Адаптивный дизайн

## Технологии

- **Frontend**: Next.js 15, React 19, TypeScript
- **Стилизация**: Tailwind CSS
- **Аутентификация**: Clerk
- **База данных**: Neon (PostgreSQL) + Drizzle ORM
- **UI компоненты**: Radix UI + Lucide React

## Установка и запуск

1. Клонируйте репозиторий
2. Установите зависимости: `npm install`
3. Создайте `.env.local` файл с переменными окружения:
   ```
   DATABASE_URL=your_neon_database_url
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
   CLERK_SECRET_KEY=your_clerk_secret
   ```
4. Запустите миграции: `npm run db:migrate`
5. Запустите приложение: `npm run dev`

## Структура проекта

- `/src/app/dashboard` - Панель управления для залогиненных пользователей
- `/src/components/ui` - UI компоненты
- `/src/db` - Схема и конфигурация базы данных
- `/src/app/api` - API endpoints

## Dashboard

Dashboard доступен только для залогиненных пользователей по адресу `/dashboard`. Здесь пользователи могут:

- Просматривать свои колоды карточек
- Создавать новые колоды
- Переходить к изучению карточек
- Редактировать существующие колоды

## API Endpoints

- `GET /api/decks` - Получение колод пользователя
- `POST /api/decks` - Создание новой колоды

## Команды

- `npm run dev` - Запуск в режиме разработки
- `npm run build` - Сборка для продакшена
- `npm run db:generate` - Генерация миграций
- `npm run db:migrate` - Применение миграций
- `npm run db:studio` - Запуск Drizzle Studio
