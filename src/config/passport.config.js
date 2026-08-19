import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import userRepository from '../repositories/users.repository.js'
import { hashPassword, comparePassword } from '../utils/hash.js'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MIN_PASSWORD_LENGTH = 6

// Extrae el JWT desde la cookie "currentUser" en vez del header Authorization
const cookieExtractor = (req) => {
  if (req && req.cookies) {
    return req.cookies['currentUser']
  }
  return null
}

const initializePassport = () => {
  // Estrategia de REGISTRO
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
          const { first_name, last_name } = req.body

          if (!first_name || !last_name || !email || !password) {
            return done(null, false, { message: 'Faltan campos obligatorios', status: 400 })
          }

          const emailNormalizado = email.trim().toLowerCase()

          if (!EMAIL_REGEX.test(emailNormalizado)) {
            return done(null, false, { message: 'El formato del email no es válido', status: 400 })
          }

          if (password.length < MIN_PASSWORD_LENGTH) {
            return done(null, false, {
              message: `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres`,
              status: 400
            })
          }

          const existe = await userRepository.getUserByEmail(emailNormalizado)
          if (existe) {
            return done(null, false, { message: 'El email ya está registrado', status: 409 })
          }

          const passwordHasheada = await hashPassword(password)

          const nuevoUsuario = await userRepository.createUser({
            first_name,
            last_name,
            email: emailNormalizado,
            password: passwordHasheada
          })

          return done(null, nuevoUsuario)
        } catch (error) {
          return done(error)
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