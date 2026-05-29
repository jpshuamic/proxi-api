import express from 'express'
import { z } from 'zod'
import { sendOtp, verifyOtp } from '../services/otp'
import { randomInt } from 'crypto'
import { db } from '../db'
import { users, wallets } from '../db/schema'
import { signAccess, signRefresh, verifyRefresh } from '../lib/jwt'
import bcrypt from 'bcrypt'
import redis from '../lib/redis'

const router = express.Router()

const phoneSchema = z.object({ phone: z.string() })

function toE164(phone: string) {
  // naive normalization for Nigerian numbers
  if (phone.startsWith('+')) return phone
  if (phone.startsWith('0')) return '+234' + phone.slice(1)
  if (phone.startsWith('234')) return '+' + phone
  return phone
}

router.post('/send-otp', async (req, res) => {
  const parsed = phoneSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ success: false, error: 'Invalid phone', code: 'VALIDATION_ERROR' })
  const phone = toE164(parsed.data.phone)
  const otp = String(Math.floor(100000 + Math.random() * 900000))
  await sendOtp(phone, otp)
  return res.json({ success: true, message: 'OTP sent' })
})

router.post('/verify-otp', async (req, res) => {
  const schema = z.object({ phone: z.string(), otp: z.string() })
  const parsed = schema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ success: false, error: 'Invalid input', code: 'VALIDATION_ERROR' })
  const phone = toE164(parsed.data.phone)
  const ok = await verifyOtp(phone, parsed.data.otp)
  if (!ok.ok) return res.status(400).json({ success: false, error: ok.code === 'OTP_EXPIRED' ? 'OTP expired' : 'OTP invalid', code: ok.code })

  // find or create user
  const existing = await db.select().from(users).where(users.phone.eq(phone)).limit(1)
  let user
  if (!existing || existing.length === 0) {
    const insert = await db.insert(users).values({ phone }).returning()
    user = insert[0]
    // create wallet
    await db.insert(wallets).values({ user_id: user.id })
    const access = signAccess({ userId: user.id })
    const refresh = signRefresh({ userId: user.id })
    await redis.set(`refresh:${user.id}`, refresh)
    return res.json({ isNewUser: true, token: { access, refresh } })
  } else {
    user = existing[0]
    const access = signAccess({ userId: user.id })
    const refresh = signRefresh({ userId: user.id })
    await redis.set(`refresh:${user.id}`, refresh)
    return res.json({ isNewUser: false, token: { access, refresh }, user: { id: user.id, phone: user.phone } })
  }
})

router.post('/refresh', async (req, res) => {
  const schema = z.object({ refreshToken: z.string() })
  const parsed = schema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ success: false, error: 'Invalid input', code: 'VALIDATION_ERROR' })
  try {
    const payload: any = verifyRefresh(parsed.data.refreshToken)
    const stored = await redis.get(`refresh:${payload.userId}`)
    if (!stored || stored !== parsed.data.refreshToken) return res.status(401).json({ success: false, error: 'Invalid refresh token', code: 'UNAUTHORIZED' })
    const access = signAccess({ userId: payload.userId })
    return res.json({ access })
  } catch (err) {
    return res.status(401).json({ success: false, error: 'Invalid refresh token', code: 'UNAUTHORIZED' })
  }
})

export default router
