"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface Statistics {
  correct: number;
  incorrect: number;
  total: number;
}

export function StatisticsClient() {
  const router = useRouter();
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await fetch("/api/statistics");
        if (!response.ok) {
          throw new Error("Failed to fetch statistics");
        }
        const data = await response.json();
        setStatistics(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center mb-8">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>
          <div className="text-center py-12">
            <div className="text-muted-foreground">Loading statistics...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center mb-8">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>
          <div className="text-center py-12">
            <div className="text-destructive">Error: {error}</div>
          </div>
        </div>
      </div>
    );
  }

  const correct = statistics?.correct || 0;
  const incorrect = statistics?.incorrect || 0;
  const total = statistics?.total || 0;
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>

        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Statistics</h1>
            <p className="text-muted-foreground">
              Overall statistics of your answers
            </p>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Correct Answers */}
            <div className="rounded-lg border bg-card p-6 text-center">
              <div className="text-4xl md:text-5xl font-bold text-green-500 mb-2">
                {correct}
              </div>
              <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Correct
              </div>
            </div>

            {/* Incorrect Answers */}
            <div className="rounded-lg border bg-card p-6 text-center">
              <div className="text-4xl md:text-5xl font-bold text-red-500 mb-2">
                {incorrect}
              </div>
              <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Incorrect
              </div>
            </div>

            {/* Accuracy */}
            <div className="rounded-lg border bg-card p-6 text-center">
              <div className="text-4xl md:text-5xl font-bold text-foreground mb-2">
                {accuracy}%
              </div>
              <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Accuracy
              </div>
            </div>
          </div>

          {/* Total */}
          <div className="rounded-lg border bg-card p-6">
            <div className="text-center">
              <div className="text-2xl font-semibold text-foreground mb-1">
                {total}
              </div>
              <div className="text-sm text-muted-foreground">Total Answers</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
