import ticketDAO from '../dao/ticket.dao.js'

class TicketRepository {
  async getAllTickets() {
    return await ticketDAO.findAll()
  }

  async getTicketById(id) {
    return await ticketDAO.findById(id)
  }

  async getTicketsByUser(userId) {
    return await ticketDAO.findByUser(userId)
  }

  async getTicketsByEvent(eventId) {
    return await ticketDAO.findByEvent(eventId)
  }

  async getActiveTicketByUserAndEvent(userId, eventId) {
    return await ticketDAO.findActiveByUserAndEvent(userId, eventId)
  }

  async countActiveTicketsByEvent(eventId) {
    return await ticketDAO.countActiveByEvent(eventId)
  }

  async createTicket(ticketData) {
    return await ticketDAO.create(ticketData)
  }

  async cancelTicket(id) {
    return await ticketDAO.cancel(id)
  }
}

export default new TicketRepository()