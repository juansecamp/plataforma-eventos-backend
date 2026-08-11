import userRepository from '../repositories/user.repository.js'
import { hashPassword } from '../utils/hash.js'

export const obtenerTodosLosUsuarios = async () => {
  return await userRepository.getAllUsers()
}

export const guardarNuevoUsuario = async (userData) => {
  const passwordHasheada = await hashPassword(userData.password)

  return await userRepository.createUser({
    ...userData,
    password: passwordHasheada
  })
}