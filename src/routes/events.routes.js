import { Router } from 'express'
import { getEvents, createEvent } from '../controllers/events.controller.js'
import { handlePolicies } from '../middlewares/auth.middleware.js'

const router = Router()

// Cualquier rol válido puede ver la lista de eventos
router.get('/', handlePolicies(['user', 'organizer', 'admin']), getEvents)

// SOLO un organizer o un admin pueden publicar nuevos eventos
router.post('/', handlePolicies(['organizer', 'admin']), createEvent)

export default router