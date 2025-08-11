# База данных FlashyCardy

## Настройка

Проект использует Drizzle ORM с PostgreSQL на Neon.

### Переменные окружения

Добавьте в файл `.env`:

```env
DATABASE_URL=postgresql://neondb_owner:npg_FGcaOSZ7w8Jj@ep-weathered-math-ac5ys9cp-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

### Команды для работы с БД

```bash
# Генерация миграций
npm run db:generate

# Применение изменений к БД
npm run db:push

# Применение миграций
npm run db:migrate

# Открытие Drizzle Studio
npm run db:studio
```

## Структура базы данных

### Таблицы

- `users` - пользователи
- `decks` - колоды карточек
- `cards` - карточки
- `study_sessions` - сессии изучения
- `card_progress` - прогресс по карточкам

### Использование в коде

```typescript
import { db } from "@/db";
import { usersTable, decksTable, cardsTable } from "@/db/schema";

// Получение всех пользователей
const users = await db.select().from(usersTable);

// Создание нового пользователя
const newUser = await db
  .insert(usersTable)
  .values({
    name: "John Doe",
    email: "john@example.com",
  })
  .returning();
```
