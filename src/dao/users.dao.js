import Usuario from '../models/user.model.js'

class UsersDAO {
  async findAll() {
    return await Usuario.find()
  }

  async findById(id) {
    return await Usuario.findById(id)
  }

  async findOne(filter) {
    return await Usuario.findOne(filter)
  }

  async findByEmail(email) {
    return await Usuario.findOne({ email })
  }

  async count(filter = {}) {
    return await Usuario.countDocuments(filter)
  }

  async create(userData) {
    const nuevoUsuario = new Usuario(userData)
    return await nuevoUsuario.save()
  }

  async update(id, updateData) {
    return await Usuario.findByIdAndUpdate(id, updateData, { returnDocument: 'after', runValidators: true })
  }
}

export default new UsersDAO()