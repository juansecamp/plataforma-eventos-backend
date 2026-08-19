import passport from 'passport'
import { generateToken } from '../utils/jwt.js'

const COOKIE_MAX_AGE = 3600000 // 1 hora en milisegundos

export const registerSession = (req, res, next) => {
  passport.authenticate('register', { session: false }, (error, usuario, info) => {
    if (error) {
      return res.status(500).json({ status: 'error', message: 'Error en el registro' })
    }

    if (!usuario) {
      const status = info?.status || 400
      return res.status(status).json({ status: 'error', message: info?.message || 'No se pudo registrar el usuario' })
    }

    res.status(201).json({
      status: 'success',
      payload: {
        id: usuario._id,
        first_name: usuario.first_name,
        last_name: usuario.last_name,
        email: usuario.email,
        role: usuario.role
      }
    })
  })(req, res, next)
}

export const loginSession = (req, res, next) => {
  passport.authenticate('login', { session: false }, (error, usuario, info) => {
    if (error) {
      return res.status(500).json({ status: 'error', message: 'Error en el inicio de sesión' })
    }

    if (!usuario) {
      return res.status(401).json({ status: 'error', message: 'Credenciales inválidas' })
    }

    const token = generateToken({
      id: usuario._id,
      email: usuario.email,
      role: usuario.role
    })

    res.cookie('currentUser', token, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: COOKIE_MAX_AGE,
      secure: process.env.NODE_ENV === 'production'
    })

    res.status(200).json({ status: 'success', message: 'Login correcto' })
  })(req, res, next)
}

export const currentSession = (req, res) => {
  const { id, email, role } = req.user
  res.status(200).json({ status: 'success', payload: { id, email, role } })
}

export const logoutSession = (req, res) => {
  res.clearCookie('currentUser')
  res.status(200).json({ status: 'success', message: 'Sesión cerrada' })
}