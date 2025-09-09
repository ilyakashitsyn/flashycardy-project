"use client";

import { useParams } from "next/navigation";
import { ProtectedRoute } from "@/components/ui/protected-route";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function EditPage() {
  const params = useParams();
  const deckId = params.deckId as string;

  if (!deckId || isNaN(Number(deckId))) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-foreground mb-2">
            Invalid deck ID
          </h3>
          <Link href="/dashboard">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
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
              Back to Deck
            </Button>
          </Link>
        </div>

        <div className="text-center py-12">
          <h1 className="text-3xl font-bold mb-4">Deck Editing</h1>
          <p className="text-muted-foreground">
            Card editing functionality will be added later
          </p>
        </div>
      </div>
    </ProtectedRoute>
  );
}
