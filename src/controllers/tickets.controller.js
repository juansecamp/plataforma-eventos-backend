import { crearTicket, obtenerMisTickets, obtenerTicketsDeEvento, cancelarTicket } from '../services/tickets.service.js'
import { toTicketDTO, toTicketListDTO } from '../dtos/ticket.dto.js'

export const createTicket = async (req, res, next) => {
  try {
    const { eid } = req.params
    const { quantity } = req.body
    const ticket = await crearTicket(eid, req.user.id, quantity)
    res.status(201).json({ status: 'success', payload: toTicketDTO(ticket) })
  } catch (error) {
    next(error)
  }
}

export const getMyTickets = async (req, res, next) => {
  try {
    const tickets = await obtenerMisTickets(req.user.id)
    res.status(200).json({ status: 'success', payload: toTicketListDTO(tickets) })
  } catch (error) {
    next(error)
  }
}

export const getEventTickets = async (req, res, next) => {
  try {
    const { eid } = req.params
    const tickets = await obtenerTicketsDeEvento(eid, req.user)
    res.status(200).json({ status: 'success', payload: toTicketListDTO(tickets) })
  } catch (error) {
    next(error)
  }
}

export const cancelTicket = async (req, res, next) => {
  try {
    const { tid } = req.params
    const ticket = await cancelarTicket(tid, req.user)
    res.status(200).json({ status: 'success', payload: toTicketDTO(ticket) })
  } catch (error) {
    next(error)
  }
}