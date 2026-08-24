# Plataforma de Eventos e Inscripciones

Backend desarrollado con Node.js, Express y MongoDB para una plataforma de gestión de eventos e inscripciones. Proyecto correspondiente a la materia Backend II - Diseño y Arquitectura Backend, implementando una arquitectura modular por capas (rutas, controladores, servicios, repositorios, DAO, modelos, middlewares) con autenticación centralizada mediante Passport.js, JWT y cookies HTTP Only, además de un sistema de autorización por roles.

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
- **passport** - Framework de autenticación con estrategias
- **passport-local** - Estrategia de autenticación con email/password
- **passport-jwt** - Estrategia de autenticación con JWT
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
│ ├── config/ # Configuración (conexión a la base de datos, Passport)
│ ├── controllers/ # Lógica de manejo de las rutas
│ ├── services/ # Lógica de negocio
│ ├── repositories/ # Capa de acceso a datos
│ ├── dao/ # Data Access Objects
│ ├── models/ # Modelos de Mongoose
│ ├── middlewares/ # auth (autenticación) y authorize (autorización por roles)
│ ├── routes/ # Definición de rutas de la API
│ └── utils/ # Utilidades (hash de contraseñas, JWT)
├── .env # Variables de entorno (no versionado)
├── .env.example # Ejemplo de variables de entorno
├── .gitignore # Archivos ignorados por Git
├── app.js # Configuración de Express (middlewares, Passport y rutas)
├── server.js # Punto de entrada: levanta el servidor
├── package.json # Dependencias y scripts
└── README.md # Documentación del proyecto


## Endpoints Disponibles

### Salud del servidor

- `GET /api/health` - Verifica que el servidor esté activo

### Usuarios

- `GET /api/users` - Listar usuarios, sin exponer contraseñas (rol requerido: `admin`)
- `POST /api/users` - Registrar un nuevo usuario (ruta pública, sin autenticación)

