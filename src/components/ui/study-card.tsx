"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface StudyCardProps {
  front: string;
  back: string;
  className?: string;
  onFlip?: (isFlipped: boolean) => void;
}

export function StudyCard({ front, back, className, onFlip }: StudyCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    const newFlippedState = !isFlipped;
    setIsFlipped(newFlippedState);
    onFlip?.(newFlippedState);
  };

  return (
    <div className={cn("study-card-container", className)}>
      <div
        className={cn("study-card", isFlipped && "flipped")}
        onClick={handleFlip}
      >
        {/* Front side */}
        <div className="study-card-face study-card-front">
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <div className="text-sm text-muted-foreground mb-4 font-medium">
              Front
            </div>
            <div className="text-2xl md:text-3xl font-bold text-foreground leading-relaxed">
              {front}
            </div>
          </div>
        </div>

        {/* Back side */}
        <div className="study-card-face study-card-back">
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <div className="text-sm text-muted-foreground mb-4 font-medium">
              Back
            </div>
            <div className="text-2xl md:text-3xl font-bold text-foreground leading-relaxed">
              {back}
            </div>
          </div>
        </div>
      </div>

      {/* Styles for flip animation */}
      <style jsx>{`
        .study-card-container {
          perspective: 1000px;
          width: 100%;
          height: 400px;
          cursor: pointer;
        }

        .study-card {
          position: relative;
          width: 100%;
          height: 100%;
          transition: transform 0.6s;
          transform-style: preserve-3d;
        }

        .study-card.flipped {
          transform: rotateY(180deg);
        }

        .study-card-face {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          border-radius: 1rem;
          border: 1px solid hsl(var(--border));
          background: hsl(var(--card));
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }

        .study-card-back {
          transform: rotateY(180deg);
        }

        /* Hover эффект */
        .study-card-container:hover .study-card-face {
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
            0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }

        /* Темная тема */
        :global(.dark) .study-card-face {
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3),
            0 2px 4px -1px rgba(0, 0, 0, 0.2);
        }

        :global(.dark) .study-card-container:hover .study-card-face {
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.4),
            0 4px 6px -2px rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </div>
  );
}
