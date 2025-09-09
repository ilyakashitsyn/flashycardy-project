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
  const [error, setError] = useState<string | null>(null);

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
    setError(null);

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
      } else if (response.status === 403) {
        const errorData = await response.json();
        setError(errorData.error || "Deck limit reached for free plan");
      } else {
        setError("Error creating deck");
      }
    } catch (error) {
      console.error("Error creating deck:", error);
      setError("Error creating deck");
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
      setError(null);
    }
  };

  if (!isOpen) {
    return (
      <Button onClick={() => setIsOpen(true)}>
        <Plus className="h-4 w-4 mr-2" />
        Create Deck
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background border border-border rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Create New Deck</h2>
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
            <Label htmlFor="emoji">Icon</Label>
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
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter deck name"
              required
              disabled={creating}
            />
          </div>

          <div>
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter deck description"
              rows={3}
              disabled={creating}
            />
          </div>

          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <div className="flex gap-2 justify-end pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={creating}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={creating || !name.trim()}>
              {creating ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Plus className="h-4 w-4 mr-2" />
              )}
              Create
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
