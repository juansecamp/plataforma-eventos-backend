import { obtenerTodosLosEventos, guardarNuevoEvento } from '../services/events.service.js'

export const getEvents = async (req, res) => {
  try {
    const eventos = await obtenerTodosLosEventos()
    res.status(200).json(eventos)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los eventos', detalle: error.message })
  }
}

export const createEvent = async (req, res) => {
  try {
    const eventoGuardado = await guardarNuevoEvento(req.body)
    res.status(201).json(eventoGuardado)
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el evento', detalle: error.message })
  }
}
