"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { Crown } from "lucide-react";
import Link from "next/link";
import { Button } from "./button";

interface Deck {
  id: number;
  name: string;
  cardCount: number;
}

interface DashboardStatsProps {
  className?: string;
}

export function DashboardStats({ className = "" }: DashboardStatsProps) {
  const { has } = useAuth();
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(true);

  const hasProPlan = has?.({ plan: "pro_plan" }) ?? false;
  const totalCards = decks.reduce((sum, deck) => sum + deck.cardCount, 0);

  useEffect(() => {
    const fetchDecks = async () => {
      try {
        const response = await fetch("/api/decks");
        if (response.ok) {
          const data = await response.json();
          setDecks(data);
        }
      } catch (error) {
        console.error("Error fetching decks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDecks();
  }, []);

  if (loading) {
    return (
      <div className={`hidden md:flex items-center space-x-6 ${className}`}>
        <div className="flex items-center space-x-3 text-sm text-muted-foreground">
          <div className="h-4 w-16 bg-muted animate-pulse rounded"></div>
          <span>•</span>
          <div className="h-4 w-16 bg-muted animate-pulse rounded"></div>
        </div>
        <div className="h-8 w-20 bg-muted animate-pulse rounded"></div>
      </div>
    );
  }

  return (
    <div className={`hidden md:flex items-center space-x-6 ${className}`}>
      {/* Статистика */}
      <div className="flex items-center space-x-3 text-sm text-muted-foreground">
        <span>{decks.length} decks</span>
        <span>•</span>
        <span>{totalCards} cards</span>
        {hasProPlan && (
          <>
            <span>•</span>
            <span className="text-amber-500 flex items-center gap-1">
              <Crown className="h-3 w-3" />
              Pro
            </span>
          </>
        )}
      </div>

      {/* Быстрые действия */}
      <div className="flex items-center space-x-2">
        <Link
          href="/dashboard/statistics"
          className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          Statistics
        </Link>
        {!hasProPlan && (
          <Button variant="outline" size="sm" asChild>
            <Link href="/pricing">
              <Crown className="h-4 w-4 mr-1" />
              Upgrade
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
