import dynamic from "next/dynamic";
import React from "react";

// Lazy load heavy components
export const LazyPricingTable = dynamic(
  () =>
    import("@/components/ui/pricing-table-wrapper").then((mod) => ({
      default: mod.PricingTableWrapper,
    })),
  {
    loading: () => (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    ),
    ssr: false,
  }
);

export const LazyStudyCard = dynamic(
  () =>
    import("@/components/ui/study-card").then((mod) => ({
      default: mod.StudyCard,
    })),
  {
    loading: () => (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    ),
  }
);

export const LazyStudyResults = dynamic(
  () =>
    import("@/components/ui/study-results").then((mod) => ({
      default: mod.StudyResults,
    })),
  {
    loading: () => (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    ),
  }
);

export const LazyAddCardDialog = dynamic(
  () =>
    import("@/components/ui/add-card-dialog").then((mod) => ({
      default: mod.AddCardDialog,
    })),
  {
    loading: () => null,
    ssr: false,
  }
);

export const LazyEditDeckDialog = dynamic(
  () =>
    import("@/components/ui/edit-deck-dialog").then((mod) => ({
      default: mod.EditDeckDialog,
    })),
  {
    loading: () => null,
    ssr: false,
  }
);

export const LazyCreateDeckDialog = dynamic(
  () =>
    import("@/components/ui/create-deck-dialog").then((mod) => ({
      default: mod.CreateDeckDialog,
    })),
  {
    loading: () => null,
    ssr: false,
  }
);

export const LazyAuthDialog = dynamic(
  () =>
    import("@/components/ui/auth-dialog").then((mod) => ({
      default: mod.AuthDialog,
    })),
  {
    loading: () => null,
    ssr: false,
  }
);
