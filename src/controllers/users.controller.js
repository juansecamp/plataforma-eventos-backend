import { obtenerTodosLosUsuarios, guardarNuevoUsuario } from '../services/users.service.js'

export const getUsers = async (req, res) => {
  try {
    const usuarios = await obtenerTodosLosUsuarios()
    res.status(200).json(usuarios)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los usuarios', detalle: error.message })
  }
}

export const createUser = async (req, res) => {
  try {
    const usuarioGuardado = await guardarNuevoUsuario(req.body)
    res.status(201).json(usuarioGuardado)
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el usuario', detalle: error.message })
  }
}