### Sesiones (Autenticación)

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/sessions/register` | Registrar un nuevo usuario (usa la estrategia `register` de Passport) |
| POST | `/api/sessions/login` | Iniciar sesión (usa la estrategia `login`; setea cookie `currentUser` con el JWT) |
| GET | `/api/sessions/current` | Devuelve el usuario autenticado (usa la estrategia `current`, requiere cookie válida) |
| POST | `/api/sessions/logout` | Cierra sesión (elimina la cookie `currentUser`, no pasa por Passport) |

### Eventos

- `GET /api/events` - Listar eventos (cualquier usuario autenticado)
- `POST /api/events` - Crear un nuevo evento (roles: `organizer`, `admin`)
- `PUT /api/events/:id` - Modificar un evento (roles: `organizer` solo el suyo, `admin` cualquiera)

### Tickets

- `GET /api/tickets` - Listar tickets (rol requerido: `admin`)
- `POST /api/tickets` - Crear/comprar un ticket (cualquier usuario autenticado)

## Autenticación centralizada con Passport.js

El sistema de autenticación fue refactorizado para centralizar su lógica en estrategias de [Passport.js](http://www.passportjs.org/), definidas en `src/config/passport.config.js`.

### Estrategias implementadas

| Estrategia | Tipo | Usada en | Qué hace |
|---|---|---|---|
| `register` | `passport-local` | `POST /api/sessions/register` | Valida campos, normaliza el email, verifica que no exista otro usuario con ese email, hashea la contraseña con bcrypt y crea el usuario |
| `login` | `passport-local` | `POST /api/sessions/login` | Busca el usuario por email y compara la contraseña con bcrypt. Si las credenciales son válidas, pasa el usuario al controller |
| `current` | `passport-jwt` | `GET /api/sessions/current` | Extrae el JWT desde la cookie `currentUser`, lo verifica, y expone el payload en `req.user` |

**Importante:** las estrategias `register` y `login` no generan el JWT ni setean la cookie — esa responsabilidad es del **controller** (`sessions.controller.js`), que actúa después de que `passport.authenticate(...)` confirma que la operación fue exitosa.

### Preparado para providers externos

`passport.config.js` está organizado para que agregar nuevas estrategias (por ejemplo, login con Google o GitHub) sea tan simple como sumar un nuevo bloque `passport.use('nombre-estrategia', new Strategy(...))` dentro de `initializePassport()`, sin necesidad de tocar `app.js` ni el resto de la aplicación.

## Roles y autorización

El sistema separa claramente dos responsabilidades mediante dos middlewares reutilizables:

- **`auth`** (`src/middlewares/auth.middleware.js`): valida que exista una sesión activa. Lee el JWT desde la cookie `currentUser`, lo verifica, y guarda el payload en `req.user`. Si no hay cookie o el token es inválido/expirado, responde **401 (No autenticado)**.
- **`authorize`** (`src/middlewares/authorize.middleware.js`): valida que el usuario autenticado tenga el rol necesario para la acción. Recibe como parámetro un array de roles permitidos y lo compara contra `req.user.role`. Si el rol no está permitido, responde **403 (Sin permisos)**.

Ambos middlewares se usan siempre en conjunto y en ese orden en las rutas protegidas: primero `auth` (¿quién sos?), después `authorize` (¿qué podés hacer?).

### Diferencia entre 401 y 403

| Código | Significado | Cuándo ocurre |
|---|---|---|
| `401 Unauthorized` | No autenticado | No hay cookie de sesión, o el token es inválido/expirado |
| `403 Forbidden` | Sin permisos | Hay sesión válida, pero el rol del usuario no puede realizar esa acción |

### Matriz de permisos

| Acción | `user` | `organizer` | `admin` |
|---|---|---|---|
| Consultar eventos publicados | ✅ | ✅ | ✅ |
| Crear eventos | ❌ | ✅ | ✅ |
| Modificar/cancelar eventos propios | ❌ | ✅ | ✅ |
| Modificar cualquier evento | ❌ | ❌ | ✅ |
| Ver todos los usuarios | ❌ | ❌ | ✅ |
| Crear/comprar tickets | ✅ | ✅ | ✅ |

### Rutas protegidas

| Ruta | Middlewares | Roles permitidos |
|---|---|---|
| `GET /api/sessions/current` | Estrategia `current` de Passport | Cualquier usuario autenticado |
| `GET /api/events` | `auth` | Cualquier usuario autenticado |
| `POST /api/events` | `auth`, `authorize` | `organizer`, `admin` |
| `PUT /api/events/:id` | `auth`, `authorize` + validación de propiedad en el service | `organizer` (solo eventos propios), `admin` (cualquiera) |
| `GET /api/users` | `auth`, `authorize` | `admin` |
| `GET /api/tickets` | `auth`, `authorize` | `admin` |
| `POST /api/tickets` | `auth` | Cualquier usuario autenticado |

### Propiedad de recursos

Un `organizer` solo puede modificar (`PUT /api/events/:id`) los eventos que él mismo creó. Esta validación no vive en el middleware (que solo verifica el rol), sino en `events.service.js`: se compara el campo `organizer` del evento contra el `id` del usuario autenticado. Si no coinciden, y el usuario tampoco es `admin`, se responde `403`.

### Roles y registro

El campo `role` del modelo `User` acepta los valores `user`, `organizer` y `admin`, con `user` como valor por defecto. El endpoint público `POST /api/sessions/register` **no permite** especificar el rol desde el body — todo usuario nuevo se crea siempre como `user`. La asignación de roles `organizer` o `admin` es una operación administrativa (por ahora, manual en la base de datos), no autoservicio.

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

**400 Bad Request** — campos faltantes, email con formato inválido, o contraseña de menos de 6 caracteres.

**409 Conflict** — el email ya está registrado.

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

**200 OK** — login correcto (además setea la cookie `currentUser`, httpOnly, `sameSite: lax`, expiración configurable):
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

Ruta protegida por la estrategia `current` de Passport, que lee la cookie `currentUser`, verifica el JWT y expone el payload en `req.user`.

**200 OK**:
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

**401 Unauthorized** — no hay cookie, o el token es inválido/expirado.

## Logout (`POST /api/sessions/logout`)

Elimina la cookie `currentUser`. No requiere pasar por Passport.

**200 OK**:
```json
{
  "status": "success",
  "message": "Sesión cerrada"
}
```

## Eventos: crear y modificar

### `POST /api/events` (roles: `organizer`, `admin`)

```json
{
  "title": "Congreso Tech 2026",
  "description": "Un evento de tecnología"
}
```

**201 Created**:
```json
{
  "status": "success",
  "payload": {
    "id": "6690...",
    "title": "Congreso Tech 2026",
    "organizer": "665f2a..."
  }
}
```

**403 Forbidden** (rol `user`):
```json
{
  "status": "error",
  "message": "No tenés permisos para realizar esta acción"
}
```

### `PUT /api/events/:id` (roles: `organizer` solo el suyo, `admin` cualquiera)

**200 OK** si el usuario es el dueño del evento o es `admin`.

**403 Forbidden** si un `organizer` intenta modificar un evento que no le pertenece:
```json
{
  "status": "error",
  "message": "No podés modificar un evento que no te pertenece"
}
```

## Cómo probar el flujo completo

1. Levantar el servidor con `npm run dev`.
2. Registrar un usuario (`POST /api/sessions/register`) → queda con rol `user`.
3. (Opcional, para probar roles) cambiar manualmente el rol a `organizer` o `admin` en MongoDB.
4. Hacer login (`POST /api/sessions/login`) → se guarda la cookie `currentUser`.
5. `GET /api/sessions/current` → debería devolver `200` con los datos del usuario.
6. Probar `POST /api/events` con distintos roles y confirmar 201/403 según corresponda.
7. Crear un evento con un `organizer`, y probar `PUT /api/events/:id` con otro `organizer` distinto (403) y con un `admin` (200).
8. `POST /api/sessions/logout` → elimina la cookie.
9. `GET /api/sessions/current` de nuevo → debería devolver `401`.
10. Verificar en MongoDB que la contraseña se guarda hasheada, nunca en texto plano.
11. Verificar que ninguna respuesta (incluyendo `GET /api/users`) incluye el campo `password`.