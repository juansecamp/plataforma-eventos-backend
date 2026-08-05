import { Router } from 'express'
import { getEvents, createEvent } from '../controllers/events.controller.js'
import { handlePolicies } from '../middlewares/auth.middleware.js'

const router = Router()

// Cualquier rol válido puede ver la lista de eventos
router.get('/', handlePolicies(['USER', 'ORGANIZER', 'ADMIN']), getEvents)

// SOLO un ORGANIZER o un ADMIN pueden publicar nuevos eventos
router.post('/', handlePolicies(['ORGANIZER', 'ADMIN']), createEvent)

export default router
