"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/ui/protected-route";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { StudyCard } from "@/components/ui/study-card";
import { StudyResults } from "@/components/ui/study-results";
import {
  ArrowLeft,
  Shuffle,
  SkipBack,
  RefreshCw,
  XCircle,
  CheckCircle,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Card {
  id: number;
  front: string;
  back: string;
}

interface StudySession {
  sessionId: number;
  deckName: string;
  cards: Card[];
}

interface CardResult {
  cardId: number;
  isCorrect: boolean;
}

export default function StudyPage() {
  const params = useParams();
  const router = useRouter();
  const deckId = params.deckId as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [session, setSession] = useState<StudySession | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [results, setResults] = useState<CardResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [incorrect, setIncorrect] = useState(0);

  const startStudySession = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setResults([]);
      setCurrentCardIndex(0);
      setIsFlipped(false);
      setCorrect(0);
      setIncorrect(0);
      setShowResults(false);

      const response = await fetch(`/api/study/${deckId}`, {
        method: "POST",
      });

      if (response.ok) {
        const sessionData = await response.json();
        setSession(sessionData);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to start study session");
      }
    } catch (error) {
      console.error("Error starting study session:", error);
      setError("An error occurred while loading");
    } finally {
      setLoading(false);
    }
  }, [deckId]);

  useEffect(() => {
    if (deckId && !isNaN(Number(deckId))) {
      startStudySession();
    } else {
      setError("Invalid deck ID");
      setLoading(false);
    }
  }, [deckId, startStudySession]);

  const handleCardAnswer = (isCorrect: boolean) => {
    if (!session) return;

    const currentCard = session.cards[currentCardIndex];
    const newResult: CardResult = {
      cardId: currentCard.id,
      isCorrect,
    };

    setResults((prev) => [...prev, newResult]);

    if (isCorrect) {
      setCorrect((prev) => prev + 1);
    } else {
      setIncorrect((prev) => prev + 1);
    }

    // Move to next card or show results
    if (currentCardIndex < session.cards.length - 1) {
      setCurrentCardIndex((prev) => prev + 1);
      setIsFlipped(false);
    } else {
      finishStudySession([...results, newResult]);
    }
  };

  const finishStudySession = async (finalResults: CardResult[]) => {
    if (!session) return;

    try {
      await fetch(`/api/study/${deckId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId: session.sessionId,
          results: finalResults,
        }),
      });

      setShowResults(true);
    } catch (error) {
      console.error("Error finishing study session:", error);
      setShowResults(true); // Show results even if saving failed
    }
  };

  const handlePrevious = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex((prev) => prev - 1);
      setIsFlipped(false);

      // Remove last result
      const newResults = results.slice(0, -1);
      setResults(newResults);

      // Recalculate counters
      const lastResult = results[results.length - 1];
      if (lastResult?.isCorrect) {
        setCorrect((prev) => prev - 1);
      } else {
        setIncorrect((prev) => prev - 1);
      }
    }
  };

  const handleFlipCard = () => {
    setIsFlipped(true);
  };

  if (!deckId || isNaN(Number(deckId))) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-foreground mb-2">
            Invalid deck ID
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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-foreground mb-2">
            {error || "Failed to load study session"}
          </h3>
          <div className="space-x-4">
            <Button onClick={startStudySession}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
            <Link href={`/decks/${deckId}`}>
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Deck
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (showResults) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <StudyResults
            deckName={session.deckName}
            correct={correct}
            incorrect={incorrect}
            total={session.cards.length}
            onStudyAgain={startStudySession}
            onBackToDeck={() => router.push(`/decks/${deckId}`)}
          />
        </div>
      </ProtectedRoute>
    );
  }

  const currentCard = session.cards[currentCardIndex];
  const progress = ((currentCardIndex + 1) / session.cards.length) * 100;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="border-b border-border/50 bg-card/30 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link href={`/decks/${deckId}`}>
                  <Button variant="ghost" size="sm">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Deck
                  </Button>
                </Link>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-lg font-semibold text-foreground">
                  {session.deckName}
                </span>
                <Button variant="ghost" size="sm">
                  <Shuffle className="h-4 w-4 mr-2" />
                  Shuffle
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Progress and counters */}
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-4xl mx-auto">
            {/* Progress */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted-foreground">
                  Card {currentCardIndex + 1} of {session.cards.length}
                </span>
                <span className="text-sm font-medium text-muted-foreground">
                  {correct} correct, {incorrect} incorrect
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {/* Card */}
            <div className="mb-8">
              <StudyCard
                front={currentCard.front}
                back={currentCard.back}
                onFlip={handleFlipCard}
              />
            </div>

            {/* Control buttons */}
            <div className="flex items-center justify-center gap-4">
              {/* Previous button */}
              <Button
                onClick={handlePrevious}
                disabled={currentCardIndex === 0}
                variant="ghost"
                size="lg"
                className="flex-1 max-w-[120px]"
              >
                <SkipBack className="h-5 w-5 mr-2" />
                Previous
              </Button>

              {/* Flip Card button */}
              {!isFlipped && (
                <Button
                  onClick={handleFlipCard}
                  variant="outline"
                  size="lg"
                  className="flex-1 max-w-[120px]"
                >
                  <RefreshCw className="h-5 w-5 mr-2" />
                  Flip Card
                </Button>
              )}

              {/* Next button */}
              <Button
                onClick={() => router.push(`/decks/${deckId}`)}
                variant="ghost"
                size="lg"
                className="flex-1 max-w-[120px]"
              >
                Next
                <ArrowLeft className="h-5 w-5 ml-2 rotate-180" />
              </Button>
            </div>

            {/* Answer buttons */}
            {isFlipped && (
              <div className="grid grid-cols-2 gap-4 mt-8">
                <Button
                  onClick={() => handleCardAnswer(false)}
                  size="lg"
                  className={cn(
                    "h-16 text-lg font-medium",
                    "bg-red-500 text-white hover:bg-red-600",
                    "border-0"
                  )}
                >
                  <XCircle className="h-6 w-6 mr-3" />
                  Incorrect
                </Button>

                <Button
                  onClick={() => handleCardAnswer(true)}
                  size="lg"
                  className={cn(
                    "h-16 text-lg font-medium",
                    "bg-green-500 text-white hover:bg-green-600",
                    "border-0"
                  )}
                >
                  <CheckCircle className="h-6 w-6 mr-3" />
                  Correct
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
