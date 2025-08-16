import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { sql } from "drizzle-orm";
import * as schema from "../src/db/schema";
import "dotenv/config";

const client = neon(process.env.DATABASE_URL!);
const db = drizzle(client, { schema });

async function clearTestData() {
  try {
    console.log("🧹 Начинаю очистку тестовых данных...");

    // Удаляем все колоды с именем "Test Deck" или похожими
    const testDecks = await db
      .delete(schema.decksTable)
      .where(
        sql`${schema.decksTable.name} ILIKE '%test%' OR ${schema.decksTable.name} ILIKE '%Test%'`
      )
      .returning();

    console.log(`✅ Удалено ${testDecks.length} тестовых колод`);

    // Удаляем все колоды с временным userId
    const tempDecks = await db
      .delete(schema.decksTable)
      .where(sql`${schema.decksTable.userId} = 'temp-user'`)
      .returning();

    console.log(`✅ Удалено ${tempDecks.length} временных колод`);

    // Удаляем все колоды с тестовым userId из seed скрипта
    const seedDecks = await db
      .delete(schema.decksTable)
      .where(sql`${schema.decksTable.userId} = 'user_317c3rTqJ1vaBpbHTWr2IrCJLTf'`)
      .returning();

    console.log(`✅ Удалено ${seedDecks.length} seed колод`);

    console.log("🎉 Очистка тестовых данных завершена!");
  } catch (error) {
    console.error("❌ Ошибка при очистке данных:", error);
    process.exit(1);
  }
}

clearTestData();
