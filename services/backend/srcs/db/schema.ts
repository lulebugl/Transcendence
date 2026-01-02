import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

// Users table
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  avatar_url: text("avatar_url"),
  created_at: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updated_at: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  last_call: integer("last_call", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  password_hash: text("password_hash").notNull(),
  refresh_token: text("refresh_token"),
  totp_secret_key: text("secret_key"),
});

// Game sessions table
export const games = sqliteTable("games", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  player1_id: integer("player1_id")
    .notNull()
    .references(() => users.id),
  player2_id: integer("player2_id")
    .notNull()
    .references(() => users.id),
  player1_score: integer("player1_score").notNull().default(0),
  player2_score: integer("player2_score").notNull().default(0),
  winner_id: integer("winner_id").references(() => users.id),
  status: text("status", {
    enum: ["waiting", "in_progress", "completed", "abandoned"],
  })
    .notNull()
    .default("waiting"),
  duration_seconds: integer("duration_seconds"),
  created_at: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  completed_at: integer("completed_at", { mode: "timestamp" }),
});

export const userStats = sqliteTable("user_stats", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  level: integer("level").notNull().default(1),
  user_id: integer("user_id")
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: "cascade" }),
  games_played: integer("games_played").notNull().default(0),
  games_won: integer("games_won").notNull().default(0),
  games_lost: integer("games_lost").notNull().default(0),
  tournaments_won: integer("tournaments_won").notNull().default(0),
  current_win_streak: integer("current_win_streak").notNull().default(0),
  best_win_streak: integer("best_win_streak").notNull().default(0),
  xp: integer("xp").notNull().default(0),
  updated_at: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const friendships = sqliteTable("friendships", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  requesterId: integer("requester_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  receiverId: integer("receiver_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  status: text("status").notNull(), // "pending", "accepted", "blocked"
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const achievements = sqliteTable("achievements", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  rarity: text("rarity", {
    enum: ["common", "rare", "epic", "legendary"],
  }).notNull(),
});

export const userAchievements = sqliteTable("user_achievements", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  user_id: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  achievement_id: text("achievement_id")
    .notNull()
    .references(() => achievements.id, { onDelete: "cascade" }),
  unlocked_at: integer("unlocked_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const apiKeys = sqliteTable("api_keys", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  user_id: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  key_hash: text("key_hash").notNull().unique(),
  label: text("label"),
  created_at: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  last_used_at: integer("last_used_at", { mode: "timestamp" }),
  revoked_at: integer("revoked_at", { mode: "timestamp" }),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Game = typeof games.$inferSelect;
export type NewGame = typeof games.$inferInsert;

export type UserStats = typeof userStats.$inferSelect;
export type NewUserStats = typeof userStats.$inferInsert;

export type ApiKey = typeof apiKeys.$inferSelect;
export type NewApiKey = typeof apiKeys.$inferInsert;
