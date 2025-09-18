import { DeckCard } from "@/components/ui/deck-card";
import { LazyCreateDeckDialog } from "@/components/lazy/index";
import { auth } from "@clerk/nextjs/server";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DashboardClient } from "./dashboard-client";

// Отключаем prerendering для этой страницы
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const { has } = await auth();
  const hasProPlan = has({ plan: "pro_plan" });
  const hasUnlimitedDecks = has({ feature: "unlimited_decks" });
  const hasDeckLimit = has({ feature: "3_deck_limit" });

  return (
    <DashboardClient
      hasProPlan={hasProPlan}
      hasUnlimitedDecks={hasUnlimitedDecks}
      hasDeckLimit={hasDeckLimit}
    />
  );
}
