import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { decksTable, cardsTable } from "@/db/schema";
import { eq, count } from "drizzle-orm";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Получаем колоды только для текущего пользователя
    const userDecks = await db
      .select({
        id: decksTable.id,
        name: decksTable.name,
        description: decksTable.description,
        createdAt: decksTable.createdAt,
        updatedAt: decksTable.updatedAt,
      })
      .from(decksTable)
      .where(eq(decksTable.userId, userId));

    // Получаем количество карточек для каждой колоды
    const decksWithCardCount = await Promise.all(
      userDecks.map(async (deck) => {
        const cardCountResult = await db
          .select({ count: count() })
          .from(cardsTable)
          .where(eq(cardsTable.deckId, deck.id));

        return {
          ...deck,
          cardCount: cardCountResult[0]?.count || 0,
        };
      })
    );

    return NextResponse.json(decksWithCardCount);
  } catch (error) {
    console.error("Error fetching decks:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, description } = await request.json();

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    // Создаем колоду для текущего пользователя
    const newDeck = await db
      .insert(decksTable)
      .values({
        name,
        description,
        userId: userId,
      })
      .returning();

    return NextResponse.json(newDeck[0], { status: 201 });
  } catch (error) {
    console.error("Error creating deck:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
