import { toUserDTO } from './user.dto.js'

const toEventSummaryDTO = (evento) => {
  if (!evento || typeof evento !== 'object') return evento

  return {
    id: evento._id,
    title: evento.title,
    date: evento.date,
    location: evento.location
  }
}

export const toTicketDTO = (ticket) => {
  const eventoEsObjeto = ticket.event && typeof ticket.event === 'object' && ticket.event.title
  const usuarioEsObjeto = ticket.user && typeof ticket.user === 'object' && ticket.user.email

  return {
    id: ticket._id,
    user: usuarioEsObjeto ? toUserDTO(ticket.user) : ticket.user,
    event: eventoEsObjeto ? toEventSummaryDTO(ticket.event) : ticket.event,
    status: ticket.status,
    quantity: ticket.quantity,
    reservationCode: ticket.reservationCode,
    cancelledAt: ticket.cancelledAt,
    createdAt: ticket.createdAt,
    updatedAt: ticket.updatedAt
  }
}

export const toTicketListDTO = (tickets) => tickets.map(toTicketDTO)