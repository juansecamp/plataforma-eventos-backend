import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
})

export const enviarEmailConfirmacion = async ({ to, eventTitle, reservationCode, quantity }) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to,
      subject: `Confirmación de inscripción: ${eventTitle}`,
      html: `
        <h2>¡Inscripción confirmada!</h2>
        <p>Te inscribiste correctamente al evento <strong>${eventTitle}</strong>.</p>
        <p><strong>Código de reserva:</strong> ${reservationCode}</p>
        <p><strong>Cantidad de entradas:</strong> ${quantity}</p>
      `
    })

    console.log('Email de confirmación enviado:', info.messageId)
    return info
  } catch (error) {
    console.error('Error al enviar email de confirmación:', error.message)
    // No relanzamos el error: el fallo de email no debe impedir que la inscripción se confirme
  }
}