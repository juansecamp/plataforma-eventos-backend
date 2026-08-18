import { loginUsuario, registrarUsuario } from '../services/sessions.service.js'

const COOKIE_MAX_AGE = 3600000 // 1 hora en milisegundos

export const registerSession = async (req, res) => {
  try {
    const nuevoUsuario = await registrarUsuario(req.body)
    res.status(201).json({ status: 'success', payload: nuevoUsuario })
  } catch (error) {
    const status = error.status || 500
    res.status(status).json({ status: 'error', message: error.message })
  }
}

export const loginSession = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(401).json({ status: 'error', message: 'Credenciales inválidas' })
    }

    const resultado = await loginUsuario(email, password)

    if (!resultado) {
      return res.status(401).json({ status: 'error', message: 'Credenciales inválidas' })
    }

    const { token } = resultado

    res.cookie('currentUser', token, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: COOKIE_MAX_AGE,
      secure: process.env.NODE_ENV === 'production'
    })

    res.status(200).json({ status: 'success', message: 'Login correcto' })
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error en el inicio de sesión' })
  }
}

export const currentSession = (req, res) => {
  const { id, email, role } = req.user
  res.status(200).json({ status: 'success', payload: { id, email, role } })
}

export const logoutSession = (req, res) => {
  res.clearCookie('currentUser')
  res.status(200).json({ status: 'success', message: 'Sesión cerrada' })
}