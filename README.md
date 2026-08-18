Dale, acá tenés el README completo y actualizado, con todo lo de esta entrega incorporado. Reemplazá todo el contenido del archivo por esto:

markdown
# Plataforma de Eventos e Inscripciones

Backend desarrollado con Node.js, Express y MongoDB para una plataforma de gestión de eventos e inscripciones. Proyecto correspondiente a la materia Backend II - Diseño y Arquitectura Backend, implementando una arquitectura modular por capas (rutas, controladores, servicios, repositorios, DAO, modelos, middlewares) con autenticación JWT (por header y por cookie) y control de acceso por roles.

## Temática

Plataforma de eventos: permite el registro de usuarios (con roles `user`, `organizer`, `admin`), la publicación de eventos, y la gestión de inscripciones/tickets, con permisos diferenciados según el rol de cada usuario.

## Tecnologías Utilizadas

- **Node.js** - Entorno de ejecución JavaScript
- **Express** - Framework web para Node.js
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **jsonwebtoken** - Generación y verificación de tokens JWT
- **bcrypt** - Hasheo de contraseñas
- **cookie-parser** - Lectura de cookies en las peticiones
- **dotenv** - Gestión de variables de entorno
- **nodemon** - Reinicio automático del servidor en desarrollo

## Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/juansecamp/plataforma-eventos-backend.git
```

2. Instalar las dependencias:
```bash
npm install
```

## Configuración

1. Copiar el archivo de ejemplo de variables de entorno:
```bash
cp .env.example .env
```

2. Completar las variables en el archivo `.env`:

| Variable | Descripción |
|---|---|
| `PORT` | Puerto en el que corre el servidor (ej: 8080) |
| `NODE_ENV` | Entorno de ejecución (`development` / `production`) |
| `MONGO_URL` | String de conexión a tu base de datos MongoDB Atlas |
| `JWT_SECRET` | Clave secreta para firmar los tokens JWT |
| `JWT_EXPIRES_IN` | Tiempo de expiración del token (ej: `1h`) |

## Uso

### Modo Desarrollo

```bash
npm run dev
```

El servidor se inicia en el puerto configurado en `.env` (por defecto 8080), levantando `server.js`, que a su vez utiliza la configuración de Express definida en `app.js`.

## Estructura del Proyecto

.
├── src/
│ ├── config/ # Configuración (conexión a la base de datos)
│ ├── controllers/ # Lógica de manejo de las rutas
│ ├── services/ # Lógica de negocio
│ ├── repositories/ # Capa de acceso a datos
│ ├── dao/ # Data Access Objects
│ ├── models/ # Modelos de Mongoose
│ ├── middlewares/ # Middlewares personalizados (autenticación y roles)
│ ├── routes/ # Definición de rutas de la API
│ └── utils/ # Utilidades (hash de contraseñas, JWT)
├── .env # Variables de entorno (no versionado)
├── .env.example # Ejemplo de variables de entorno
├── .gitignore # Archivos ignorados por Git
├── app.js # Configuración de Express (middlewares y rutas)
├── server.js # Punto de entrada: levanta el servidor
├── package.json # Dependencias y scripts
└── README.md # Documentación del proyecto


## Endpoints Disponibles

### Salud del servidor

- `GET /api/health` - Verifica que el servidor esté activo

### Usuarios

- `GET /api/users` - Listar usuarios (rol requerido: `admin`)
- `POST /api/users` - Registrar un nuevo usuario (roles: `user`, `organizer`, `admin`)

### Sesiones (Autenticación)

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/sessions/register` | Registrar un nuevo usuario |
| POST | `/api/sessions/login` | Iniciar sesión (setea cookie `currentUser` con el JWT) |
| GET | `/api/sessions/current` | Devuelve el usuario autenticado (requiere cookie válida) |
| POST | `/api/sessions/logout` | Cierra sesión (elimina la cookie `currentUser`) |

### Eventos

- `GET /api/events` - Listar eventos (roles: `user`, `organizer`, `admin`)
- `POST /api/events` - Crear un nuevo evento (roles: `organizer`, `admin`)

### Tickets

- `GET /api/tickets` - Listar tickets (rol requerido: `admin`)
- `POST /api/tickets` - Crear/comprar un ticket (roles: `user`, `organizer`, `admin`)

