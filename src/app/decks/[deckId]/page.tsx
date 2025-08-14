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
import { BookOpen, Play, Plus, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Loader2 } from "lucide-react";

interface Deck {
  id: number;
  name: string;
  description?: string;
  cardCount: number;
  createdAt: string;
  updatedAt: string;
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

      <Card className="max-w-2xl mx-auto">
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
