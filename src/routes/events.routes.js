import { Router } from 'express'
import { getEvents, getEventById, createEvent, updateEvent, updateEventStatus } from '../controllers/events.controller.js'
import { createTicket, getEventTickets } from '../controllers/tickets.controller.js'
import { auth } from '../middlewares/auth.middleware.js'
import { authorize } from '../middlewares/authorize.middleware.js'

const router = Router()

// Público: cualquiera puede ver la lista y el detalle de eventos
router.get('/', getEvents)
router.get('/:id', getEventById)

// SOLO un organizer o un admin pueden publicar nuevos eventos
router.post('/', auth, authorize(['organizer', 'admin']), createEvent)

// Modificar un evento: organizer solo el suyo, admin cualquiera (se valida en el service)
router.put('/:id', auth, authorize(['organizer', 'admin']), updateEvent)

// Cambiar el estado de un evento (ej: cancelarlo)
router.patch('/:id/status', auth, authorize(['organizer', 'admin']), updateEventStatus)

// Inscribirse a un evento (cualquier usuario autenticado)
router.post('/:eid/tickets', auth, createTicket)

// Ver los tickets de un evento (dueño del evento o admin, se valida en el service)
router.get('/:eid/tickets', auth, getEventTickets)

export default router