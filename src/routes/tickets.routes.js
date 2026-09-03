import { Router } from 'express'
import { getMyTickets, cancelTicket } from '../controllers/tickets.controller.js'
import { auth } from '../middlewares/auth.middleware.js'

const router = Router()

// Ver mis propios tickets
router.get('/my-tickets', auth, getMyTickets)

// Cancelar un ticket (dueño o admin, se valida en el service)
router.patch('/:tid/cancel', auth, cancelTicket)

export default router