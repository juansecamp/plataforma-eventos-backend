import { Router } from 'express'
import { getUsers, createUser } from '../controllers/users.controller.js'
import { auth } from '../middlewares/auth.middleware.js'
import { authorize } from '../middlewares/authorize.middleware.js'

const router = Router()

// Ver todos los usuarios: Únicamente el admin con privilegios totales
router.get('/', auth, authorize(['admin']), getUsers)

// Registrar un usuario: dejamos esta ruta pública (el registro real pasa por /api/sessions/register)
router.post('/', createUser)

export default router