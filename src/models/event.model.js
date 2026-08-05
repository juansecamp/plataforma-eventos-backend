import { Schema, model } from 'mongoose';

const eventSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
}, {
  timestamps: true // Esto añade automáticamentecreatedAt y updatedAt
});

// El primer argumento debe ser el nombre de la colección en singular
const Evento = model('Event', eventSchema);

export default Evento;
