import Ticket from '../models/ticket.model.js'

class TicketDAO {
  async findAll() {
    return await Ticket.find()
  }

  async findById(id) {
    return await Ticket.findById(id)
  }

  async create(ticketData) {
    const nuevoTicket = new Ticket(ticketData)
    return await nuevoTicket.save()
  }
}

export default new TicketDAO()