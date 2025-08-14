"use client";

import { useParams } from "next/navigation";
import { ProtectedRoute } from "@/components/ui/protected-route";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function StudyPage() {
  const params = useParams();
  const deckId = params.deckId as string;

  if (!deckId || isNaN(Number(deckId))) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-foreground mb-2">
            Неверный ID колоды
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
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href={`/decks/${deckId}`}>
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Назад к колоде
            </Button>
          </Link>
        </div>

        <div className="text-center py-12">
          <h1 className="text-3xl font-bold mb-4">Изучение колоды</h1>
          <p className="text-muted-foreground">
            Функция изучения карточек будет добавлена позже
          </p>
        </div>
      </div>
    </ProtectedRoute>
  );
}
