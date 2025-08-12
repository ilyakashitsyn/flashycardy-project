import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          {deck.name}
        </CardTitle>
        {deck.description && (
          <CardDescription className="line-clamp-2">
            {deck.description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-muted-foreground">
            {deck.cardCount} карточек
          </span>
          <span className="text-xs text-muted-foreground">
            {new Date(deck.createdAt).toLocaleDateString("ru-RU")}
          </span>
        </div>
        <div className="flex gap-2">
          <Button asChild size="sm" className="flex-1">
            <Link href={`/deck/${deck.id}/study`}>
              <Play className="h-4 w-4 mr-2" />
              Изучать
            </Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link href={`/deck/${deck.id}/edit`}>
              <Plus className="h-4 w-4 mr-2" />
              Редактировать
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
