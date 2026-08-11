import { loginUsuario, registrarUsuario } from '../services/sessions.service.js'

export const loginSession = async (req, res) => {
  try {
    const { email, password } = req.body

    const resultado = await loginUsuario(email, password)

    if (!resultado) {
      return res.status(401).json({ error: 'Credenciales inválidas' })
    }

    const { usuario, token } = resultado

    res.status(200).json({
      message: 'Inicio de sesión exitoso',
      token,
      usuario: { email: usuario.email, name: usuario.first_name, role: usuario.role }
    })
  } catch (error) {
    res.status(500).json({ error: 'Error en el inicio de sesión', detalle: error.message })
  }
}

export const registerSession = async (req, res) => {
  try {
    const nuevoUsuario = await registrarUsuario(req.body)
    res.status(201).json({ status: 'success', payload: nuevoUsuario })
  } catch (error) {
    const status = error.status || 500
    res.status(status).json({ status: 'error', message: error.message })
  }
}