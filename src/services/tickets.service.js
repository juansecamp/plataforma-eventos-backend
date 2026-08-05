import Ticket from '../models/ticket.model.js'

export const obtenerTodosLosTickets = async () => {
return await Ticket.find()
}

export const guardarNuevoTicket = async (ticketData) => {
const nuevoTicket = new Ticket(ticketData)
return await nuevoTicket.save()
}
