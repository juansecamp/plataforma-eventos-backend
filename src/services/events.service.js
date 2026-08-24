import eventRepository from '../repositories/event.repository.js'

export const obtenerTodosLosEventos = async () => {
  return await eventRepository.getAllEvents()
}

export const guardarNuevoEvento = async (eventData, organizerId) => {
  return await eventRepository.createEvent({
    ...eventData,
    organizer: organizerId
  })
}

export const actualizarEvento = async (eventId, updateData, usuario) => {
  const evento = await eventRepository.getEventById(eventId)

  if (!evento) {
    const error = new Error('Evento no encontrado')
    error.status = 404
    throw error
  }

  const esDueño = evento.organizer.toString() === usuario.id
  const esAdmin = usuario.role === 'admin'

  if (!esDueño && !esAdmin) {
    const error = new Error('No podés modificar un evento que no te pertenece')
    error.status = 403
    throw error
  }

  return await eventRepository.updateEvent(eventId, updateData)
}