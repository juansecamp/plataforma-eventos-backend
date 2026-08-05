import Usuario from '../models/user.model.js'
import { hashPassword, comparePassword } from '../utils/hash.js'
import { generateToken } from '../utils/jwt.js'

export const loginUsuario = async (email, password) => {
  const usuario = await Usuario.findOne({ email })
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
  const { email, password } = userData

  const existe = await Usuario.findOne({ email })
  if (existe) {
    throw new Error('El usuario ya existe')
  }

  const passwordHasheada = await hashPassword(password)

  const nuevoUsuario = new Usuario({
    ...userData,
    password: passwordHasheada
  })

  return await nuevoUsuario.save()
}