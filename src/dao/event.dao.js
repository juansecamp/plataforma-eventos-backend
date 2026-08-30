import Evento from '../models/event.model.js'

class EventDAO {
  async findAll(filter, { skip, limit, sort }) {
    return await Evento.find(filter).sort(sort).skip(skip).limit(limit)
  }

  async countAll(filter) {
    return await Evento.countDocuments(filter)
  }

  async findById(id) {
    return await Evento.findById(id)
  }

  async create(eventData) {
    const nuevoEvento = new Evento(eventData)
    return await nuevoEvento.save()
  }

  async update(id, updateData) {
    return await Evento.findByIdAndUpdate(id, updateData, { returnDocument: 'after', runValidators: true })
  }
}

export default new EventDAO()