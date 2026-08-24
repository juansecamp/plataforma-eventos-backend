import { obtenerTodosLosUsuarios, guardarNuevoUsuario } from '../services/users.service.js'

export const getUsers = async (req, res) => {
  try {
    const usuarios = await obtenerTodosLosUsuarios()
    res.status(200).json({ status: 'success', payload: usuarios })
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error al obtener los usuarios' })
  }
}

export const createUser = async (req, res) => {
  try {
    const usuarioGuardado = await guardarNuevoUsuario(req.body)
    res.status(201).json({
      status: 'success',
      payload: {
        id: usuarioGuardado._id,
        first_name: usuarioGuardado.first_name,
        last_name: usuarioGuardado.last_name,
        email: usuarioGuardado.email,
        role: usuarioGuardado.role
      }
    })
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error al crear el usuario' })
  }
}