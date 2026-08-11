import ticketRepository from '../repositories/ticket.repository.js'

export const obtenerTodosLosTickets = async () => {
  return await ticketRepository.getAllTickets()
}

export const guardarNuevoTicket = async (ticketData) => {
  return await ticketRepository.createTicket(ticketData)
}