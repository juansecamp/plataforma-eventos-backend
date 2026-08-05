import { verifyToken } from '../utils/jwt.js'

export const handlePolicies = (rolesPermitidos) => {
  return (req, res, next) => {
    const authHeader = req.headers['authorization']

    if (!authHeader) {
      return res.status(401).json({ error: 'No autorizado', detalle: 'Debe enviar un token en el header Authorization' })
    }

    const token = authHeader.split(' ')[1] // formato: "Bearer <token>"

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

    if (!rolesPermitidos.includes(userRole?.toUpperCase())) {
      return res.status(403).json({ error: 'Prohibido', detalle: 'No tienes los privilegios necesarios para realizar esta acción' })
    }

    // Guardamos el usuario decodificado por si el controller lo necesita
    req.usuario = payload

    next()
  }
}