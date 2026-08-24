import userRepository from '../repositories/users.repository.js'
import { hashPassword } from '../utils/hash.js'

export const obtenerTodosLosUsuarios = async () => {
  const usuarios = await userRepository.getAllUsers()

  return usuarios.map((usuario) => ({
    id: usuario._id,
    first_name: usuario.first_name,
    last_name: usuario.last_name,
    email: usuario.email,
    role: usuario.role
  }))
}

export const guardarNuevoUsuario = async (userData) => {
  const passwordHasheada = await hashPassword(userData.password)

  return await userRepository.createUser({
    ...userData,
    password: passwordHasheada
  })
}