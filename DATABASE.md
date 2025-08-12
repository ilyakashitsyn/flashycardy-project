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

# Заполнение БД примерами колод
npm run db:seed
```

## Структура базы данных

### Таблицы

- `decks` - колоды карточек (с Clerk user ID)
- `cards` - карточки для изучения
- `study_sessions` - сессии изучения
- `card_progress` - прогресс по карточкам

### Примеры колод

В базе данных созданы 2 примера колод для изучения португальского языка:

1. **English to Portuguese (Brazil)** - 16 карточек
2. **Portuguese (Brazil) to English** - 16 карточек

Колоды автоматически создаются для пользователя: `user_317c3rTqJ1vaBpbHTWr2IrCJLTf`

### Использование в коде

```typescript
import { db } from "@/db";
import { decksTable, cardsTable } from "@/db/schema";

// Получение всех колод пользователя
const userDecks = await db
  .select()
  .from(decksTable)
  .where(eq(decksTable.userId, "user_317c3rTqJ1vaBpbHTWr2IrCJLTf"));

// Создание новой колоды
const newDeck = await db
  .insert(decksTable)
  .values({
    name: "My New Deck",
    description: "Description of the deck",
    userId: "user_317c3rTqJ1vaBpbHTWr2IrCJLTf",
  })
  .returning();

// Получение карточек колоды
const deckCards = await db
  .select()
  .from(cardsTable)
  .where(eq(cardsTable.deckId, deckId));
```
