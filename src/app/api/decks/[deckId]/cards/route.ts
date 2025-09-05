import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { cardsTable, decksTable } from "@/db/schema";
import { eq, and } from "drizzle-orm";

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

    const { front, back } = await request.json();

    if (!front || !back) {
      return NextResponse.json(
        { error: "Front and back are required" },
        { status: 400 }
      );
    }

    // Проверяем, что колода принадлежит пользователю
    const deck = await db
      .select()
      .from(decksTable)
      .where(and(eq(decksTable.id, deckId), eq(decksTable.userId, userId)))
      .limit(1);

    if (deck.length === 0) {
      return NextResponse.json({ error: "Deck not found" }, { status: 404 });
    }

    // Создаем новую карточку
    const newCard = await db
      .insert(cardsTable)
      .values({
        front,
        back,
        deckId,
      })
      .returning();

    return NextResponse.json(newCard[0], { status: 201 });
  } catch (error) {
    console.error("Error creating card:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
