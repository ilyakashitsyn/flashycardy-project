"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Edit, Trash2, Check, X } from "lucide-react";

interface FlashcardItemProps {
  card: {
    id: number;
    front: string;
    back: string;
    progress?: {
      isKnown: boolean;
      lastReviewed: string;
      reviewCount: number;
    } | null;
  };
  onEdit: (id: number, front: string, back: string) => void;
  onDelete: (id: number) => void;
}

export function FlashcardItem({ card, onEdit, onDelete }: FlashcardItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [frontText, setFrontText] = useState(card.front);
  const [backText, setBackText] = useState(card.back);

  const handleSave = () => {
    onEdit(card.id, frontText, backText);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFrontText(card.front);
    setBackText(card.back);
    setIsEditing(false);
  };

  return (
    <Card className="bg-card border-border">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <Label className="text-white text-sm font-medium">Front</Label>
            {isEditing ? (
              <Input
                id={`front-${card.id}`}
                value={frontText}
                onChange={(e) => setFrontText(e.target.value)}
                className="mt-2 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 text-base h-[42px] focus-visible:ring-slate-500"
                placeholder="New card"
              />
            ) : (
              <div className="mt-2 bg-slate-700 rounded-md border border-slate-600 flex items-center px-3 h-[42px]">
                <p className="text-white text-base">
                  {card.front || "New card"}
                </p>
              </div>
            )}
          </div>

          <div>
            <Label className="text-white text-sm font-medium">Back</Label>
            {isEditing ? (
              <Input
                id={`back-${card.id}`}
                value={backText}
                onChange={(e) => setBackText(e.target.value)}
                className="mt-2 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 text-base h-[42px] focus-visible:ring-slate-500"
                placeholder="New card"
              />
            ) : (
              <div className="mt-2 bg-slate-700 rounded-md border border-slate-600 flex items-center px-3 h-[42px]">
                <p className="text-white text-base">
                  {card.back || "New card"}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          {isEditing ? (
            <>
              <Button
                size="sm"
                onClick={handleSave}
                className="h-8 px-3 bg-green-600 hover:bg-green-700 flashcard-button"
              >
                <Check className="h-4 w-4 mr-1" />
                Сохранить
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCancel}
                className="h-8 px-3 flashcard-button"
              >
                <X className="h-4 w-4 mr-1" />
                Отмена
              </Button>
            </>
          ) : (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsEditing(true)}
                className="h-8 px-3 bg-slate-600 hover:bg-slate-700 text-white flashcard-button"
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onDelete(card.id)}
                className="h-8 px-3 bg-slate-600 hover:bg-slate-700 text-white flashcard-button"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </>
          )}
        </div>

        {card.progress && (
          <div className="pt-2 border-t border-slate-600">
            <div className="flex items-center gap-4 text-xs text-slate-400">
              <span>Просмотров: {card.progress.reviewCount}</span>
              {card.progress.lastReviewed && (
                <span>
                  Последний раз:{" "}
                  {new Date(card.progress.lastReviewed).toLocaleDateString(
                    "ru-RU"
                  )}
                </span>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
