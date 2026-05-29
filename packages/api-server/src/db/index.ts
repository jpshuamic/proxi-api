import { Pool } from 'pg'
import { drizzle } from 'drizzle-orm-pg'

const connectionString = process.env.DATABASE_URL || ''
const pool = new Pool({ connectionString })
export const db = drizzle(pool)

export default db
