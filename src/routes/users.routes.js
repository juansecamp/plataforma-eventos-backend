import { Router } from 'express'
import { getUsers, createUser } from '../controllers/users.controller.js'
import { handlePolicies } from '../middlewares/auth.middleware.js'

const router = Router()

// Ver todos los usuarios: Únicamente el ADMIN con privilegios totales
router.get('/', handlePolicies(['ADMIN']), getUsers)

// Registrar un usuario: Permitido para todos los roles (cualquier visitante de la app)
router.post('/', handlePolicies(['USER', 'ORGANIZER', 'ADMIN']), createUser)

export default router
