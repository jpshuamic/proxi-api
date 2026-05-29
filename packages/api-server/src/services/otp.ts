import axios from 'axios'
import redis from '../lib/redis'

const TERMII_API_KEY = process.env.TERMII_API_KEY || ''
const TERMII_SENDER_ID = process.env.TERMII_SENDER_ID || 'Proxi'

export async function sendOtp(phoneE164: string, otp: string) {
  const key = `otp:${phoneE164}`
  await redis.set(key, otp, 'EX', 60 * 5)
  if (!TERMII_API_KEY) return { success: true }
  try {
    await axios.post('https://api.ng.termii.com/api/sms/send', {
      to: phoneE164,
      from: TERMII_SENDER_ID,
      sms: `Your Proxi OTP is ${otp}`,
      type: 'plain'
    }, { headers: { 'Authorization': `Bearer ${TERMII_API_KEY}` } })
    return { success: true }
  } catch (err) {
    console.error('Termii error', err)
    return { success: false }
  }
}

export async function verifyOtp(phoneE164: string, otp: string) {
  const key = `otp:${phoneE164}`
  const stored = await redis.get(key)
  if (!stored) return { ok: false, code: 'OTP_EXPIRED' }
  if (stored !== otp) return { ok: false, code: 'OTP_INVALID' }
  await redis.del(key)
  return { ok: true }
}
