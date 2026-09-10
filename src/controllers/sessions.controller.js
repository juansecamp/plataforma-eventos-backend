import passport from 'passport'
import { generateToken } from '../utils/jwt.js'
import { toUserDTO } from '../dtos/user.dto.js'

const COOKIE_MAX_AGE = 3600000 // 1 hora en milisegundos

export const registerSession = (req, res, next) => {
  passport.authenticate('register', { session: false }, (error, usuario, info) => {
    if (error) return next(error)

    if (!usuario) {
      const err = new Error(info?.message || 'No se pudo registrar el usuario')
      err.status = info?.status || 400
      return next(err)
    }

    res.status(201).json({ status: 'success', payload: toUserDTO(usuario) })
  })(req, res, next)
}

export const loginSession = (req, res, next) => {
  passport.authenticate('login', { session: false }, (error, usuario, info) => {
    if (error) return next(error)

    if (!usuario) {
      const err = new Error('Credenciales inválidas')
      err.status = 401
      return next(err)
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
  res.status(200).json({ status: 'success', payload: toUserDTO(req.user) })
}

export const logoutSession = (req, res) => {
  res.clearCookie('currentUser')
  res.status(200).json({ status: 'success', message: 'Sesión cerrada' })
}