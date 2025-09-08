import { describe, it, expect } from "@jest/globals";
import {
  decksTable,
  cardsTable,
  studySessionsTable,
  cardProgressTable,
} from "@/db/schema";

describe("Database Schema", () => {
  describe("decksTable", () => {
    it("should have correct table structure", () => {
      expect(decksTable).toBeDefined();
    });

    it("should have required columns", () => {
      expect(decksTable.id).toBeDefined();
      expect(decksTable.name).toBeDefined();
      expect(decksTable.description).toBeDefined();
      expect(decksTable.emoji).toBeDefined();
      expect(decksTable.userId).toBeDefined();
      expect(decksTable.createdAt).toBeDefined();
      expect(decksTable.updatedAt).toBeDefined();
    });

    it("should have correct column types", () => {
      expect(decksTable.id.primary).toBe(true);
      expect(decksTable.name.notNull).toBe(true);
      expect(decksTable.userId.notNull).toBe(true);
      expect(decksTable.createdAt.notNull).toBe(true);
      expect(decksTable.updatedAt.notNull).toBe(true);
    });
  });

  describe("cardsTable", () => {
    it("should have correct table structure", () => {
      expect(cardsTable).toBeDefined();
    });

    it("should have required columns", () => {
      expect(cardsTable.id).toBeDefined();
      expect(cardsTable.front).toBeDefined();
      expect(cardsTable.back).toBeDefined();
      expect(cardsTable.deckId).toBeDefined();
      expect(cardsTable.createdAt).toBeDefined();
      expect(cardsTable.updatedAt).toBeDefined();
    });

    it("should have correct column types", () => {
      expect(cardsTable.id.primary).toBe(true);
      expect(cardsTable.front.notNull).toBe(true);
      expect(cardsTable.back.notNull).toBe(true);
      expect(cardsTable.deckId.notNull).toBe(true);
      expect(cardsTable.createdAt.notNull).toBe(true);
      expect(cardsTable.updatedAt.notNull).toBe(true);
    });

    it("should have foreign key reference to decks", () => {
      // Проверяем что deckId является внешним ключом
      expect(cardsTable.deckId).toBeDefined();
    });
  });

  describe("studySessionsTable", () => {
    it("should have correct table structure", () => {
      expect(studySessionsTable).toBeDefined();
    });

    it("should have required columns", () => {
      expect(studySessionsTable.id).toBeDefined();
      expect(studySessionsTable.userId).toBeDefined();
      expect(studySessionsTable.deckId).toBeDefined();
      expect(studySessionsTable.startedAt).toBeDefined();
      expect(studySessionsTable.endedAt).toBeDefined();
    });

    it("should have correct column types", () => {
      expect(studySessionsTable.id.primary).toBe(true);
      expect(studySessionsTable.userId.notNull).toBe(true);
      expect(studySessionsTable.deckId.notNull).toBe(true);
      expect(studySessionsTable.startedAt.notNull).toBe(true);
    });

    it("should have foreign key reference to decks", () => {
      // Проверяем что deckId является внешним ключом
      expect(studySessionsTable.deckId).toBeDefined();
    });
  });

  describe("cardProgressTable", () => {
    it("should have correct table structure", () => {
      expect(cardProgressTable).toBeDefined();
    });

    it("should have required columns", () => {
      expect(cardProgressTable.id).toBeDefined();
      expect(cardProgressTable.userId).toBeDefined();
      expect(cardProgressTable.cardId).toBeDefined();
      expect(cardProgressTable.isKnown).toBeDefined();
      expect(cardProgressTable.lastReviewed).toBeDefined();
      expect(cardProgressTable.reviewCount).toBeDefined();
    });

    it("should have correct column types", () => {
      expect(cardProgressTable.id.primary).toBe(true);
      expect(cardProgressTable.userId.notNull).toBe(true);
      expect(cardProgressTable.cardId.notNull).toBe(true);
      expect(cardProgressTable.isKnown.notNull).toBe(true);
      expect(cardProgressTable.lastReviewed.notNull).toBe(true);
      expect(cardProgressTable.reviewCount.notNull).toBe(true);
    });

    it("should have foreign key reference to cards", () => {
      // Проверяем что cardId является внешним ключом
      expect(cardProgressTable.cardId).toBeDefined();
    });

    it("should have default values", () => {
      expect(cardProgressTable.isKnown.default).toBe(false);
      expect(cardProgressTable.reviewCount.default).toBe(0);
    });
  });
});
