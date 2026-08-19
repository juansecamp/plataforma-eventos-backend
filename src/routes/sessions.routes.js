import { Router } from 'express'
import passport from 'passport'
import { registerSession, loginSession, currentSession, logoutSession } from '../controllers/sessions.controller.js'

const router = Router()

router.post('/register', registerSession)
router.post('/login', loginSession)
router.get('/current', passport.authenticate('current', { session: false }), currentSession)
router.post('/logout', logoutSession)

export default router