"use client";

import { LazyPricingTable } from "@/components/lazy";
import styles from "./pricing.module.css";
import { Suspense } from "react";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-6 pt-20">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Choose Your Plan
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Unlock the full potential of your flashcard learning experience with
            our flexible pricing options
          </p>
        </div>

        {/* Pricing Table */}
        <div className={styles.pricingContainer}>
          <Suspense
            fallback={
              <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            }
          >
            <LazyPricingTable />
          </Suspense>
        </div>

        {/* Footer Text */}
        <div className="text-center mt-12">
          <small className="text-muted-foreground">
            All plans include secure data storage and cross-device
            synchronization
          </small>
        </div>
      </div>
    </div>
  );
}
