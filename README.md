# Plataforma de Eventos e Inscripciones

Backend desarrollado con Node.js, Express y MongoDB para una plataforma de gestión de eventos e inscripciones. Proyecto correspondiente a la materia Backend II - Diseño y Arquitectura Backend, implementando una arquitectura modular por capas (rutas, controladores, servicios, modelos, middlewares) con autenticación JWT y control de acceso por roles.

## Temática

Plataforma de eventos: permite el registro de usuarios (con roles `USER`, `ORGANIZER`, `ADMIN`), la publicación de eventos, y la gestión de inscripciones/tickets, con permisos diferenciados según el rol de cada usuario.

## Tecnologías Utilizadas

- **Node.js** - Entorno de ejecución JavaScript
- **Express** - Framework web para Node.js
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **jsonwebtoken** - Generación y verificación de tokens JWT
- **bcrypt** - Hasheo de contraseñas
- **dotenv** - Gestión de variables de entorno
- **nodemon** - Reinicio automático del servidor en desarrollo

## Instalación

1. Clonar el repositorio:
```bash
git clone <url-del-repositorio>
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
│ ├── repositories/ # Capa de acceso a datos (preparada para próximas entregas)
│ ├── dao/ # Data Access Objects (preparada para próximas entregas)
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

- `GET /api/users` - Listar usuarios (rol requerido: `ADMIN`)
- `POST /api/users` - Registrar un nuevo usuario (roles: `USER`, `ORGANIZER`, `ADMIN`)

### Sesiones (Autenticación)

- `POST /api/sessions/register` - Registrar un nuevo usuario
- `POST /api/sessions/login` - Iniciar sesión y obtener un token JWT

### Eventos

- `GET /api/events` - Listar eventos (roles: `USER`, `ORGANIZER`, `ADMIN`)
- `POST /api/events` - Crear un nuevo evento (roles: `ORGANIZER`, `ADMIN`)

### Tickets

- `GET /api/tickets` - Listar tickets (rol requerido: `ADMIN`)
- `POST /api/tickets` - Crear/comprar un ticket (roles: `USER`, `ORGANIZER`, `ADMIN`)

## Autenticación

Las rutas protegidas requieren un token JWT enviado en el header:

Authorization: Bearer <token>


El token se obtiene haciendo login en `POST /api/sessions/login`, y contiene el rol del usuario, que es validado por el middleware `handlePolicies` según los permisos de cada ruta.