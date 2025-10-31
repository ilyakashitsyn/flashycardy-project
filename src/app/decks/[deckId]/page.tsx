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
  Play,
  Plus,
  ArrowLeft,
  Grid3X3,
  List,
  Trash2,
  Sparkles,
  SquarePen,
} from "lucide-react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Progress } from "@/components/ui/progress";
import { FlashcardItem } from "@/components/ui/flashcard-item";
import { LazyAddCardDialog } from "@/components/lazy/index";
import { LazyEditDeckDialog } from "@/components/lazy/index";
import { useAuth } from "@clerk/nextjs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  emoji?: string;
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
  const { has } = useAuth();
  const deckId = params.deckId as string;
  const [deck, setDeck] = useState<Deck | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isGridView, setIsGridView] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  const fetchDeck = useCallback(async () => {
    try {
      setError(null);
      const response = await fetch(`/api/decks/${deckId}`);
      if (response.ok) {
        const data = await response.json();
        setDeck(data);
      } else {
        setError("Failed to load deck");
      }
    } catch (error) {
      console.error("Error fetching deck:", error);
      setError("An error occurred while loading");
    } finally {
      setLoading(false);
    }
  }, [deckId]);

  useEffect(() => {
    if (deckId && !isNaN(Number(deckId))) {
      fetchDeck();
    } else {
      setError("Invalid deck ID");
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
    if (!confirm("Are you sure you want to delete this card?")) {
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
        `Are you sure you want to delete deck "${deck.name}"? This action cannot be undone.`
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

  const handleGenerateWithAI = async () => {
    if (!deck) return;

    setIsGenerating(true);
    try {
      const response = await fetch(`/api/decks/${deck.id}/generate-ai`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: deck.name,
          description: deck.description || "",
        }),
      });

      if (response.ok) {
        const { cards, message } = await response.json();

        // Проверяем, использовались ли fallback карточки
        const isFallback = cards.__fallback;
        const errorMessage = cards.__error;

        // Убираем метаданные из карточек
        const cleanCards = cards.filter((card: any) => !card.__fallback);

        // Обновляем локальное состояние
        setDeck({
          ...deck,
          cards: [...deck.cards, ...cleanCards],
          cardCount: deck.cardCount + cleanCards.length,
          progress: {
            ...deck.progress,
            total: deck.progress.total + cleanCards.length,
            percentage: Math.round(
              (deck.progress.studied /
                (deck.progress.total + cleanCards.length)) *
                100
            ),
          },
        });

        // Показываем уведомление пользователю
        if (isFallback) {
          alert(
            `Generated ${cleanCards.length} basic cards. AI generation failed: ${errorMessage}. You can try again later.`
          );
        } else {
          alert(
            `Successfully generated ${cleanCards.length} AI-powered cards!`
          );
        }
      } else {
        console.error("Failed to generate AI cards");
        alert("Failed to generate cards. Please try again.");
      }
    } catch (error) {
      console.error("Error generating AI cards:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUpgradeClick = () => {
    router.push("/pricing");
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Unknown date";
      }
      return date.toLocaleDateString("en-US");
    } catch {
      return "Unknown date";
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
            {error || "Deck not found"}
          </h3>
          <Link href="/dashboard">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
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
            Back to Dashboard
          </Button>
        </Link>
      </div>

      <Card className="max-w-4xl mx-auto mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            {deck.emoji && <span className="text-3xl">{deck.emoji}</span>}
            {deck.name || "Untitled"}
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
                {deck.cardCount || 0} cards
              </span>
              <span className="text-sm text-muted-foreground">
                Created: {formatDate(deck.createdAt)}
              </span>
            </div>

            {/* Study progress */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Study progress</span>
                <span className="text-lg font-bold text-primary">
                  {deck.progress.percentage}%
                </span>
              </div>
              <Progress value={deck.progress.percentage} className="h-3" />
              <div className="text-sm text-muted-foreground text-center">
                {deck.progress.studied} of {deck.progress.total} cards studied
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button asChild size="lg" className="flex-1">
                <Link href={`/decks/${deck.id}/study`}>
                  <Play className="h-5 w-5 mr-2" />
                  Study
                </Link>
              </Button>
              <div className="flex gap-2 flex-1">
                <LazyEditDeckDialog
                  deck={deck}
                  onDeckUpdated={handleDeckUpdated}
                  trigger={
                    <Button size="lg" variant="outline" className="flex-1">
                      <SquarePen className="h-5 w-5 mr-2" />
                      Edit
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

      {/* List of all cards */}
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-foreground">Cards</h2>
          <div className="flex items-center gap-2">
            <LazyAddCardDialog
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

            {has?.({ feature: "ai_flashcard_generation" }) ? (
              deck.name && deck.description ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleGenerateWithAI}
                  disabled={isGenerating}
                  className="flex items-center gap-2"
                >
                  {isGenerating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )}
                  {isGenerating ? "Generating..." : "Generate with AI"}
                </Button>
              ) : (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="inline-block">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2 opacity-50 cursor-not-allowed"
                        >
                          <Sparkles className="h-4 w-4" />
                          Generate with AI
                        </Button>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        Add a description to your deck first to enable AI
                        generation
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )
            ) : (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleUpgradeClick}
                      className="flex items-center gap-2"
                    >
                      <Sparkles className="h-4 w-4" />
                      Generate with AI
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>AI generation is available in Pro plan</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsGridView(!isGridView)}
              className="flex items-center gap-2"
            >
              {isGridView ? (
                <>
                  <List className="h-4 w-4" />
                  List
                </>
              ) : (
                <>
                  <Grid3X3 className="h-4 w-4" />
                  Grid
                </>
              )}
            </Button>
          </div>
        </div>

        {deck.cards.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-4">
            <LazyAddCardDialog
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
