export const toUserDTO = (usuario) => {
  return {
    id: usuario._id ?? usuario.id,
    first_name: usuario.first_name,
    last_name: usuario.last_name,
    email: usuario.email,
    role: usuario.role
  }
}