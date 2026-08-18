import { Router } from 'express'
import { getUsers, createUser } from '../controllers/users.controller.js'
import { handlePolicies } from '../middlewares/auth.middleware.js'

const router = Router()

// Ver todos los usuarios: Únicamente el admin con privilegios totales
router.get('/', handlePolicies(['admin']), getUsers)

// Registrar un usuario: Permitido para todos los roles (cualquier visitante de la app)
router.post('/', handlePolicies(['user', 'organizer', 'admin']), createUser)

export default router