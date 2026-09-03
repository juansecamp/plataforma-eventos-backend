import ticketRepository from '../repositories/ticket.repository.js'
import eventRepository from '../repositories/event.repository.js'
import userRepository from '../repositories/users.repository.js'
import { enviarEmailConfirmacion } from '../utils/email.js'

const generarCodigoReserva = () => {
  return 'TCK-' + Math.random().toString(36).substring(2, 10).toUpperCase()
}

export const crearTicket = async (eventId, userId, quantity) => {
  const evento = await eventRepository.getEventById(eventId)

  if (!evento) {
    const error = new Error('Evento no encontrado')
    error.status = 404
    throw error
  }

  if (evento.status !== 'published') {
    const error = new Error('Solo podés inscribirte a eventos publicados')
    error.status = 400
    throw error
  }

  if (!quantity || !Number.isInteger(quantity) || quantity <= 0) {
    const error = new Error('La cantidad debe ser un número entero mayor a 0')
    error.status = 400
    throw error
  }

  const ticketExistente = await ticketRepository.getActiveTicketByUserAndEvent(userId, eventId)
  if (ticketExistente) {
    const error = new Error('Ya tenés una inscripción activa para este evento')
    error.status = 400
    throw error
  }

  const cupoOcupado = await ticketRepository.countActiveTicketsByEvent(eventId)
  const cupoDisponible = evento.capacity - cupoOcupado

  if (quantity > cupoDisponible) {
    const error = new Error(`No hay cupos suficientes. Cupos disponibles: ${cupoDisponible}`)
    error.status = 400
    throw error
  }

  const nuevoTicket = await ticketRepository.createTicket({
    user: userId,
    event: eventId,
    quantity,
    status: 'confirmed',
    reservationCode: generarCodigoReserva()
  })

  const usuario = await userRepository.getUserById(userId)
  await enviarEmailConfirmacion({
    to: usuario.email,
    eventTitle: evento.title,
    reservationCode: nuevoTicket.reservationCode,
    quantity: nuevoTicket.quantity
  })

  return nuevoTicket
}

export const obtenerMisTickets = async (userId) => {
  return await ticketRepository.getTicketsByUser(userId)
}

export const obtenerTicketsDeEvento = async (eventId, usuario) => {
  const evento = await eventRepository.getEventById(eventId)

  if (!evento) {
    const error = new Error('Evento no encontrado')
    error.status = 404
    throw error
  }

  const esDueño = evento.organizer.toString() === usuario.id
  const esAdmin = usuario.role === 'admin'

  if (!esDueño && !esAdmin) {
    const error = new Error('No tenés permisos para ver los tickets de este evento')
    error.status = 403
    throw error
  }

  return await ticketRepository.getTicketsByEvent(eventId)
}

export const cancelarTicket = async (ticketId, usuario) => {
  const ticket = await ticketRepository.getTicketById(ticketId)

  if (!ticket) {
    const error = new Error('Ticket no encontrado')
    error.status = 404
    throw error
  }

  const esDueño = ticket.user.toString() === usuario.id
  const esAdmin = usuario.role === 'admin'

  if (!esDueño && !esAdmin) {
    const error = new Error('No podés cancelar un ticket que no te pertenece')
    error.status = 403
    throw error
  }

  if (ticket.status === 'cancelled') {
    const error = new Error('El ticket ya está cancelado')
    error.status = 400
    throw error
  }

  return await ticketRepository.cancelTicket(ticketId)
}