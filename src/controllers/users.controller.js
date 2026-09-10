import { obtenerTodosLosUsuarios, guardarNuevoUsuario } from '../services/users.service.js'
import { toUserDTO } from '../dtos/user.dto.js'

export const getUsers = async (req, res, next) => {
  try {
    const usuarios = await obtenerTodosLosUsuarios()
    res.status(200).json({ status: 'success', payload: usuarios.map(toUserDTO) })
  } catch (error) {
    next(error)
  }
}

export const createUser = async (req, res, next) => {
  try {
    const usuarioGuardado = await guardarNuevoUsuario(req.body)
    res.status(201).json({ status: 'success', payload: toUserDTO(usuarioGuardado) })
  } catch (error) {
    next(error)
  }
}