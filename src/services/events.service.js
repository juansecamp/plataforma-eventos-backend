import eventRepository from '../repositories/event.repository.js'

export const obtenerTodosLosEventos = async () => {
  return await eventRepository.getAllEvents()
}

export const guardarNuevoEvento = async (eventData) => {
  return await eventRepository.createEvent(eventData)
}