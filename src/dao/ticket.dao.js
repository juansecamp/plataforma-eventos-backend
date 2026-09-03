import Ticket from '../models/ticket.model.js'

class TicketDAO {
  async findAll() {
    return await Ticket.find()
  }

  async findById(id) {
    return await Ticket.findById(id)
  }

  async findByUser(userId) {
    return await Ticket.find({ user: userId }).populate('event', 'title date location')
  }

  async findByEvent(eventId) {
    return await Ticket.find({ event: eventId })
  }

  async findActiveByUserAndEvent(userId, eventId) {
    return await Ticket.findOne({ user: userId, event: eventId, status: { $ne: 'cancelled' } })
  }

  async countActiveByEvent(eventId) {
    const tickets = await Ticket.find({ event: eventId, status: { $ne: 'cancelled' } })
    return tickets.reduce((total, ticket) => total + ticket.quantity, 0)
  }

  async create(ticketData) {
    const nuevoTicket = new Ticket(ticketData)
    return await nuevoTicket.save()
  }

  async cancel(id) {
    return await Ticket.findByIdAndUpdate(
      id,
      { status: 'cancelled', cancelledAt: new Date() },
      { returnDocument: 'after' }
    )
  }
}

export default new TicketDAO()