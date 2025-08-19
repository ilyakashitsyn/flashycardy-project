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
import { Plus } from "lucide-react";

interface AddCardDialogProps {
  deckId: number;
  onCardAdded: (newCard: any) => void;
  trigger?: React.ReactNode;
}

export function AddCardDialog({ deckId, onCardAdded, trigger }: AddCardDialogProps) {
  const [open, setOpen] = useState(false);
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!front.trim() || !back.trim()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch(`/api/decks/${deckId}/cards`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          front: front.trim(),
          back: back.trim(),
        }),
      });

      if (response.ok) {
        const newCard = await response.json();
        onCardAdded(newCard);
        setFront("");
        setBack("");
        setOpen(false);
      } else {
        console.error("Failed to create card");
      }
    } catch (error) {
      console.error("Error creating card:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFront("");
    setBack("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Your First Card
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-background border-border">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-foreground">
            Add New Card
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Create a new flashcard for this deck. Add content for both the front
            and back of the card.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="front" className="text-sm font-medium text-foreground">
              Front
            </Label>
            <Textarea
              id="front"
              placeholder="Enter the question or prompt..."
              value={front}
              onChange={(e) => setFront(e.target.value)}
              className="min-h-[100px] resize-none"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="back" className="text-sm font-medium text-foreground">
              Back
            </Label>
            <Textarea
              id="back"
              placeholder="Enter the answer or explanation..."
              value={back}
              onChange={(e) => setBack(e.target.value)}
              className="min-h-[100px] resize-none"
              required
            />
          </div>
          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !front.trim() || !back.trim()}
            >
              {isSubmitting ? "Creating..." : "Create Card"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
