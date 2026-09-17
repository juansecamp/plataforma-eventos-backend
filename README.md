# Plataforma de Eventos e Inscripciones

Backend desarrollado con Node.js, Express y MongoDB para una plataforma de gestión de eventos e inscripciones. Proyecto final de la materia Backend II - Diseño y Arquitectura Backend, implementando una arquitectura profesional por capas (rutas, controladores, servicios, repositorios, DAO, DTO, modelos, middlewares) con autenticación centralizada mediante Passport.js, JWT y cookies HTTP Only, autorización por roles, gestión completa de eventos, sistema de inscripciones con control de cupos, y notificaciones por email.

## Temática

Plataforma de eventos: permite el registro de usuarios (con roles `user`, `organizer`, `admin`), la publicación y gestión de eventos, y la gestión de inscripciones/tickets con control de cupos, con permisos diferenciados según el rol de cada usuario.

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
- **nodemailer** - Envío de emails (notificaciones de inscripción)
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
| `MAIL_HOST` | Host del servidor SMTP (ej: `smtp.ethereal.email`) |
| `MAIL_PORT` | Puerto del servidor SMTP (ej: `587`) |
| `MAIL_USER` | Usuario para autenticarse en el servidor SMTP |
| `MAIL_PASS` | Contraseña para autenticarse en el servidor SMTP |
| `MAIL_FROM` | Dirección de email que figura como remitente |

