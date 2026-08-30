import {
  listarEventos,
  obtenerEventoPorId,
  crearEvento,
  actualizarEvento,
  cambiarEstadoEvento
} from '../services/events.service.js'

export const getEvents = async (req, res) => {
  try {
    const resultado = await listarEventos(req.query)
    res.status(200).json({
      status: 'success',
      data: resultado.data,
      page: resultado.page,
      limit: resultado.limit,
      total: resultado.total,
      totalPages: resultado.totalPages
    })
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error al obtener los eventos' })
  }
}

export const getEventById = async (req, res) => {
  try {
    const evento = await obtenerEventoPorId(req.params.id)
    res.status(200).json({ status: 'success', payload: evento })
  } catch (error) {
    const status = error.status || 500
    res.status(status).json({ status: 'error', message: error.message || 'Error al obtener el evento' })
  }
}

export const createEvent = async (req, res) => {
  try {
    const eventoGuardado = await crearEvento(req.body, req.user.id)
    res.status(201).json({ status: 'success', payload: eventoGuardado })
  } catch (error) {
    const status = error.status || 500
    res.status(status).json({ status: 'error', message: error.message || 'Error al crear el evento' })
  }
}

export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params
    const eventoActualizado = await actualizarEvento(id, req.body, req.user)
    res.status(200).json({ status: 'success', payload: eventoActualizado })
  } catch (error) {
    const status = error.status || 500
    res.status(status).json({ status: 'error', message: error.message || 'Error al actualizar el evento' })
  }
}

export const updateEventStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body
    const eventoActualizado = await cambiarEstadoEvento(id, status, req.user)
    res.status(200).json({ status: 'success', payload: eventoActualizado })
  } catch (error) {
    const errorStatus = error.status || 500
    res.status(errorStatus).json({ status: 'error', message: error.message || 'Error al cambiar el estado del evento' })
  }
}