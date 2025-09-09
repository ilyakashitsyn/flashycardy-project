"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface StudyResultsProps {
  deckName: string;
  correct: number;
  incorrect: number;
  total: number;
  onStudyAgain: () => void;
  onBackToDeck: () => void;
  className?: string;
}

export function StudyResults({
  deckName,
  correct,
  incorrect,
  total,
  onStudyAgain,
  onBackToDeck,
  className,
}: StudyResultsProps) {
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

  return (
    <Card
      className={cn(
        "max-w-2xl mx-auto bg-card/95 backdrop-blur-sm border-border/50",
        "shadow-2xl",
        className
      )}
    >
      <CardContent className="p-8 md:p-12">
        <div className="text-center space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Study Session Completed!
            </h1>
            <p className="text-lg text-muted-foreground">
              Great job studying {deckName}
            </p>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-3 gap-6 py-8">
            {/* Correct answers */}
            <div className="text-center space-y-2">
              <div className="text-4xl md:text-5xl font-bold text-green-500">
                {correct}
              </div>
              <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Correct
              </div>
            </div>

            {/* Incorrect answers */}
            <div className="text-center space-y-2">
              <div className="text-4xl md:text-5xl font-bold text-red-500">
                {incorrect}
              </div>
              <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Incorrect
              </div>
            </div>

            {/* Accuracy */}
            <div className="text-center space-y-2">
              <div className="text-4xl md:text-5xl font-bold text-foreground">
                {accuracy}%
              </div>
              <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Accuracy
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
            <Button
              onClick={onStudyAgain}
              size="lg"
              className="h-14 text-lg font-medium bg-background text-foreground border border-border hover:bg-accent hover:text-accent-foreground"
              variant="outline"
            >
              <RefreshCw className="h-5 w-5 mr-3" />
              Study Again
            </Button>

            <Button
              onClick={onBackToDeck}
              size="lg"
              className="h-14 text-lg font-medium bg-muted text-muted-foreground hover:bg-muted/80"
              variant="secondary"
            >
              <ArrowLeft className="h-5 w-5 mr-3" />
              Back to Deck
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
