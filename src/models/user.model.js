import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true // Evita que se registren correos duplicados
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['USER', 'ORGANIZER', 'ADMIN'], // Restringe estrictamente a estos tres roles
    default: 'USER' // Si no se especifica un rol, será USER por defecto
  }
}, {
  timestamps: true
});

const Usuario = model('User', userSchema);

export default Usuario;
