import Usuario from '../models/user.model.js'

class UserDAO {
  async findAll() {
    return await Usuario.find()
  }

  async findById(id) {
    return await Usuario.findById(id)
  }

  async findByEmail(email) {
    return await Usuario.findOne({ email })
  }

  async create(userData) {
    const nuevoUsuario = new Usuario(userData)
    return await nuevoUsuario.save()
  }
}

export default new UserDAO()