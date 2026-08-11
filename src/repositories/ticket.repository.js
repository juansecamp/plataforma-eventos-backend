import ticketDAO from '../dao/ticket.dao.js'

class TicketRepository {
  async getAllTickets() {
    return await ticketDAO.findAll()
  }

  async getTicketById(id) {
    return await ticketDAO.findById(id)
  }

  async createTicket(ticketData) {
    return await ticketDAO.create(ticketData)
  }
}

export default new TicketRepository()