"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Loader2, X } from "lucide-react";

interface Deck {
  id: number;
  name: string;
  description?: string;
  emoji?: string;
  cardCount: number;
  createdAt: string;
  updatedAt: string;
  progress: {
    studied: number;
    total: number;
    percentage: number;
  };
}

interface CreateDeckDialogProps {
  onDeckCreated: (deck: Deck) => void;
}

export function CreateDeckDialog({ onDeckCreated }: CreateDeckDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [emoji, setEmoji] = useState("📚");
  const [creating, setCreating] = useState(false);

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
    if (!name.trim()) return;

    setCreating(true);
    try {
      const response = await fetch("/api/decks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
          emoji: emoji,
        }),
      });

      if (response.ok) {
        const newDeck = await response.json();
        onDeckCreated({
          ...newDeck,
          cardCount: 0,
          progress: { studied: 0, total: 0, percentage: 0 },
        });
        setName("");
        setDescription("");
        setEmoji("📚");
        setIsOpen(false);
      }
    } catch (error) {
      console.error("Error creating deck:", error);
    } finally {
      setCreating(false);
    }
  };

  const handleClose = () => {
    if (!creating) {
      setIsOpen(false);
      setName("");
      setDescription("");
      setEmoji("📚");
    }
  };

  if (!isOpen) {
    return (
      <Button onClick={() => setIsOpen(true)}>
        <Plus className="h-4 w-4 mr-2" />
        Создать колоду
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background border border-border rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Создать новую колоду</h2>
          <button
            onClick={handleClose}
            className="text-muted-foreground hover:text-foreground"
            disabled={creating}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="emoji">Иконка</Label>
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
                  disabled={creating}
                >
                  {emojiOption}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="name">Название</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Введите название колоды"
              required
              disabled={creating}
            />
          </div>

          <div>
            <Label htmlFor="description">Описание (необязательно)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Введите описание колоды"
              rows={3}
              disabled={creating}
            />
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={creating}
            >
              Отмена
            </Button>
            <Button type="submit" disabled={creating || !name.trim()}>
              {creating ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Plus className="h-4 w-4 mr-2" />
              )}
              Создать
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
