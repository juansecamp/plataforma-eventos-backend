import eventDAO from '../dao/event.dao.js'

class EventRepository {
  async getAllEvents() {
    return await eventDAO.findAll()
  }

  async getEventById(id) {
    return await eventDAO.findById(id)
  }

  async createEvent(eventData) {
    return await eventDAO.create(eventData)
  }
}

export default new EventRepository()