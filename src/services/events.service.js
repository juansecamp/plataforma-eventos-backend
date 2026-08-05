import Evento from '../models/event.model.js'

export const obtenerTodosLosEventos = async () => {
return await Evento.find()
}

export const guardarNuevoEvento = async (eventData) => {
const nuevoEvento = new Evento(eventData)
return await nuevoEvento.save()
}
