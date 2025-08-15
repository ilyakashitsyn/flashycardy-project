"use client";

import { useEffect, useState } from "react";
import { DeckCard } from "@/components/ui/deck-card";
import { CreateDeckDialog } from "@/components/ui/create-deck-dialog";
import { Loader2, BookOpen } from "lucide-react";

// Отключаем prerendering для этой страницы
export const dynamic = "force-dynamic";

interface Deck {
  id: number;
  name: string;
  description?: string;
  cardCount: number;
  createdAt: string;
  updatedAt: string;
  progress: {
    studied: number;
    total: number;
    percentage: number;
  };
}

export default function DashboardPage() {
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

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Неизвестная дата";
      }
      return date.toLocaleDateString("ru-RU");
    } catch {
      return "Неизвестная дата";
    }
  };

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
          </p>
        </div>
        <CreateDeckDialog
          onDeckCreated={(deck) => setDecks([...decks, deck])}
        />
      </div>

      {decks.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
            <BookOpen className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">
            У вас пока нет колод
          </h3>
          <p className="text-muted-foreground mb-4">
            Создайте свою первую колоду карточек для изучения
          </p>
          <CreateDeckDialog
            onDeckCreated={(deck) => setDecks([...decks, deck])}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {decks.map((deck) => (
            <DeckCard
              key={deck.id}
              deck={{
                ...deck,
                cardCount: deck.cardCount || 0,
                createdAt: new Date(deck.createdAt || Date.now()),
                progress: deck.progress || { studied: 0, total: 0, percentage: 0 },
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
