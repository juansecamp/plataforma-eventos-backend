import userRepository from '../repositories/users.repository.js'
import { hashPassword, comparePassword } from '../utils/hash.js'
import { generateToken } from '../utils/jwt.js'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MIN_PASSWORD_LENGTH = 6

export const loginUsuario = async (email, password) => {
  const usuario = await userRepository.getUserByEmail(email)
  if (!usuario) {
    return null
  }

  const passwordValida = await comparePassword(password, usuario.password)
  if (!passwordValida) {
    return null
  }

  const token = generateToken({ id: usuario._id, role: usuario.role })

  return { usuario, token }
}

export const registrarUsuario = async (userData) => {
  const { first_name, last_name, email, password } = userData

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

  // Ojo: NO se toma "role" del body. Solo estos 4 campos.
  // El modelo asigna "user" por defecto, sin importar qué mande el cliente.
  const nuevoUsuario = await userRepository.createUser({
    first_name,
    last_name,
    email: emailNormalizado,
    password: passwordHasheada
  })

  return {
    id: nuevoUsuario._id,
    first_name: nuevoUsuario.first_name,
    last_name: nuevoUsuario.last_name,
    email: nuevoUsuario.email,
    role: nuevoUsuario.role
  }
}