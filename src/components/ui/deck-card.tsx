import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BookOpen, Play, Plus } from "lucide-react";

interface DeckCardProps {
  deck: {
    id: number;
    name: string;
    description?: string;
    cardCount: number;
    createdAt: Date;
  };
}

export function DeckCard({ deck }: DeckCardProps) {
  const formatDate = (date: Date) => {
    try {
      if (!date || isNaN(date.getTime())) {
        return "Неизвестная дата";
      }
      return date.toLocaleDateString("ru-RU");
    } catch {
      return "Неизвестная дата";
    }
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-200 hover:scale-[1.02] cursor-pointer group">
      <CardHeader>
        <div className="flex items-center gap-2 group-hover:text-primary transition-colors">
          <BookOpen className="h-5 w-5 text-primary" />
          <a
            href={`/decks/${deck.id}`}
            className="text-2xl font-semibold leading-none tracking-tight hover:underline"
          >
            {deck.name || "Без названия"}
          </a>
        </div>
        {deck.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {deck.description}
          </p>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-muted-foreground">
            {deck.cardCount || 0} карточек
          </span>
          <span className="text-xs text-muted-foreground">
            {formatDate(deck.createdAt)}
          </span>
        </div>
        <div className="flex gap-2">
          <a
            href={`/decks/${deck.id}/study`}
            className="flex-1 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-3"
          >
            <Play className="h-4 w-4 mr-2" />
            Изучать
          </a>
          <a
            href={`/decks/${deck.id}/edit`}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"
          >
            <Plus className="h-4 w-4 mr-2" />
            Редактировать
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
