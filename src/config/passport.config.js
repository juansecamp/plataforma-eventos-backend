import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import userRepository from '../repositories/users.repository.js'
import { comparePassword } from '../utils/hash.js'
import { registrarUsuario } from '../services/users.service.js'

// Extrae el JWT desde la cookie "currentUser" en vez del header Authorization
const cookieExtractor = (req) => {
  if (req && req.cookies) {
    return req.cookies['currentUser']
  }
  return null
}

const initializePassport = () => {
  // Estrategia de REGISTRO: delega toda la lógica de negocio al service
  passport.use(
    'register',
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
      },
      async (req, email, password, done) => {
        try {
          const nuevoUsuario = await registrarUsuario(req.body)
          return done(null, nuevoUsuario)
        } catch (error) {
          return done(null, false, { message: error.message, status: error.status })
        }
      }
    )
  )

  // Estrategia de LOGIN
  passport.use(
    'login',
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password'
      },
      async (email, password, done) => {
        try {
          if (!email || !password) {
            return done(null, false, { message: 'Credenciales inválidas' })
          }

          const usuario = await userRepository.getUserByEmail(email.trim().toLowerCase())
          if (!usuario) {
            return done(null, false, { message: 'Credenciales inválidas' })
          }

          const passwordValida = await comparePassword(password, usuario.password)
          if (!passwordValida) {
            return done(null, false, { message: 'Credenciales inválidas' })
          }

          return done(null, usuario)
        } catch (error) {
          return done(error)
        }
      }
    )
  )

  // Estrategia CURRENT (lee el JWT desde la cookie)
  passport.use(
    'current',
    new JwtStrategy(
      {
        jwtFromRequest: cookieExtractor,
        secretOrKey: process.env.JWT_SECRET
      },
      async (payload, done) => {
        try {
          return done(null, payload)
        } catch (error) {
          return done(error)
        }
      }
    )
  )
}

export default initializePassport