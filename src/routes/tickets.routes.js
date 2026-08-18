import { Router } from 'express'
import { getTickets, createTicket } from '../controllers/tickets.controller.js'
import { handlePolicies } from '../middlewares/auth.middleware.js'

const router = Router()

// Ver la lista de tickets: Solo permitida para el admin (privilegios totales)
router.get('/', handlePolicies(['admin']), getTickets)

// Crear un ticket (Inscribirse/Comprar): Lo puede hacer el user para registrarse, u organizadores/admins
router.post('/', handlePolicies(['user', 'organizer', 'admin']), createTicket)

export default router