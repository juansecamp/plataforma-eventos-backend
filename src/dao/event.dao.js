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

  async update(id, updateData) {
    return await Evento.findByIdAndUpdate(id, updateData, { new: true })
  }
}

export default new EventDAO()