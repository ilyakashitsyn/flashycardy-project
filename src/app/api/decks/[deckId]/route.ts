import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { decksTable, cardsTable, cardProgressTable } from "@/db/schema";
import { eq, and, count } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: { deckId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const deckId = parseInt(params.deckId);
    if (isNaN(deckId)) {
      return NextResponse.json({ error: "Invalid deck ID" }, { status: 400 });
    }

    // Получаем колоду
    const deck = await db
      .select()
      .from(decksTable)
      .where(and(eq(decksTable.id, deckId), eq(decksTable.userId, userId)))
      .limit(1);

    if (deck.length === 0) {
      return NextResponse.json({ error: "Deck not found" }, { status: 404 });
    }

    // Получаем все карточки колоды
    const cards = await db
      .select()
      .from(cardsTable)
      .where(eq(cardsTable.deckId, deckId));

    // Получаем прогресс изучения для каждой карточки
    const progressPromises = cards.map(async (card) => {
      const progress = await db
        .select()
        .from(cardProgressTable)
        .where(
          and(
            eq(cardProgressTable.cardId, card.id),
            eq(cardProgressTable.userId, userId)
          )
        )
        .limit(1);

      return {
        ...card,
        progress: progress[0] || null,
      };
    });

    const cardsWithProgress = await Promise.all(progressPromises);

    // Вычисляем общий прогресс
    const totalCards = cards.length;
    const studiedCards = cardsWithProgress.filter(
      (card) => card.progress?.isKnown
    ).length;
    const progressPercentage =
      totalCards > 0 ? Math.round((studiedCards / totalCards) * 100) : 0;

    return NextResponse.json({
      ...deck[0],
      cards: cardsWithProgress,
      cardCount: totalCards,
      progress: {
        studied: studiedCards,
        total: totalCards,
        percentage: progressPercentage,
      },
    });
  } catch (error) {
    console.error("Error fetching deck:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
