import {
  listarEventos,
  obtenerEventoPorId,
  crearEvento,
  actualizarEvento,
  cambiarEstadoEvento
} from '../services/events.service.js'
import { toEventDTO, toEventListDTO } from '../dtos/event.dto.js'

export const getEvents = async (req, res, next) => {
  try {
    const resultado = await listarEventos(req.query)
    res.status(200).json({
      status: 'success',
      data: toEventListDTO(resultado.data),
      page: resultado.page,
      limit: resultado.limit,
      total: resultado.total,
      totalPages: resultado.totalPages
    })
  } catch (error) {
    next(error)
  }
}

export const getEventById = async (req, res, next) => {
  try {
    const evento = await obtenerEventoPorId(req.params.id)
    res.status(200).json({ status: 'success', payload: toEventDTO(evento) })
  } catch (error) {
    next(error)
  }
}

export const createEvent = async (req, res, next) => {
  try {
    const eventoGuardado = await crearEvento(req.body, req.user.id)
    res.status(201).json({ status: 'success', payload: toEventDTO(eventoGuardado) })
  } catch (error) {
    next(error)
  }
}

export const updateEvent = async (req, res, next) => {
  try {
    const { id } = req.params
    const eventoActualizado = await actualizarEvento(id, req.body, req.user)
    res.status(200).json({ status: 'success', payload: toEventDTO(eventoActualizado) })
  } catch (error) {
    next(error)
  }
}

export const updateEventStatus = async (req, res, next) => {
  try {
    const { id } = req.params
    const { status } = req.body
    const eventoActualizado = await cambiarEstadoEvento(id, status, req.user)
    res.status(200).json({ status: 'success', payload: toEventDTO(eventoActualizado) })
  } catch (error) {
    next(error)
  }
}