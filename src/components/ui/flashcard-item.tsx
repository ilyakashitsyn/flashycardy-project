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

  if (isEditing) {
    return (
      <Card className="bg-card border-border h-fit">
        <CardContent className="p-6 space-y-4">
          <div className="space-y-4">
            <div>
              <Label
                htmlFor={`front-${card.id}`}
                className="text-white text-sm font-medium"
              >
                Front
              </Label>
              <Input
                id={`front-${card.id}`}
                value={frontText}
                onChange={(e) => setFrontText(e.target.value)}
                className="flex h-10 w-full rounded-md border px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-2 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                placeholder="New card"
              />
            </div>

            <div>
              <Label
                htmlFor={`back-${card.id}`}
                className="text-white text-sm font-medium"
              >
                Back
              </Label>
              <Input
                id={`back-${card.id}`}
                value={backText}
                onChange={(e) => setBackText(e.target.value)}
                className="flex h-10 w-full rounded-md border px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-2 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                placeholder="New card"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              size="sm"
              onClick={handleSave}
              className="h-8 px-3 bg-green-600 hover:bg-green-700"
            >
              <Check className="h-4 w-4 mr-1" />
              Сохранить
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleCancel}
              className="h-8 px-3"
            >
              <X className="h-4 w-4 mr-1" />
              Отмена
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border h-fit">
      <CardContent className="p-6 space-y-4">
        <div className="space-y-4">
          <div>
            <Label className="text-white text-sm font-medium">Front</Label>
            <div className="mt-2 p-3 bg-slate-700 rounded-md border border-slate-600 min-h-[2.5rem] flex items-center">
              <p className="text-white">{card.front || "New card"}</p>
            </div>
          </div>

          <div>
            <Label className="text-white text-sm font-medium">Back</Label>
            <div className="mt-2 p-3 bg-slate-700 rounded-md border border-slate-600 min-h-[2.5rem] flex items-center">
              <p className="text-white">{card.back || "New card"}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsEditing(true)}
            className="h-8 px-3 bg-slate-600 hover:bg-slate-700 text-white border-slate-500"
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onDelete(card.id)}
            className="h-8 px-3 bg-slate-600 hover:bg-slate-700 text-white border-slate-500"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
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
