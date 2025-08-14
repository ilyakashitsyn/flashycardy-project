import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "../src/db/schema";
import "dotenv/config";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

// Пример userId - замените на реальный Clerk userId
const userId = process.env.CLERK_USER_ID || "your_clerk_user_id_here";

async function seedDatabase() {
  try {
    console.log("🌱 Начинаю заполнение базы данных...");

    if (userId === "your_clerk_user_id_here") {
      console.log("⚠️  Установите переменную окружения CLERK_USER_ID");
      console.log("Пример: CLERK_USER_ID=user_abc123");
      process.exit(1);
    }

    console.log(`👤 Используется userId: ${userId}`);

    // Создаем первую колоду: English to Portuguese (Brazil)
    const deck1 = await db
      .insert(schema.decksTable)
      .values({
        name: "English to Portuguese (Brazil)",
        description:
          "Learn Portuguese (Brazil) from English - Basic vocabulary and common phrases",
        userId: userId,
      })
      .returning();

    console.log("✅ Создана колода:", deck1[0].name);

    // Карточки для первой колоды
    const cards1 = [
      { front: "Hello", back: "Olá" },
      { front: "Good morning", back: "Bom dia" },
      { front: "Good afternoon", back: "Boa tarde" },
      { front: "Good evening", back: "Boa noite" },
      { front: "Thank you", back: "Obrigado (m) / Obrigada (f)" },
      { front: "You're welcome", back: "De nada" },
      { front: "Please", back: "Por favor" },
      { front: "Sorry", back: "Desculpe" },
      { front: "Yes", back: "Sim" },
      { front: "No", back: "Não" },
      { front: "Water", back: "Água" },
      { front: "Food", back: "Comida" },
      { front: "House", back: "Casa" },
      { front: "Car", back: "Carro" },
      { front: "Book", back: "Livro" },
      { front: "Friend", back: "Amigo (m) / Amiga (f)" },
    ];

    for (const card of cards1) {
      await db.insert(schema.cardsTable).values({
        front: card.front,
        back: card.back,
        deckId: deck1[0].id,
      });
    }

    console.log(
      `✅ Добавлено ${cards1.length} карточек в колоду "${deck1[0].name}"`
    );

    // Создаем вторую колоду: Portuguese (Brazil) to English
    const deck2 = await db
      .insert(schema.decksTable)
      .values({
        name: "Portuguese (Brazil) to English",
        description:
          "Learn English from Portuguese (Brazil) - Reverse translation practice",
        userId: userId,
      })
      .returning();

    console.log("✅ Создана колода:", deck2[0].name);

    // Карточки для второй колоды
    const cards2 = [
      { front: "Olá", back: "Hello" },
      { front: "Bom dia", back: "Good morning" },
      { front: "Boa tarde", back: "Good afternoon" },
      { front: "Boa noite", back: "Good evening" },
      { front: "Obrigado", back: "Thank you (male)" },
      { front: "Obrigada", back: "Thank you (female)" },
      { front: "De nada", back: "You're welcome" },
      { front: "Por favor", back: "Please" },
      { front: "Desculpe", back: "Sorry" },
      { front: "Sim", back: "Yes" },
      { front: "Não", back: "No" },
      { front: "Água", back: "Water" },
      { front: "Comida", back: "Food" },
      { front: "Casa", back: "House" },
      { front: "Carro", back: "Car" },
      { front: "Livro", back: "Book" },
    ];

    for (const card of cards2) {
      await db.insert(schema.cardsTable).values({
        front: card.front,
        back: card.back,
        deckId: deck2[0].id,
      });
    }

    console.log(
      `✅ Добавлено ${cards2.length} карточек в колоду "${deck2[0].name}"`
    );

    console.log("🎉 База данных успешно заполнена!");
    console.log(
      `📊 Создано 2 колоды с ${cards1.length + cards2.length} карточками`
    );
    console.log("💡 Теперь вы можете войти в приложение и увидеть свои колоды");
  } catch (error) {
    console.error("❌ Ошибка при заполнении базы данных:", error);
    process.exit(1);
  }
}

seedDatabase();
