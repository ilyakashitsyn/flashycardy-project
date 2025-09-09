import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import {
  decksTable,
  cardsTable,
  cardProgressTable,
  studySessionsTable,
} from "@/db/schema";
import { eq, and } from "drizzle-orm";

// Start study session
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ deckId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await params;
    const deckId = parseInt(resolvedParams.deckId);
    if (isNaN(deckId)) {
      return NextResponse.json({ error: "Invalid deck ID" }, { status: 400 });
    }

    // Check that deck belongs to user
    const deck = await db
      .select()
      .from(decksTable)
      .where(and(eq(decksTable.id, deckId), eq(decksTable.userId, userId)))
      .limit(1);

    if (deck.length === 0) {
      return NextResponse.json({ error: "Deck not found" }, { status: 404 });
    }

    // Get all deck cards
    const cards = await db
      .select()
      .from(cardsTable)
      .where(eq(cardsTable.deckId, deckId));

    if (cards.length === 0) {
      return NextResponse.json({ error: "No cards in deck" }, { status: 400 });
    }

    // Создаем новую сессию изучения
    const session = await db
      .insert(studySessionsTable)
      .values({
        userId,
        deckId,
        startedAt: new Date(),
      })
      .returning();

    // Возвращаем карточки в случайном порядке
    const shuffledCards = [...cards].sort(() => Math.random() - 0.5);

    return NextResponse.json({
      sessionId: session[0].id,
      deckName: deck[0].name,
      cards: shuffledCards,
    });
  } catch (error) {
    console.error("Error starting study session:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Завершить сессию изучения и обновить прогресс
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ deckId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await params;
    const deckId = parseInt(resolvedParams.deckId);
    if (isNaN(deckId)) {
      return NextResponse.json({ error: "Invalid deck ID" }, { status: 400 });
    }

    const { sessionId, results } = await request.json();

    if (!sessionId || !results || !Array.isArray(results)) {
      return NextResponse.json(
        { error: "Session ID and results are required" },
        { status: 400 }
      );
    }

    // Завершаем сессию
    await db
      .update(studySessionsTable)
      .set({ endedAt: new Date() })
      .where(
        and(
          eq(studySessionsTable.id, sessionId),
          eq(studySessionsTable.userId, userId)
        )
      );

    // Обновляем прогресс для каждой карточки
    for (const result of results) {
      const { cardId, isCorrect } = result;

      // Проверяем существующий прогресс
      const existingProgress = await db
        .select()
        .from(cardProgressTable)
        .where(
          and(
            eq(cardProgressTable.cardId, cardId),
            eq(cardProgressTable.userId, userId)
          )
        )
        .limit(1);

      if (existingProgress.length > 0) {
        // Обновляем существующий прогресс
        await db
          .update(cardProgressTable)
          .set({
            isKnown: isCorrect,
            lastReviewed: new Date(),
            reviewCount: existingProgress[0].reviewCount + 1,
          })
          .where(
            and(
              eq(cardProgressTable.cardId, cardId),
              eq(cardProgressTable.userId, userId)
            )
          );
      } else {
        // Создаем новый прогресс
        await db.insert(cardProgressTable).values({
          userId,
          cardId,
          isKnown: isCorrect,
          lastReviewed: new Date(),
          reviewCount: 1,
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error ending study session:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
