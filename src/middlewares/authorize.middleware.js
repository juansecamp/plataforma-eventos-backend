export const authorize = (rolesPermitidos) => {
  return (req, res, next) => {
    const rolDelUsuario = req.user?.role

    if (!rolesPermitidos.includes(rolDelUsuario)) {
      return res.status(403).json({
        status: 'error',
        message: 'No tenés permisos para realizar esta acción'
      })
    }

    next()
  }
}