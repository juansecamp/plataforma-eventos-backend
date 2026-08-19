import express from 'express'
import 'dotenv/config'
import cookieParser from 'cookie-parser'
import passport from 'passport'
import initializePassport from './src/config/passport.config.js'
import { connectDB } from './src/config/database.js'
import usersRouter from './src/routes/users.routes.js'
import sessionsRouter from './src/routes/sessions.routes.js'
import ticketsRouter from './src/routes/tickets.routes.js'
import eventsRouter from './src/routes/events.routes.js'

const app = express()

app.use(express.json())
app.use(cookieParser())

initializePassport()
app.use(passport.initialize())

connectDB()

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Servidor activo' })
})

app.use('/api/users', usersRouter)
app.use('/api/sessions', sessionsRouter)
app.use('/api/tickets', ticketsRouter)
app.use('/api/events', eventsRouter)

export default app