import eventDAO from '../dao/event.dao.js'

class EventRepository {
  async getEvents(filter, options) {
    return await eventDAO.findAll(filter, options)
  }

  async countEvents(filter) {
    return await eventDAO.countAll(filter)
  }

  async getEventById(id) {
    return await eventDAO.findById(id)
  }

  async createEvent(eventData) {
    return await eventDAO.create(eventData)
  }

  async updateEvent(id, updateData) {
    return await eventDAO.update(id, updateData)
  }
}

export default new EventRepository()