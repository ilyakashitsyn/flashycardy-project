"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { EditDeckDialog } from "@/components/ui/edit-deck-dialog";
import { ArrowLeft } from "lucide-react";
import { LuBanana } from "react-icons/lu";

type Card = {
  id: number;
  front: string;
  back: string;
  deckId: number;
};

type Deck = {
  id: number;
  name: string;
  description: string | null;
  emoji?: string | null;
  cards: Card[];
};

export default function EditDeckPage() {
  const params = useParams();
  const router = useRouter();
  const deckId = params.deckId as string;

  const [deck, setDeck] = useState<Deck | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCardIds, setSelectedCardIds] = useState<number[]>([]);
  const [savingCardId, setSavingCardId] = useState<number | null>(null);
  const [isDeletingCards, setIsDeletingCards] = useState(false);
  const [isDeletingDeck, setIsDeletingDeck] = useState(false);

  const fetchDeck = useCallback(async () => {
    try {
      setError(null);
      const res = await fetch(`/api/decks/${deckId}`);
      if (!res.ok) throw new Error("Failed to load deck");
      const data = await res.json();
      setDeck(data);
    } catch (e: any) {
      setError(e?.message || "Failed to load deck");
    } finally {
      setLoading(false);
    }
  }, [deckId]);

  useEffect(() => {
    if (!deckId || isNaN(Number(deckId))) {
      setError("Invalid deck ID");
      setLoading(false);
      return;
    }
    fetchDeck();
  }, [deckId, fetchDeck]);

  const allSelected = useMemo(() => {
    if (!deck?.cards?.length) return false;
    return selectedCardIds.length === deck.cards.length;
  }, [deck, selectedCardIds]);

  const toggleSelectAll = () => {
    if (!deck) return;
    if (allSelected) {
      setSelectedCardIds([]);
    } else {
      setSelectedCardIds(deck.cards.map((c) => c.id));
    }
  };

  const toggleSelect = (cardId: number) => {
    setSelectedCardIds((prev) =>
      prev.includes(cardId)
        ? prev.filter((id) => id !== cardId)
        : [...prev, cardId]
    );
  };

  const handleSaveCard = async (
    cardId: number,
    front: string,
    back: string
  ) => {
    try {
      setSavingCardId(cardId);
      const res = await fetch(`/api/cards/${cardId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ front, back }),
      });
      if (!res.ok) throw new Error("Failed to save card");
      setDeck((prev) =>
        prev
          ? {
              ...prev,
              cards: prev.cards.map((c) =>
                c.id === cardId ? { ...c, front, back } : c
              ),
            }
          : prev
      );
    } catch (e) {
      // no-op: error surfaced minimally
    } finally {
      setSavingCardId(null);
    }
  };

  const handleBulkDeleteCards = async () => {
    if (!deck || selectedCardIds.length === 0) return;
    if (!confirm(`Delete ${selectedCardIds.length} cards?`)) return;
    try {
      setIsDeletingCards(true);
      const res = await fetch(`/api/decks/${deck.id}/cards/bulk-delete`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cardIds: selectedCardIds }),
      });
      if (!res.ok) throw new Error("Failed to bulk delete");
      setDeck((prev) =>
        prev
          ? {
              ...prev,
              cards: prev.cards.filter((c) => !selectedCardIds.includes(c.id)),
            }
          : prev
      );
      setSelectedCardIds([]);
    } catch (e) {
      // no-op
    } finally {
      setIsDeletingCards(false);
    }
  };

  const handleDeleteDeck = async () => {
    if (!deck) return;
    if (!confirm("Delete the deck and all its cards?")) return;
    try {
      setIsDeletingDeck(true);
      const res = await fetch(`/api/decks/${deck.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete deck");
      router.push("/decks");
      router.refresh();
    } catch (e) {
      // no-op
    } finally {
      setIsDeletingDeck(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!deck) return null;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div>
        <Link href={`/dashboard`}>
          <Button variant="ghost" className="mb-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
      </div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold flex items-center gap-2">
          <span>{deck.emoji || "📚"}</span>
          {deck.name}
          <EditDeckDialog
            deck={{
              id: deck.id,
              name: deck.name,
              description: deck.description ?? undefined,
              emoji: deck.emoji ?? "📚",
            }}
            onDeckUpdated={(updated) =>
              setDeck((prev) =>
                prev
                  ? {
                      ...prev,
                      name: updated.name,
                      description: updated.description ?? null,
                      emoji: updated.emoji,
                    }
                  : prev
              )
            }
            onlyEmoji
            trigger={
              <Button variant="outline" size="sm" className="ml-1">
                <LuBanana className="h-4 w-4 mr-1" />
                Change icon
              </Button>
            }
          />
        </h1>
        <div className="flex items-center gap-2">
          <Button
            variant="destructive"
            onClick={handleDeleteDeck}
            disabled={isDeletingDeck}
          >
            {isDeletingDeck ? "Deleting..." : "Delete deck"}
          </Button>
        </div>
      </div>

      <div className="rounded-lg border p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">Deck settings</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-muted-foreground">Name</label>
            <Input value={deck.name} readOnly />
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Description</label>
            <Textarea value={deck.description || ""} readOnly rows={3} />
          </div>
        </div>
      </div>

      <div className="rounded-lg border p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">Cards</h2>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleSelectAll}
              />
              <span className="text-sm text-muted-foreground">Select all</span>
            </label>
            <Button
              variant="destructive"
              disabled={selectedCardIds.length === 0 || isDeletingCards}
              onClick={handleBulkDeleteCards}
            >
              {isDeletingCards
                ? "Deleting..."
                : `Delete selected (${selectedCardIds.length})`}
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          {deck.cards.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No cards yet in this deck.
            </p>
          ) : (
            deck.cards.map((card) => (
              <EditableCardRow
                key={card.id}
                card={card}
                selected={selectedCardIds.includes(card.id)}
                onToggleSelect={() => toggleSelect(card.id)}
                onSave={handleSaveCard}
                saving={savingCardId === card.id}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function EditableCardRow({
  card,
  selected,
  onToggleSelect,
  onSave,
  saving,
}: {
  card: Card;
  selected: boolean;
  onToggleSelect: () => void;
  onSave: (cardId: number, front: string, back: string) => Promise<void>;
  saving: boolean;
}) {
  const [front, setFront] = useState(card.front);
  const [back, setBack] = useState(card.back);

  useEffect(() => {
    setFront(card.front);
    setBack(card.back);
  }, [card.id, card.front, card.back]);

  const dirty = front !== card.front || back !== card.back;

  return (
    <div className="grid grid-cols-[auto_1fr_1fr_auto] items-start gap-3 rounded-md border p-3">
      <div className="pt-2">
        <input type="checkbox" checked={selected} onChange={onToggleSelect} />
      </div>
      <Input
        value={front}
        onChange={(e) => setFront(e.target.value)}
        placeholder="Front"
      />
      <Input
        value={back}
        onChange={(e) => setBack(e.target.value)}
        placeholder="Back"
      />
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          disabled={!dirty || saving}
          onClick={() => onSave(card.id, front, back)}
        >
          {saving ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );
}
