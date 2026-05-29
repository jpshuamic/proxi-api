import express from 'express'
import morgan from 'morgan'
import helmet from 'helmet'
import routes from './routes'
import rateLimit from 'express-rate-limit'

const app = express()
app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))

const generalLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 })
app.use(generalLimiter)

app.use('/api/v1', routes)

app.get('/health', (_req, res) => res.json({ status: 'ok' }))

app.use((err: any, _req: any, res: any, _next: any) => {
  console.error(err)
  const code = err.code || 'INTERNAL'
  res.status(err.status || 500).json({ success: false, error: err.message || 'Internal error', code })
})

export default app
