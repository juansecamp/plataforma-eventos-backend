import { Router } from 'express'
import { getTickets, createTicket } from '../controllers/tickets.controller.js'
import { handlePolicies } from '../middlewares/auth.middleware.js'

const router = Router()

// Ver la lista de tickets: Solo permitida para el ADMIN (privilegios totales)
router.get('/', handlePolicies(['ADMIN']), getTickets)

// Crear un ticket (Inscribirse/Comprar): Lo puede hacer el USER para registrarse, u organizadores/admins
router.post('/', handlePolicies(['USER', 'ORGANIZER', 'ADMIN']), createTicket)

export default router
