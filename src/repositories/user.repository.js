import userDAO from '../dao/user.dao.js'

class UserRepository {
  async getAllUsers() {
    return await userDAO.findAll()
  }

  async getUserById(id) {
    return await userDAO.findById(id)
  }

  async getUserByEmail(email) {
    return await userDAO.findByEmail(email)
  }

  async createUser(userData) {
    return await userDAO.create(userData)
  }
}

export default new UserRepository()