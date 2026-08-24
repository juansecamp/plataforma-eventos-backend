import { Router } from 'express'
import { getTickets, createTicket } from '../controllers/tickets.controller.js'
import { auth } from '../middlewares/auth.middleware.js'
import { authorize } from '../middlewares/authorize.middleware.js'

const router = Router()

// Ver la lista de tickets: Solo permitida para el admin (privilegios totales)
router.get('/', auth, authorize(['admin']), getTickets)

// Crear un ticket (Inscribirse/Comprar): cualquier usuario autenticado, sin importar el rol
router.post('/', auth, createTicket)

export default router