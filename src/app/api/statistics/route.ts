import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { cardProgressTable } from "@/db/schema";
import { eq, count, and } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Получаем количество правильных ответов (isKnown: true)
    const correctResult = await db
      .select({ count: count() })
      .from(cardProgressTable)
      .where(
        and(
          eq(cardProgressTable.userId, userId),
          eq(cardProgressTable.isKnown, true)
        )
      );

    // Получаем количество неправильных ответов (isKnown: false)
    const incorrectResult = await db
      .select({ count: count() })
      .from(cardProgressTable)
      .where(
        and(
          eq(cardProgressTable.userId, userId),
          eq(cardProgressTable.isKnown, false)
        )
      );

    const correct = correctResult[0]?.count || 0;
    const incorrect = incorrectResult[0]?.count || 0;
    const total = correct + incorrect;

    return NextResponse.json({
      correct,
      incorrect,
      total,
    });
  } catch (error) {
    console.error("Error fetching statistics:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
