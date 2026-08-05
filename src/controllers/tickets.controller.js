import { obtenerTodosLosTickets, guardarNuevoTicket } from '../services/tickets.service.js'

export const getTickets = async (req, res) => {
try {
    const tickets = await obtenerTodosLosTickets()
    res.status(200).json(tickets)
} catch (error) {
    res.status(500).json({ error: 'Error al obtener los tickets', detalle: error.message })
}
}

export const createTicket = async (req, res) => {
try {
    const ticketGuardado = await guardarNuevoTicket(req.body)
    res.status(201).json(ticketGuardado)
} catch (error) {
    res.status(500).json({ error: 'Error al crear el ticket', detalle: error.message })
}
}
