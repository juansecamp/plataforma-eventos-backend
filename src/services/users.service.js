import userRepository from '../repositories/users.repository.js'
import { hashPassword } from '../utils/hash.js'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MIN_PASSWORD_LENGTH = 6

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

export const registrarUsuario = async ({ first_name, last_name, email, password }) => {
  if (!first_name || !last_name || !email || !password) {
    const error = new Error('Faltan campos obligatorios')
    error.status = 400
    throw error
  }

  const emailNormalizado = email.trim().toLowerCase()

  if (!EMAIL_REGEX.test(emailNormalizado)) {
    const error = new Error('El formato del email no es válido')
    error.status = 400
    throw error
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    const error = new Error(`La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres`)
    error.status = 400
    throw error
  }

  const existe = await userRepository.getUserByEmail(emailNormalizado)
  if (existe) {
    const error = new Error('El email ya está registrado')
    error.status = 409
    throw error
  }

  const passwordHasheada = await hashPassword(password)

  return await userRepository.createUser({
    first_name,
    last_name,
    email: emailNormalizado,
    password: passwordHasheada
  })
}