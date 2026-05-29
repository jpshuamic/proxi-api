import { pgTable, text, uuid, timestamp, varchar, integer, boolean as pgBoolean, numeric } from 'drizzle-orm-pg'
import { serial } from 'drizzle-orm-pg'

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  phone: varchar('phone', { length: 15 }).notNull(),
  email: varchar('email', { length: 255 }),
  first_name: varchar('first_name', { length: 100 }),
  last_name: varchar('last_name', { length: 100 }),
  bio: text('bio'),
  avatar_url: text('avatar_url'),
  user_type: varchar('user_type', { length: 20 }).notNull(),
  pin_hash: varchar('pin_hash', { length: 255 }),
  is_phone_verified: pgBoolean('is_phone_verified').default(false),
  trust_score: integer('trust_score').default(0),
  is_admin: pgBoolean('is_admin').default(false),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow()
})

export const wallets = pgTable('wallets', {
  id: uuid('id').primaryKey().defaultRandom(),
  user_id: uuid('user_id').notNull(),
  available_balance: numeric('available_balance', { precision: 15, scale: 2 }).default('0'),
  escrow_balance: numeric('escrow_balance', { precision: 15, scale: 2 }).default('0'),
  updated_at: timestamp('updated_at').defaultNow()
})
