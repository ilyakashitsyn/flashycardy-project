import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Play, Plus } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface DeckCardProps {
  deck: {
    id: number;
    name: string;
    description?: string;
    emoji?: string;
    cardCount: number;
    createdAt: Date;
    progress: {
      studied: number;
      total: number;
      percentage: number;
    };
  };
}

export function DeckCard({ deck }: DeckCardProps) {
  const formatDate = (date: Date) => {
    try {
      if (!date || isNaN(date.getTime())) {
        return "Unknown date";
      }
      return date.toLocaleDateString("en-US");
    } catch {
      return "Unknown date";
    }
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-200 hover:scale-[1.02] cursor-pointer group">
      <CardHeader>
        <div className="flex items-center gap-2 group-hover:text-primary transition-colors">
          {deck.emoji && <span className="text-2xl">{deck.emoji}</span>}
          <a
            href={`/decks/${deck.id}`}
            className="text-2xl font-semibold leading-none tracking-tight hover:underline"
          >
            {deck.name || "Untitled"}
          </a>
        </div>
        {deck.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {deck.description}
          </p>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {deck.cardCount || 0} cards
            </span>
            <span className="text-xs text-muted-foreground">
              {formatDate(deck.createdAt)}
            </span>
          </div>

          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Study progress</span>
              <span className="font-medium">{deck.progress.percentage}%</span>
            </div>
            <Progress value={deck.progress.percentage} className="h-2" />
            <div className="text-xs text-muted-foreground text-center">
              {deck.progress.studied} of {deck.progress.total} studied
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <a
              href={`/decks/${deck.id}/study`}
              className="flex-1 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-3"
            >
              <Play className="h-4 w-4 mr-2" />
              Study
            </a>
            <a
              href={`/decks/${deck.id}/edit`}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"
            >
              <Plus className="h-4 w-4 mr-2" />
              Edit
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
