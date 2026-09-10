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

  async countUsers(filter) {
    return await usersDAO.count(filter)
  }

  async createUser(userData) {
    return await usersDAO.create(userData)
  }

  async updateUser(id, updateData) {
    return await usersDAO.update(id, updateData)
  }
}

export default new UsersRepository()