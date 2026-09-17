import mongoose from 'mongoose'
import Ticket from '../models/ticket.model.js'

class TicketDAO {
  async findAll() {
    return await Ticket.find()
  }

  async findOne(filter) {
    return await Ticket.findOne(filter)
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

  async count(filter = {}) {
    return await Ticket.countDocuments(filter)
  }

  async countActiveByEvent(eventId) {
    const resultado = await Ticket.aggregate([
      { $match: { event: new mongoose.Types.ObjectId(eventId), status: { $ne: 'cancelled' } } },
      { $group: { _id: null, totalOcupado: { $sum: '$quantity' } } }
    ])

    return resultado.length > 0 ? resultado[0].totalOcupado : 0
  }

  async create(ticketData) {
    const nuevoTicket = new Ticket(ticketData)
    return await nuevoTicket.save()
  }

  async update(id, updateData) {
    return await Ticket.findByIdAndUpdate(id, updateData, { returnDocument: 'after', runValidators: true })
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