import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'change_me'
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'change_refresh'

export function signAccess(payload: object) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' })
}

export function signRefresh(payload: object) {
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '30d' })
}

export function verifyAccess(token: string) {
  return jwt.verify(token, JWT_SECRET)
}

export function verifyRefresh(token: string) {
  return jwt.verify(token, JWT_REFRESH_SECRET)
}
