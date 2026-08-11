import Evento from '../models/event.model.js'

class EventDAO {
  async findAll() {
    return await Evento.find()
  }

  async findById(id) {
    return await Evento.findById(id)
  }

  async create(eventData) {
    const nuevoEvento = new Evento(eventData)
    return await nuevoEvento.save()
  }
}

export default new EventDAO()