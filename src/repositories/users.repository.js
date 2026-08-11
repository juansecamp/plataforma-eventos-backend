import usersDAO from '../dao/users.dao.js'

class UsersRepository {
  async getAllUsers() {
    return await usersDAO.findAll()
  }

  async getUserById(id) {
    return await usersDAO.findById(id)
  }

  async getUserByEmail(email) {
    return await usersDAO.findByEmail(email)
  }

  async createUser(userData) {
    return await usersDAO.create(userData)
  }
}

export default new UsersRepository()