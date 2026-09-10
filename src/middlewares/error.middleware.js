export const errorHandler = (err, req, res, next) => {
  const status = err.status || 500

  if (status === 500) {
    console.error('Error interno:', err)
  }

  const message = status === 500 ? 'Error interno del servidor' : err.message

  res.status(status).json({ status: 'error', message })
}