import { verifyToken } from '../utils/jwt.js'

export const auth = (req, res, next) => {
  const token = req.cookies?.currentUser

  if (!token) {
    return res.status(401).json({ status: 'error', message: 'No autenticado' })
  }

  try {
    const payload = verifyToken(token)
    req.user = payload
    next()
  } catch (error) {
    return res.status(401).json({ status: 'error', message: 'No autenticado' })
  }
}

export const handlePolicies = (rolesPermitidos) => {
  return (req, res, next) => {
    const authHeader = req.headers['authorization']

    if (!authHeader) {
      return res.status(401).json({ error: 'No autorizado', detalle: 'Debe enviar un token en el header Authorization' })
    }

    const token = authHeader.split(' ')[1]

    if (!token) {
      return res.status(401).json({ error: 'No autorizado', detalle: 'Formato de token inválido' })
    }

    let payload
    try {
      payload = verifyToken(token)
    } catch (error) {
      return res.status(403).json({ error: 'Token inválido o expirado' })
    }

    const userRole = payload.role

    if (!rolesPermitidos.includes(userRole?.toLowerCase())) {
      return res.status(403).json({ error: 'Prohibido', detalle: 'No tienes los privilegios necesarios para realizar esta acción' })
    }

    req.usuario = payload

    next()
  }
}