import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { cardsTable, decksTable } from "@/db/schema";
import { and, eq, inArray } from "drizzle-orm";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ deckId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolved = await params;
    const deckId = parseInt(resolved.deckId);
    if (isNaN(deckId)) {
      return NextResponse.json({ error: "Invalid deck ID" }, { status: 400 });
    }

    const body = await request.json();
    const cardIds: number[] = Array.isArray(body?.cardIds) ? body.cardIds : [];
    if (cardIds.length === 0) {
      return NextResponse.json(
        { error: "cardIds is required" },
        { status: 400 }
      );
    }

    // Ensure deck ownership by user via join constraint in delete selection
    // We delete only cards that belong to the specified deck and to the user's deck
    // First, verify deck belongs to user
    const ownerDeck = await db
      .select({ id: decksTable.id })
      .from(decksTable)
      .where(and(eq(decksTable.id, deckId), eq(decksTable.userId, userId)))
      .limit(1);

    if (ownerDeck.length === 0) {
      return NextResponse.json({ error: "Deck not found" }, { status: 404 });
    }

    await db
      .delete(cardsTable)
      .where(
        and(eq(cardsTable.deckId, deckId), inArray(cardsTable.id, cardIds))
      );

    return NextResponse.json({ success: true, deleted: cardIds.length });
  } catch (error) {
    console.error("Error bulk deleting cards:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
