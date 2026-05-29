import { Request, Response, NextFunction } from 'express'
import { verifyAccess } from '../lib/jwt'
import { db } from '../db'
import { users } from '../db/schema'

export interface AuthedRequest extends Request {
  user?: any
}

export async function authMiddleware(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization
    if (!header) return res.status(401).json({ success: false, error: 'Unauthorized', code: 'UNAUTHORIZED' })
    const parts = header.split(' ')
    if (parts.length !== 2) return res.status(401).json({ success: false, error: 'Unauthorized', code: 'UNAUTHORIZED' })
    const token = parts[1]
    const payload: any = verifyAccess(token)
    if (!payload || !payload.userId) return res.status(401).json({ success: false, error: 'Unauthorized', code: 'UNAUTHORIZED' })
    const user = await db.select().from(users).where(users.id.eq(payload.userId)).limit(1)
    if (!user || user.length === 0) return res.status(401).json({ success: false, error: 'Unauthorized', code: 'UNAUTHORIZED' })
    req.user = user[0]
    next()
  } catch (err: any) {
    console.error('auth error', err)
    return res.status(401).json({ success: false, error: 'Invalid token', code: 'UNAUTHORIZED' })
  }
}

export default authMiddleware
