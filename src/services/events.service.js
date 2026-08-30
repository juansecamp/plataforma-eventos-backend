import eventRepository from '../repositories/event.repository.js'

const ESTADOS_VALIDOS = ['draft', 'published', 'cancelled', 'finished']

const construirFiltro = (query) => {
  const filtro = {}

  if (query.status) {
    filtro.status = query.status
  }

  if (query.category) {
    filtro.category = query.category
  }

  if (query.location) {
    filtro.location = query.location
  }

  if (query.dateFrom || query.dateTo) {
    filtro.date = {}
    if (query.dateFrom) filtro.date.$gte = new Date(query.dateFrom)
    if (query.dateTo) filtro.date.$lte = new Date(query.dateTo)
  }

  return filtro
}

export const listarEventos = async (query) => {
  const filtro = construirFiltro(query)

  const page = parseInt(query.page) || 1
  const limit = parseInt(query.limit) || 10
  const skip = (page - 1) * limit

  let sort = { createdAt: -1 }
  if (query.sort) {
    const campo = query.sort.replace('-', '')
    const direccion = query.sort.startsWith('-') ? -1 : 1
    sort = { [campo]: direccion }
  }

  const [eventos, total] = await Promise.all([
    eventRepository.getEvents(filtro, { skip, limit, sort }),
    eventRepository.countEvents(filtro)
  ])

  return {
    data: eventos,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit)
  }
}

export const obtenerEventoPorId = async (id) => {
  const evento = await eventRepository.getEventById(id)

  if (!evento) {
    const error = new Error('Evento no encontrado')
    error.status = 404
    throw error
  }

  return evento
}

export const crearEvento = async (eventData, organizerId) => {
  const { title, description, category, date, location, capacity, price } = eventData

  if (!title || !description || !category || !location) {
    const error = new Error('Faltan campos obligatorios')
    error.status = 400
    throw error
  }

  if (!date || new Date(date) < new Date()) {
    const error = new Error('La fecha del evento no puede estar en el pasado')
    error.status = 400
    throw error
  }

  if (!capacity || capacity <= 0) {
    const error = new Error('La capacidad debe ser mayor a 0')
    error.status = 400
    throw error
  }

  if (price !== undefined && price < 0) {
    const error = new Error('El precio no puede ser negativo')
    error.status = 400
    throw error
  }

  return await eventRepository.createEvent({
    title,
    description,
    category,
    date,
    location,
    capacity,
    price: price || 0,
    organizer: organizerId
  })
}

const verificarPropiedad = (evento, usuario) => {
  const esDueño = evento.organizer.toString() === usuario.id
  const esAdmin = usuario.role === 'admin'

  if (!esDueño && !esAdmin) {
    const error = new Error('No podés modificar un evento que no te pertenece')
    error.status = 403
    throw error
  }
}

export const actualizarEvento = async (eventId, updateData, usuario) => {
  const evento = await obtenerEventoPorId(eventId)

  verificarPropiedad(evento, usuario)

  if (evento.status === 'cancelled') {
    const error = new Error('No se puede modificar un evento cancelado')
    error.status = 400
    throw error
  }

  if (updateData.capacity !== undefined && updateData.capacity <= 0) {
    const error = new Error('La capacidad debe ser mayor a 0')
    error.status = 400
    throw error
  }

  if (updateData.price !== undefined && updateData.price < 0) {
    const error = new Error('El precio no puede ser negativo')
    error.status = 400
    throw error
  }

  if (updateData.date && new Date(updateData.date) < new Date()) {
    const error = new Error('La fecha del evento no puede estar en el pasado')
    error.status = 400
    throw error
  }

  delete updateData.organizer

  return await eventRepository.updateEvent(eventId, updateData)
}

export const cambiarEstadoEvento = async (eventId, nuevoEstado, usuario) => {
  if (!ESTADOS_VALIDOS.includes(nuevoEstado)) {
    const error = new Error('Estado inválido')
    error.status = 400
    throw error
  }

  const evento = await obtenerEventoPorId(eventId)

  verificarPropiedad(evento, usuario)

  if (evento.status === 'cancelled') {
    const error = new Error('No se puede modificar un evento cancelado')
    error.status = 400
    throw error
  }

  if (nuevoEstado === 'published' && (evento.status === 'finished' || evento.status === 'cancelled')) {
    const error = new Error('No se puede publicar un evento finalizado o cancelado')
    error.status = 400
    throw error
  }

  return await eventRepository.updateEvent(eventId, { status: nuevoEstado })
}