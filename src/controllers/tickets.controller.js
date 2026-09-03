import { crearTicket, obtenerMisTickets, obtenerTicketsDeEvento, cancelarTicket } from '../services/tickets.service.js'

export const createTicket = async (req, res) => {
  try {
    const { eid } = req.params
    const { quantity } = req.body
    const ticket = await crearTicket(eid, req.user.id, quantity)
    res.status(201).json({ status: 'success', payload: ticket })
  } catch (error) {
    const status = error.status || 500
    res.status(status).json({ status: 'error', message: error.message || 'Error al crear el ticket' })
  }
}

export const getMyTickets = async (req, res) => {
  try {
    const tickets = await obtenerMisTickets(req.user.id)
    res.status(200).json({ status: 'success', payload: tickets })
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error al obtener tus tickets' })
  }
}

export const getEventTickets = async (req, res) => {
  try {
    const { eid } = req.params
    const tickets = await obtenerTicketsDeEvento(eid, req.user)
    res.status(200).json({ status: 'success', payload: tickets })
  } catch (error) {
    const status = error.status || 500
    res.status(status).json({ status: 'error', message: error.message || 'Error al obtener los tickets del evento' })
  }
}

export const cancelTicket = async (req, res) => {
  try {
    const { tid } = req.params
    const ticket = await cancelarTicket(tid, req.user)
    res.status(200).json({ status: 'success', payload: ticket })
  } catch (error) {
    const status = error.status || 500
    res.status(status).json({ status: 'error', message: error.message || 'Error al cancelar el ticket' })
  }
}