"use client";

import { useEffect, useState } from "react";
import { DeckCard } from "@/components/ui/deck-card";
import { CreateDeckDialog } from "@/components/ui/create-deck-dialog";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Deck {
  id: number;
  name: string;
  description?: string;
  emoji?: string;
  cardCount: number;
  createdAt: string;
  updatedAt: string;
  progress: {
    studied: number;
    total: number;
    percentage: number;
  };
}

interface DashboardClientProps {
  hasProPlan: boolean;
  hasUnlimitedDecks: boolean;
  hasDeckLimit: boolean;
}

export function DashboardClient({
  hasProPlan,
  hasUnlimitedDecks,
  hasDeckLimit,
}: DashboardClientProps) {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDecks();
  }, []);

  const fetchDecks = async () => {
    try {
      const response = await fetch("/api/decks");
      if (response.ok) {
        const data = await response.json();
        setDecks(data);
      }
    } catch (error) {
      console.error("Error fetching decks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeckCreated = (deck: Deck) => {
    setDecks([...decks, deck]);
  };

  const canCreateDeck = hasUnlimitedDecks || (hasDeckLimit && decks.length < 3);
  const showUpgradePrompt = !hasUnlimitedDecks && decks.length >= 3;

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Мои колоды</h1>
          <p className="text-muted-foreground mt-2">
            Управляйте своими колодами карточек
            {hasDeckLimit && !hasUnlimitedDecks && (
              <span className="block text-sm">
                {decks.length}/3 колод в бесплатном плане
              </span>
            )}
          </p>
        </div>
        {canCreateDeck && (
          <CreateDeckDialog onDeckCreated={handleDeckCreated} />
        )}
      </div>

      {showUpgradePrompt && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                Достигнут лимит колод
              </h3>
              <p className="text-blue-700 dark:text-blue-300">
                В бесплатном плане доступно только 3 колоды. Обновитесь до Pro
                для неограниченного количества.
              </p>
            </div>
            <Link href="/pricing">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Обновить план
              </Button>
            </Link>
          </div>
        </div>
      )}

      {decks.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
            <div className="text-4xl">📚</div>
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">
            У вас пока нет колод
          </h3>
          <p className="text-muted-foreground mb-4">
            Создайте свою первую колоду карточек для изучения
          </p>
          {canCreateDeck && (
            <CreateDeckDialog onDeckCreated={handleDeckCreated} />
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {decks.map((deck) => (
            <DeckCard
              key={deck.id}
              deck={{
                ...deck,
                cardCount: deck.cardCount || 0,
                emoji: deck.emoji || "📚",
                createdAt: new Date(deck.createdAt || Date.now()),
                progress: deck.progress || {
                  studied: 0,
                  total: 0,
                  percentage: 0,
                },
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
