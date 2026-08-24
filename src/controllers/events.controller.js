import { obtenerTodosLosEventos, guardarNuevoEvento, actualizarEvento } from '../services/events.service.js'

export const getEvents = async (req, res) => {
  try {
    const eventos = await obtenerTodosLosEventos()
    res.status(200).json({ status: 'success', payload: eventos })
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error al obtener los eventos' })
  }
}

export const createEvent = async (req, res) => {
  try {
    const eventoGuardado = await guardarNuevoEvento(req.body, req.user.id)
    res.status(201).json({ status: 'success', payload: eventoGuardado })
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error al crear el evento' })
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