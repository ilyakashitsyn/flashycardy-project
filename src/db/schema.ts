import {
  integer,
  pgTable,
  varchar,
  text,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";

export const decksTable = pgTable("decks", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  description: text(),
  userId: varchar({ length: 255 }).notNull(), // Clerk user ID
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
});

export const cardsTable = pgTable("cards", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  front: text().notNull(), // Лицевая сторона карточки
  back: text().notNull(), // Оборотная сторона карточки
  deckId: integer()
    .references(() => decksTable.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
});

export const studySessionsTable = pgTable("study_sessions", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: varchar({ length: 255 }).notNull(), // Clerk user ID
  deckId: integer()
    .references(() => decksTable.id, { onDelete: "cascade" })
    .notNull(),
  startedAt: timestamp().defaultNow().notNull(),
  endedAt: timestamp(),
});

export const cardProgressTable = pgTable("card_progress", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: varchar({ length: 255 }).notNull(), // Clerk user ID
  cardId: integer()
    .references(() => cardsTable.id, { onDelete: "cascade" })
    .notNull(),
  isKnown: boolean().default(false).notNull(),
  lastReviewed: timestamp().defaultNow().notNull(),
  reviewCount: integer().default(0).notNull(),
});
