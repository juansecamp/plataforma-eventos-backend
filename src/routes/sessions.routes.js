import { Router } from 'express'
import { registerSession, loginSession } from '../controllers/sessions.controller.js'

const router = Router()

router.post('/register', registerSession)
router.post('/login', loginSession)

export default router
