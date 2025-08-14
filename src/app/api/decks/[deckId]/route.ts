import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { decksTable, cardsTable } from "@/db/schema";
import { eq, count } from "drizzle-orm";

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

    const deck = await db.query.decksTable.findFirst({
      where: eq(decksTable.id, deckId),
    });

    if (!deck) {
      return NextResponse.json({ error: "Deck not found" }, { status: 404 });
    }

    // Проверяем что колода принадлежит пользователю
    if (deck.userId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Получаем количество карточек в колоде
    const cardCountResult = await db
      .select({ count: count() })
      .from(cardsTable)
      .where(eq(cardsTable.deckId, deckId));

    const cardCount = cardCountResult[0]?.count || 0;

    return NextResponse.json({
      ...deck,
      cardCount,
    });
  } catch (error) {
    console.error("Error fetching deck:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
