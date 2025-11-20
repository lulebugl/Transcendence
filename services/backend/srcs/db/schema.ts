import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// Users table
export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  username: text('username').notNull().unique(),
  email: text('email').notNull().unique(),
  avatar_url: text('avatar_url'),
  created_at: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
  updated_at: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
  password_hash: text("password_hash").notNull(),
  refresh_token: text("refresh_token")
});

// Game sessions table
export const games = sqliteTable('games', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  player1_id: integer('player1_id')
    .notNull()
    .references(() => users.id),
  player2_id: integer('player2_id')
    .notNull()
    .references(() => users.id),
  player1_score: integer('player1_score').notNull().default(0),
  player2_score: integer('player2_score').notNull().default(0),
  winner_id: integer('winner_id').references(() => users.id),
  status: text('status', { enum: ['waiting', 'in_progress', 'completed', 'abandoned'] })
    .notNull()
    .default('waiting'),
  duration_seconds: integer('duration_seconds'),
  created_at: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
  completed_at: integer('completed_at', { mode: 'timestamp' }),
});

// Leaderboard / User stats (denormalized for performance)
export const userStats = sqliteTable('user_stats', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  user_id: integer('user_id')
    .notNull()
    .unique()
    .references(() => users.id),
  games_played: integer('games_played').notNull().default(0),
  games_won: integer('games_won').notNull().default(0),
  games_lost: integer('games_lost').notNull().default(0),
  total_score: integer('total_score').notNull().default(0),
  highest_score: integer('highest_score').notNull().default(0),
  win_streak: integer('win_streak').notNull().default(0),
  updated_at: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Game = typeof games.$inferSelect;
export type NewGame = typeof games.$inferInsert;

export type UserStats = typeof userStats.$inferSelect;
export type NewUserStats = typeof userStats.$inferInsert;

