"use client";

import { useEffect, useState } from "react";
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
  CheckCircle,
  Circle,
} from "lucide-react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

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
  const deckId = params.deckId as string;
  const [deck, setDeck] = useState<Deck | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (deckId && !isNaN(Number(deckId))) {
      fetchDeck();
    } else {
      setError("Неверный ID колоды");
      setLoading(false);
    }
  }, [deckId]);

  const fetchDeck = async () => {
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
              <Button asChild size="lg" variant="outline" className="flex-1">
                <Link href={`/decks/${deck.id}/edit`}>
                  <Plus className="h-5 w-5 mr-2" />
                  Редактировать
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Список всех карточек */}
      <div className="max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">Все карточки в колоде</h2>
        <div className="space-y-4">
          {deck.cards.map((card, index) => (
            <Card key={card.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {card.progress?.isKnown ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div>
                      <p className="font-medium text-foreground">
                        {card.front}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {card.back}
                      </p>
                    </div>
                    {card.progress && (
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Просмотров: {card.progress.reviewCount}</span>
                        {card.progress.lastReviewed && (
                          <span>
                            Последний раз:{" "}
                            {formatDate(card.progress.lastReviewed)}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    #{index + 1}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
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
