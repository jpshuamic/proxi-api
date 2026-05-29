import app from './app'
import http from 'http'
import { createServer } from 'http'
const port = process.env.PORT ? Number(process.env.PORT) : 4000
const server = createServer(app)

server.listen(port, () => {
  console.log(`Proxi API server listening on port ${port}`)
})
