import { Router } from 'express'
import { getEvents, createEvent, updateEvent } from '../controllers/events.controller.js'
import { auth } from '../middlewares/auth.middleware.js'
import { authorize } from '../middlewares/authorize.middleware.js'

const router = Router()

// Cualquier usuario autenticado puede ver la lista de eventos
router.get('/', auth, getEvents)

// SOLO un organizer o un admin pueden publicar nuevos eventos
router.post('/', auth, authorize(['organizer', 'admin']), createEvent)

// Modificar un evento: organizer solo el suyo, admin cualquiera (se valida dentro del service)
router.put('/:id', auth, authorize(['organizer', 'admin']), updateEvent)

export default router