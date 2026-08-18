import { Router } from 'express'
import { registerSession, loginSession, currentSession, logoutSession } from '../controllers/sessions.controller.js'
import { auth } from '../middlewares/auth.middleware.js'

const router = Router()

router.post('/register', registerSession)
router.post('/login', loginSession)
router.get('/current', auth, currentSession)
router.post('/logout', logoutSession)

export default router