## Registro de usuarios (`POST /api/sessions/register`)

Registra un nuevo usuario en la plataforma.

### Campos esperados (body JSON)

| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `first_name` | string | Sí | Nombre del usuario |
| `last_name` | string | Sí | Apellido del usuario |
| `email` | string | Sí | Email válido (se normaliza a minúsculas y sin espacios) |
| `password` | string | Sí | Mínimo 6 caracteres |

El campo `role` **no se puede enviar desde el body**: todos los usuarios se registran con rol `user` por defecto.

### Ejemplo de request

```json
{
  "first_name": "Ana",
  "last_name": "Pérez",
  "email": "Ana@Mail.com ",
  "password": "Secreta123"
}
```

### Respuestas posibles

**201 Created** — registro exitoso (email normalizado, sin `password`):
```json
{
  "status": "success",
  "payload": {
    "id": "665f2a...",
    "first_name": "Ana",
    "last_name": "Pérez",
    "email": "ana@mail.com",
    "role": "user"
  }
}
```

**400 Bad Request** — campos faltantes, email con formato inválido, o contraseña de menos de 6 caracteres:
```json
{
  "status": "error",
  "message": "Faltan campos obligatorios"
}
```

**409 Conflict** — el email ya está registrado:
```json
{
  "status": "error",
  "message": "El email ya está registrado"
}
```

## Login (`POST /api/sessions/login`)

Valida las credenciales del usuario y, si son correctas, genera un JWT que se guarda en una cookie `currentUser` (httpOnly).

### Ejemplo de request

```json
{
  "email": "ana@mail.com",
  "password": "Secreta123"
}
```

### Respuestas posibles

**200 OK** — login correcto (además setea la cookie `currentUser`, httpOnly, `sameSite: lax`, expiración de 1 hora):
```json
{
  "status": "success",
  "message": "Login correcto"
}
```

**401 Unauthorized** — credenciales incorrectas (mensaje genérico, no se especifica si falló el email o la contraseña):
```json
{
  "status": "error",
  "message": "Credenciales inválidas"
}
```

## Usuario autenticado (`GET /api/sessions/current`)

Ruta protegida por el middleware `auth`, que lee la cookie `currentUser`, verifica el JWT y expone el payload en `req.user`.

### Respuestas posibles

**200 OK** — token válido:
```json
{
  "status": "success",
  "payload": {
    "id": "665f2a...",
    "email": "ana@mail.com",
    "role": "user"
  }
}
```

**401 Unauthorized** — no hay cookie, o el token es inválido/expirado:
```json
{
  "status": "error",
  "message": "No autenticado"
}
```

## Logout (`POST /api/sessions/logout`)

Elimina la cookie `currentUser`.

### Respuesta

**200 OK**:
```json
{
  "status": "success",
  "message": "Sesión cerrada"
}
```

### Cómo probar el flujo completo

1. Levantar el servidor con `npm run dev`.
2. `POST /api/sessions/register` con los datos de un usuario nuevo.
3. `POST /api/sessions/login` con ese mismo email y contraseña (Postman/Thunder Client guarda la cookie automáticamente).
4. `GET /api/sessions/current` → debería devolver `200` con los datos del usuario.
5. `POST /api/sessions/logout` → elimina la cookie.
6. `GET /api/sessions/current` de nuevo → debería devolver `401`.
7. Verificar en MongoDB que la contraseña se guarda hasheada (formato `$2b$10$...`), nunca en texto plano.
8. Verificar que ninguna respuesta incluye el campo `password`.

## Autenticación

El proyecto usa dos mecanismos de autenticación, según la ruta:

- **Rutas de `users`, `events` y `tickets`**: protegidas por el middleware `handlePolicies`, que exige un JWT enviado por header:

Authorization: Bearer <token>

Ese token se obtiene haciendo login en `POST /api/sessions/login` (mismo JWT que se guarda en la cookie), y `handlePolicies` valida que el `role` incluido en el token tenga permiso para la ruta solicitada.

- **Ruta `GET /api/sessions/current`**: protegida por el middleware `auth`, que en cambio lee el JWT desde la cookie `currentUser` (no desde el header), pensada para el flujo típico de sesión de un usuario logueado en un navegador.