"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { ProtectedRoute } from "@/components/ui/protected-route";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BookOpen,
  Play,
  Plus,
  ArrowLeft,
  Grid3X3,
  List,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Progress } from "@/components/ui/progress";
import { FlashcardItem } from "@/components/ui/flashcard-item";
import { AddCardDialog } from "@/components/ui/add-card-dialog";
import { EditDeckDialog } from "@/components/ui/edit-deck-dialog";

interface Card {
  id: number;
  front: string;
  back: string;
  progress: {
    isKnown: boolean;
    lastReviewed: string;
    reviewCount: number;
  } | null;
}

interface Deck {
  id: number;
  name: string;
  description?: string;
  cards: Card[];
  cardCount: number;
  createdAt: string;
  updatedAt: string;
  progress: {
    studied: number;
    total: number;
    percentage: number;
  };
}

function DeckPageContent() {
  const params = useParams();
  const router = useRouter();
  const deckId = params.deckId as string;
  const [deck, setDeck] = useState<Deck | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isGridView, setIsGridView] = useState(true);

  const fetchDeck = useCallback(async () => {
    try {
      setError(null);
      const response = await fetch(`/api/decks/${deckId}`);
      if (response.ok) {
        const data = await response.json();
        setDeck(data);
      } else {
        setError("Не удалось загрузить колоду");
      }
    } catch (error) {
      console.error("Error fetching deck:", error);
      setError("Произошла ошибка при загрузке");
    } finally {
      setLoading(false);
    }
  }, [deckId]);

  useEffect(() => {
    if (deckId && !isNaN(Number(deckId))) {
      fetchDeck();
    } else {
      setError("Неверный ID колоды");
      setLoading(false);
    }
  }, [deckId, fetchDeck]);

  const handleEditCard = async (
    cardId: number,
    front: string,
    back: string
  ) => {
    try {
      const response = await fetch(`/api/cards/${cardId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ front, back }),
      });

      if (response.ok) {
        // Обновляем локальное состояние
        if (deck) {
          setDeck({
            ...deck,
            cards: deck.cards.map((card) =>
              card.id === cardId ? { ...card, front, back } : card
            ),
          });
        }
      }
    } catch (error) {
      console.error("Error updating card:", error);
    }
  };

  const handleDeleteCard = async (cardId: number) => {
    if (!confirm("Вы уверены, что хотите удалить эту карточку?")) {
      return;
    }

    try {
      const response = await fetch(`/api/cards/${cardId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Обновляем локальное состояние
        if (deck) {
          setDeck({
            ...deck,
            cards: deck.cards.filter((card) => card.id !== cardId),
            cardCount: deck.cardCount - 1,
            progress: {
              ...deck.progress,
              total: deck.progress.total - 1,
              percentage:
                deck.progress.total > 1
                  ? Math.round(
                      (deck.progress.studied / (deck.progress.total - 1)) * 100
                    )
                  : 0,
            },
          });
        }
      }
    } catch (error) {
      console.error("Error deleting card:", error);
    }
  };

  const handleCardAdded = (newCard: any) => {
    if (deck) {
      setDeck({
        ...deck,
        cards: [...deck.cards, newCard],
        cardCount: deck.cardCount + 1,
        progress: {
          ...deck.progress,
          total: deck.progress.total + 1,
          percentage: Math.round(
            (deck.progress.studied / (deck.progress.total + 1)) * 100
          ),
        },
      });
    }
  };

  const handleDeckUpdated = (updatedDeck: any) => {
    if (deck) {
      setDeck({
        ...deck,
        name: updatedDeck.name,
        description: updatedDeck.description,
        updatedAt: updatedDeck.updatedAt,
      });
    }
  };

  const handleDeleteDeck = async () => {
    if (!deck) return;

    if (
      !confirm(
        `Вы уверены, что хотите удалить колоду "${deck.name}"? Это действие нельзя отменить.`
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/decks/${deck.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.push("/dashboard");
      } else {
        console.error("Failed to delete deck");
      }
    } catch (error) {
      console.error("Error deleting deck:", error);
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

  if (error || !deck) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-foreground mb-2">
            {error || "Колода не найдена"}
          </h3>
          <Link href="/dashboard">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Вернуться к панели
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/dashboard">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Назад к панели
          </Button>
        </Link>
      </div>

      <Card className="max-w-4xl mx-auto mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <BookOpen className="h-6 w-6 text-primary" />
            {deck.name || "Без названия"}
          </CardTitle>
          {deck.description && (
            <CardDescription className="text-lg">
              {deck.description}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <span className="text-lg font-medium">
                {deck.cardCount || 0} карточек
              </span>
              <span className="text-sm text-muted-foreground">
                Создано: {formatDate(deck.createdAt)}
              </span>
            </div>

            {/* Прогресс изучения */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Прогресс изучения</span>
                <span className="text-lg font-bold text-primary">
                  {deck.progress.percentage}%
                </span>
              </div>
              <Progress value={deck.progress.percentage} className="h-3" />
              <div className="text-sm text-muted-foreground text-center">
                {deck.progress.studied} из {deck.progress.total} карточек
                изучено
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button asChild size="lg" className="flex-1">
                <Link href={`/decks/${deck.id}/study`}>
                  <Play className="h-5 w-5 mr-2" />
                  Изучать
                </Link>
              </Button>
              <div className="flex gap-2 flex-1">
                <EditDeckDialog
                  deck={deck}
                  onDeckUpdated={handleDeckUpdated}
                  trigger={
                    <Button size="lg" variant="outline" className="flex-1">
                      <Plus className="h-5 w-5 mr-2" />
                      Редактировать
                    </Button>
                  }
                />
                <Button
                  size="lg"
                  variant="destructive"
                  onClick={handleDeleteDeck}
                  className="px-4"
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Список всех карточек */}
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-foreground">Cards</h2>
          <div className="flex items-center gap-2">
            <AddCardDialog
              deckId={deck.id}
              onCardAdded={handleCardAdded}
              trigger={
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Card
                </Button>
              }
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsGridView(!isGridView)}
              className="flex items-center gap-2"
            >
              {isGridView ? (
                <>
                  <List className="h-4 w-4" />
                  Список
                </>
              ) : (
                <>
                  <Grid3X3 className="h-4 w-4" />
                  Сетка
                </>
              )}
            </Button>
          </div>
        </div>

        {deck.cards.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-4">
            <AddCardDialog
              deckId={deck.id}
              onCardAdded={handleCardAdded}
              trigger={
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center cursor-pointer hover:bg-muted/80 transition-colors">
                  <Plus className="h-8 w-8 text-muted-foreground" />
                </div>
              }
            />
            <div className="text-center">
              <h3 className="text-xl font-medium text-foreground mb-2">
                No cards yet
              </h3>
              <p className="text-muted-foreground">
                Add your first flashcard to start studying
              </p>
            </div>
          </div>
        ) : (
          <div
            className={
              isGridView
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-6"
            }
          >
            {deck.cards.map((card) => (
              <FlashcardItem
                key={card.id}
                card={card}
                onEdit={handleEditCard}
                onDelete={handleDeleteCard}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function DeckPage() {
  return (
    <ProtectedRoute>
      <DeckPageContent />
    </ProtectedRoute>
  );
}