Para pruebas, se puede usar [Ethereal Email](https://ethereal.email/create) (gratuito, no envía emails reales, permite verlos en una bandeja de prueba online).

## Uso

### Modo Desarrollo

```bash
npm run dev
```

El servidor se inicia en el puerto configurado en `.env` (por defecto 8080), levantando `server.js`, que a su vez utiliza la configuración de Express definida en `app.js`.

## Estructura del Proyecto

```
.
├── src/
│   ├── config/          # Configuración (conexión a la base de datos, Passport)
│   ├── controllers/     # Coordinan request/response; no importan modelos ni contienen lógica de negocio
│   ├── services/        # Lógica de negocio: validaciones, cupos, estados, permisos sobre recursos propios
│   ├── repositories/    # Métodos orientados al dominio; usan el DAO, nunca importan modelos
│   ├── dao/              # Únicos archivos que importan modelos de Mongoose; acceso a datos puro
│   ├── dto/              # Dan forma a las respuestas; filtran siempre datos sensibles (nunca exponen password)
│   ├── models/           # Modelos de Mongoose
│   ├── middlewares/      # auth (autenticación), authorize (roles), error (manejo centralizado de errores)
│   ├── routes/           # Definición de rutas de la API
│   └── utils/            # Utilidades (hash de contraseñas, JWT, envío de email)
├── .env                  # Variables de entorno (no versionado)
├── .env.example           # Ejemplo de variables de entorno
├── .gitignore             # Archivos ignorados por Git
├── app.js                  # Configuración de Express (middlewares, Passport, rutas, manejo de errores)
├── server.js               # Punto de entrada: levanta el servidor
├── package.json             # Dependencias y scripts
└── README.md                 # Documentación del proyecto
```

## Arquitectura en capas

El proyecto sigue el patrón **DAO → Repository → Service → Controller**, más una capa de **DTOs** para las respuestas y un **middleware centralizado de errores**.

| Capa | Ubicación | Responsabilidad |
|---|---|---|
| **DAO** | `src/dao/` | Única capa que importa modelos de Mongoose directamente. Expone métodos de acceso a datos puros: `findById`, `findOne`, `create`, `update`, `count`, etc. No conoce reglas de negocio. Las consultas de agregación pesadas (como el cálculo de cupos ocupados) se resuelven con el operador `aggregate` de MongoDB en lugar de traer documentos a memoria. |
| **Repository** | `src/repositories/` | Usa el DAO correspondiente; nunca importa modelos directamente. Expone métodos orientados al dominio: `getUserByEmail`, `findPublishedEvents`, `countActiveTicketsByEvent`, `cancelTicket`, etc. |
| **Service** | `src/services/` | Consume repositories (nunca DAOs ni modelos). Concentra toda la lógica de negocio: validación de campos, control de cupos, estados de eventos/tickets, duplicados, permisos sobre recursos propios, envío de email. La lógica de registro de usuarios vive acá (no en Passport, que solo la invoca). |
| **Controller** | `src/controllers/` | Solo coordina request/response: extrae datos de `body`/`params`/`query`, llama al service correspondiente, pasa el resultado por el DTO, y responde (o delega el error con `next(error)`). No calcula cupos, no valida estados ni resuelve reglas de negocio. No importa modelos de Mongoose. |
| **DTO** | `src/dto/` | Da forma a las respuestas de la API. Existen DTOs para usuario (`user.dto.js`), evento (`event.dto.js`) y ticket (`ticket.dto.js`). Ninguna respuesta expone `password`, ni siquiera hasheada — ni en el payload de la API ni en el JWT. Si un documento viene con datos relacionados vía `populate` (por ejemplo, el evento dentro de un ticket), el DTO también filtra esos datos relacionados. |
| **Middleware de errores** | `src/middlewares/error.middleware.js` | Middleware centralizado de Express. Los controllers no arman la respuesta de error a mano: llaman a `next(error)`, y este middleware decide el código HTTP según `error.status` (400/401/403/404/409), o responde `500` genérico sin exponer detalles internos si el error no tiene status definido. |

### Flujo de una petición

```
Ruta → Middleware (auth/authorize) → Controller → Service → Repository → DAO → Modelo (Mongoose)
                                          ↓
                                    DTO (da forma a la respuesta)
                                          ↓
                                    Middleware de errores (si algo falla)
```

## Roles

El sistema define tres roles, almacenados en el campo `role` del modelo `User`:

| Rol | Descripción |
|---|---|
| `user` | Rol por defecto de todo usuario registrado públicamente. Puede consultar eventos, inscribirse, ver y cancelar sus propios tickets. |
| `organizer` | Puede crear eventos y modificar/cancelar únicamente los eventos que él mismo creó. |
| `admin` | Acceso total: puede modificar cualquier evento (sin importar quién lo creó), listar todos los usuarios y todos los tickets de cualquier evento. |

El endpoint público `POST /api/sessions/register` **no permite** especificar el rol desde el body — todo usuario nuevo se crea siempre como `user`. La asignación de roles `organizer` o `admin` es una operación administrativa (hoy manual, en la base de datos), no autoservicio.

### Autenticación vs. autorización

- **`auth`** (`src/middlewares/auth.middleware.js`): valida que exista una sesión activa (lee el JWT desde la cookie `currentUser`). Si no hay cookie o el token es inválido/expirado, responde **401 (No autenticado)**.
- **`authorize`** (`src/middlewares/authorize.middleware.js`): valida que el usuario autenticado tenga el rol necesario para la acción. Si el rol no está permitido, responde **403 (Sin permisos)**.
- Para acciones sobre un recurso propio (modificar un evento, cancelar un ticket), la validación de **propiedad** se hace en el service, comparando el dueño del recurso contra el usuario autenticado — un `admin` siempre puede actuar sobre cualquier recurso.

## Usuarios de prueba (o cómo crearlos)

El proyecto no trae una seed automática. Para probar los distintos roles:

1. Registrar un usuario con `POST /api/sessions/register` (queda con rol `user` por defecto).
2. Para probar como `organizer` o `admin`, editar manualmente el campo `role` de ese usuario en MongoDB Atlas (Browse Collections → colección `users` → editar el documento → cambiar `"role": "user"` a `"organizer"` o `"admin"`).
3. Volver a hacer login con ese usuario para obtener un JWT actualizado con el nuevo rol (el token viejo sigue teniendo el rol anterior hasta que expire).

Usuarios ya existentes en la base de datos de desarrollo, uno por cada rol:

| Email | Password | Rol |
|---|---|---|
| `juan@test.com` | `123456` | `admin` |
| `marta@mail.com` | `Secreta123` | `organizer` |
| `ana@mail.com` | `Secreta123` | `user` |

(Si se clona el proyecto con una base de datos vacía, seguir el patrón de la sección anterior: registrar un usuario nuevo y, si se necesita `organizer` o `admin`, editar el campo `role` manualmente en MongoDB.)

## Endpoints Disponibles

### Salud del servidor

- `GET /api/health` - Verifica que el servidor esté activo

### Usuarios

- `GET /api/users` - Listar usuarios, sin exponer contraseñas (rol requerido: `admin`)
- `POST /api/users` - Registrar un nuevo usuario (ruta pública, sin autenticación)

### Sesiones (Autenticación)

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/sessions/register` | Registrar un nuevo usuario (usa la estrategia `register` de Passport, que delega la lógica de negocio al service) |
| POST | `/api/sessions/login` | Iniciar sesión (usa la estrategia `login`; setea cookie `currentUser` con el JWT) |
| GET | `/api/sessions/current` | Devuelve el usuario autenticado (usa la estrategia `current`, requiere cookie válida) |
| POST | `/api/sessions/logout` | Cierra sesión (elimina la cookie `currentUser`) |

### Eventos

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| GET | `/api/events` | Público | Lista eventos con filtros, paginación y ordenamiento |
| GET | `/api/events/:id` | Público | Consulta un evento por id |
| POST | `/api/events` | `organizer`, `admin` | Crea un evento nuevo |
| PUT | `/api/events/:id` | Dueño del evento o `admin` | Modifica un evento existente |
| PATCH | `/api/events/:id/status` | Dueño del evento o `admin` | Cambia el estado del evento (ej. publicarlo, cancelarlo) |

### Tickets / Inscripciones

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| POST | `/api/events/:eid/tickets` | Autenticado | Inscribirse a un evento |
| GET | `/api/tickets/my-tickets` | Autenticado | Ver los propios tickets (con datos del evento vía `populate`) |
| GET | `/api/events/:eid/tickets` | Organizador dueño del evento, o `admin` | Ver todos los tickets de un evento |
| PATCH | `/api/tickets/:tid/cancel` | Dueño del ticket, o `admin` | Cancelar una inscripción |

## Registro de usuarios (`POST /api/sessions/register`)

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

**201 Created** (email normalizado, sin `password`):
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

**400 Bad Request** — campos faltantes, email inválido, o contraseña de menos de 6 caracteres.

**409 Conflict** — el email ya está registrado.

## Login (`POST /api/sessions/login`)

```json
{
  "email": "ana@mail.com",
  "password": "Secreta123"
}
```

**200 OK** (además setea la cookie `currentUser`, httpOnly, `sameSite: lax`, expiración configurable):
```json
{ "status": "success", "message": "Login correcto" }
```

**401 Unauthorized** — credenciales incorrectas (mensaje genérico, no distingue si falló el email o la contraseña):
```json
{ "status": "error", "message": "Credenciales inválidas" }
```

## Usuario autenticado (`GET /api/sessions/current`)

**200 OK**:
```json
{
  "status": "success",
  "payload": { "id": "665f2a...", "email": "ana@mail.com", "role": "user" }
}
```

**401 Unauthorized** — no hay cookie, o el token es inválido/expirado.

## Logout (`POST /api/sessions/logout`)

**200 OK**:
```json
{ "status": "success", "message": "Sesión cerrada" }
```

## Eventos

Modelo `Event`:

| Campo | Tipo | Descripción |
|---|---|---|
| `title` | string | Obligatorio |
| `description` | string | Obligatorio |
| `category` | string | Obligatorio |
| `date` | Date | Obligatorio. No puede ser una fecha pasada al crear el evento |
| `location` | string | Obligatorio |
| `capacity` | number | Obligatorio. Debe ser mayor a 0 |
| `price` | number | Opcional (default 0). No puede ser negativo |
| `status` | string | `draft` (default), `published`, `cancelled`, `finished` |
| `organizer` | ObjectId (ref `User`) | Se asigna automáticamente desde el usuario autenticado; nunca puede venir del body |

### Filtros, paginación y ordenamiento (`GET /api/events`)

| Parámetro | Ejemplo | Descripción |
|---|---|---|
| `status` | `?status=published` | Filtra por estado |
| `category` | `?category=workshop` | Filtra por categoría |
| `location` | `?location=Córdoba` | Filtra por ubicación |
| `dateFrom` / `dateTo` | `?dateFrom=2026-01-01&dateTo=2026-12-31` | Filtra por rango de fechas |
| `page` | `?page=2` | Página a mostrar (default 1) |
| `limit` | `?limit=5` | Resultados por página (default 10) |
| `sort` | `?sort=date` o `?sort=-date` | Orden ascendente/descendente por el campo indicado |

Ejemplo: `GET /api/events?status=published&page=2&limit=5`

```json
{
  "status": "success",
  "data": [ { "id": "...", "title": "Congreso Tech 2026", "status": "published" } ],
  "page": 2,
  "limit": 5,
  "total": 27,
  "totalPages": 6
}
```

### Reglas de negocio (en `events.service.js`)

- **Al crear**: fecha no puede ser pasada; `capacity` mayor a 0; `price` no negativo; `organizer` se asigna automáticamente desde `req.user`.
- **Al modificar (`PUT`)**: solo el dueño o un `admin`. Un evento `cancelled` no puede modificarse. El campo `organizer` nunca se puede reasignar desde un update.
- **Al cambiar estado (`PATCH .../status`)**: mismas reglas de propiedad. No se puede publicar un evento `finished` o `cancelled`.

## Tickets / Inscripciones

Modelo `Ticket` (solo referencias, sin objetos embebidos):

| Campo | Tipo | Descripción |
|---|---|---|
| `user` | ObjectId (ref `User`) | Usuario que se inscribió |
| `event` | ObjectId (ref `Event`) | Evento al que se inscribió |
| `status` | string | `confirmed` (default), `pending`, `cancelled` |
| `quantity` | number | Cantidad de entradas, mayor a 0 |
| `reservationCode` | string | Código único generado al confirmar la inscripción |
| `cancelledAt` | Date | Se completa al cancelar; `null` mientras está activo |

### Reglas de negocio (en `tickets.service.js`)

Al inscribirse (`POST /api/events/:eid/tickets`):
- El evento debe existir (**404** si no).
- Debe estar `published`, y no `cancelled`/`finished` (ni por estado ni por fecha ya pasada).
- `quantity` debe ser un entero mayor a 0.
- El usuario no puede tener ya un ticket **activo** para ese evento (**409**, duplicado).
- Los cupos disponibles se calculan como `capacity - (suma de quantity de tickets activos)`, mediante una agregación nativa de MongoDB (`$match` + `$group` + `$sum`); los tickets `cancelled` no ocupan cupo. Si no alcanza, se rechaza con **409** y un mensaje indicando los cupos disponibles.

Al cancelar (`PATCH /api/tickets/:tid/cancel`):
- Solo el dueño o un `admin` (**403** en caso contrario).
- No se puede cancelar un ticket ya `cancelled`.
- Cancelar **no elimina** el documento: cambia `status` a `cancelled` y completa `cancelledAt`. El cupo queda liberado automáticamente.

### Notificaciones por email

Al confirmarse una inscripción se envía un email con [Nodemailer](https://nodemailer.com/), con el código de reserva y la cantidad de entradas. Credenciales por variable de entorno (nunca hardcodeadas). Si el envío falla, se loguea el error pero **no** impide que la inscripción se confirme.

### Ejemplo: inscripción exitosa

Request (`POST /api/events/:eid/tickets`):
```json
{ "quantity": 1 }
```

**201 Created**:
```json
{
  "status": "success",
  "payload": {
    "id": "...",
    "event": "6690...",
    "user": "665f...",
    "quantity": 1,
    "status": "confirmed",
    "reservationCode": "TCK-7QK2"
  }
}
```

### Ejemplo: inscripción duplicada o sin cupo

**409 Conflict**:
```json
{ "status": "error", "message": "Ya tenés una inscripción activa a este evento" }
```
o
```json
{ "status": "error", "message": "No hay cupos suficientes. Cupos disponibles: 3" }
```

## Flujo de autenticación e inscripción (end-to-end)

1. **Registro**: `POST /api/sessions/register` con `first_name`, `last_name`, `email`, `password` → usuario creado con rol `user`.
2. **Login**: `POST /api/sessions/login` con `email`/`password` → se setea la cookie `currentUser` (JWT httpOnly).
3. **Verificar sesión**: `GET /api/sessions/current` (usa la cookie) → devuelve `{ id, email, role }`.
4. **(Rol organizer/admin) Crear evento**: `POST /api/events` → queda en estado `draft`.
5. **Publicar evento**: `PATCH /api/events/:id/status` con `{ "status": "published" }`.
6. **Inscribirse**: `POST /api/events/:eid/tickets` con `{ "quantity": N }` (usuario autenticado, evento publicado y con cupo) → se crea el ticket y se envía el email de confirmación.
7. **Ver mis tickets**: `GET /api/tickets/my-tickets` → tickets propios, con datos básicos del evento vía `populate`.
8. **Cancelar inscripción**: `PATCH /api/tickets/:tid/cancel` → libera el cupo automáticamente.
9. **Logout**: `POST /api/sessions/logout` → elimina la cookie; `GET /api/sessions/current` vuelve a dar `401`.

### Cómo probar todo el flujo

1. Levantar el servidor con `npm run dev`.
2. Registrar un usuario y, si hace falta, cambiarle el rol manualmente en MongoDB.
3. Hacer login con Postman/Thunder Client (la cookie se guarda automáticamente).
4. Recorrer los pasos del flujo de arriba.
5. Verificar en MongoDB que la contraseña se guarda hasheada (formato `$2b$10$...`), nunca en texto plano.
6. Verificar que ninguna respuesta (usuario, evento, ticket, incluso con `populate`) incluye el campo `password`.
7. Verificar los códigos de error: `401` sin sesión, `403` con sesión pero sin permisos, `404` recurso inexistente, `409` conflicto (duplicado o sin cupo), `400` datos inválidos.