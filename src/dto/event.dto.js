import { toUserDTO } from './user.dto.js'

export const toEventDTO = (evento) => {
  const organizerEsObjeto = evento.organizer && typeof evento.organizer === 'object' && evento.organizer.email

  return {
    id: evento._id,
    title: evento.title,
    description: evento.description,
    category: evento.category,
    date: evento.date,
    location: evento.location,
    capacity: evento.capacity,
    price: evento.price,
    status: evento.status,
    organizer: organizerEsObjeto ? toUserDTO(evento.organizer) : evento.organizer,
    createdAt: evento.createdAt,
    updatedAt: evento.updatedAt
  }
}

export const toEventListDTO = (eventos) => eventos.map(toEventDTO)