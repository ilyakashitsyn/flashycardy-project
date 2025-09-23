"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { DeckCard } from "@/components/ui/deck-card";
import { LazyCreateDeckDialog } from "@/components/lazy/index";
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

  const fetchDecks = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    fetchDecks();
  }, [fetchDecks]);

  const handleDeckCreated = useCallback((deck: Deck) => {
    setDecks((prevDecks) => [...prevDecks, deck]);
  }, []);

  const canCreateDeck = useMemo(
    () => hasUnlimitedDecks || (hasDeckLimit && decks.length < 3),
    [hasUnlimitedDecks, hasDeckLimit, decks.length]
  );

  const showUpgradePrompt = useMemo(
    () => !hasUnlimitedDecks && decks.length >= 3,
    [hasUnlimitedDecks, decks.length]
  );

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
          <h1 className="text-3xl font-bold text-foreground">My Decks</h1>
          <p className="text-muted-foreground mt-2">
            Manage your flashcard decks
            {hasDeckLimit && !hasUnlimitedDecks && (
              <span className="block text-sm">
                {decks.length}/3 decks in free plan
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {hasProPlan && (
            <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-lg shadow-lg">
              <i className="fa-solid fa-crown text-sm"></i>
              <span className="text-sm font-medium">Pro Plan</span>
            </div>
          )}
          {canCreateDeck && (
            <LazyCreateDeckDialog onDeckCreated={handleDeckCreated} />
          )}
        </div>
      </div>

      {showUpgradePrompt && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                Deck limit reached
              </h3>
              <p className="text-blue-700 dark:text-blue-300">
                Only 3 decks available in the free plan. Upgrade to Pro for
                unlimited decks.
              </p>
            </div>
            <Link href="/pricing">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Upgrade Plan
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
            You don&apos;t have any decks yet
          </h3>
          <p className="text-muted-foreground mb-4">
            Create your first flashcard deck to start learning
          </p>
          <div className="flex items-center justify-center gap-3">
            {hasProPlan && (
              <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-lg shadow-lg">
                <i className="fa-solid fa-crown text-sm"></i>
                <span className="text-sm font-medium">Pro Plan</span>
              </div>
            )}
            {canCreateDeck && (
              <LazyCreateDeckDialog onDeckCreated={handleDeckCreated} />
            )}
          </div>
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
