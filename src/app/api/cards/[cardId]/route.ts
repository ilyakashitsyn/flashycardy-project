import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { cardsTable, decksTable } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ cardId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await params;
    const cardId = parseInt(resolvedParams.cardId);
    if (isNaN(cardId)) {
      return NextResponse.json({ error: "Invalid card ID" }, { status: 400 });
    }

    const { front, back } = await request.json();

    if (!front || !back) {
      return NextResponse.json(
        { error: "Front and back are required" },
        { status: 400 }
      );
    }

    // Проверяем, что карточка принадлежит пользователю
    const card = await db
      .select()
      .from(cardsTable)
      .innerJoin(decksTable, eq(cardsTable.deckId, decksTable.id))
      .where(and(eq(cardsTable.id, cardId), eq(decksTable.userId, userId)))
      .limit(1);

    if (card.length === 0) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 });
    }

    // Обновляем карточку
    const updatedCard = await db
      .update(cardsTable)
      .set({
        front,
        back,
        updatedAt: new Date(),
      })
      .where(eq(cardsTable.id, cardId))
      .returning();

    return NextResponse.json(updatedCard[0]);
  } catch (error) {
    console.error("Error updating card:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ cardId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await params;
    const cardId = parseInt(resolvedParams.cardId);
    if (isNaN(cardId)) {
      return NextResponse.json({ error: "Invalid card ID" }, { status: 400 });
    }

    // Проверяем, что карточка принадлежит пользователю
    const card = await db
      .select()
      .from(cardsTable)
      .innerJoin(decksTable, eq(cardsTable.deckId, decksTable.id))
      .where(and(eq(cardsTable.id, cardId), eq(decksTable.userId, userId)))
      .limit(1);

    if (card.length === 0) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 });
    }

    // Удаляем карточку
    await db.delete(cardsTable).where(eq(cardsTable.id, cardId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting card:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Добавляем GET метод для совместимости с Next.js 15
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ cardId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await params;
    const cardId = parseInt(resolvedParams.cardId);
    if (isNaN(cardId)) {
      return NextResponse.json({ error: "Invalid card ID" }, { status: 400 });
    }

    // Получаем карточку
    const card = await db
      .select()
      .from(cardsTable)
      .innerJoin(decksTable, eq(cardsTable.deckId, decksTable.id))
      .where(and(eq(cardsTable.id, cardId), eq(decksTable.userId, userId)))
      .limit(1);

    if (card.length === 0) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 });
    }

    return NextResponse.json(card[0]);
  } catch (error) {
    console.error("Error fetching card:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
