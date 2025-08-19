"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Edit } from "lucide-react";

interface EditDeckDialogProps {
  deck: {
    id: number;
    name: string;
    description?: string;
    emoji?: string;
  };
  onDeckUpdated: (updatedDeck: any) => void;
  trigger?: React.ReactNode;
}

export function EditDeckDialog({
  deck,
  onDeckUpdated,
  trigger,
}: EditDeckDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(deck.name);
  const [description, setDescription] = useState(deck.description || "");
  const [emoji, setEmoji] = useState(deck.emoji || "📚");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const emojiOptions = [
    "📚",
    "🧠",
    "💡",
    "🎯",
    "📖",
    "🌟",
    "🔥",
    "💎",
    "🚀",
    "🌈",
    "😄",
    "🤮",
    "💩",
    "⚽",
    "🇧🇷",
    "🇬🇧",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/decks/${deck.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || undefined,
          emoji: emoji,
        }),
      });

      if (response.ok) {
        const updatedDeck = await response.json();
        onDeckUpdated(updatedDeck);
        setOpen(false);
      } else {
        console.error("Failed to update deck");
      }
    } catch (error) {
      console.error("Error updating deck:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setName(deck.name);
    setDescription(deck.description || "");
    setEmoji(deck.emoji || "📚");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="flex items-center gap-2">
            <Edit className="h-4 w-4" />
            Редактировать
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-background border-border">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-foreground">
            Редактировать колоду
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Измените название и описание вашей колоды.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">
              Иконка
            </Label>
            <div className="grid grid-cols-8 gap-2 p-2 border rounded-md">
              {emojiOptions.map((emojiOption) => (
                <button
                  key={emojiOption}
                  type="button"
                  onClick={() => setEmoji(emojiOption)}
                  className={`text-2xl p-2 rounded hover:bg-muted transition-colors ${
                    emoji === emojiOption
                      ? "bg-primary text-primary-foreground"
                      : ""
                  }`}
                  disabled={isSubmitting}
                >
                  {emojiOption}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="deck-name"
              className="text-sm font-medium text-foreground"
            >
              Название колоды
            </Label>
            <Input
              id="deck-name"
              placeholder="Введите название колоды..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="deck-description"
              className="text-sm font-medium text-foreground"
            >
              Описание (необязательно)
            </Label>
            <Textarea
              id="deck-description"
              placeholder="Введите описание колоды..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[80px] resize-none"
            />
          </div>
          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Отмена
            </Button>
            <Button type="submit" disabled={isSubmitting || !name.trim()}>
              {isSubmitting ? "Сохраняем..." : "Сохранить"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
