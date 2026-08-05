import Usuario from '../models/user.model.js'
import { hashPassword } from '../utils/hash.js'

export const obtenerTodosLosUsuarios = async () => {
  return await Usuario.find()
}

export const guardarNuevoUsuario = async (userData) => {
  const passwordHasheada = await hashPassword(userData.password)

  const nuevoUsuario = new Usuario({
    ...userData,
    password: passwordHasheada
  })

  return await nuevoUsuario.save()
}