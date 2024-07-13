const { transporter } = require("../config/email");

async function sendReminderEmails(appointments) {
  appointments.forEach((appointment) => {
    if (appointment.email) {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: appointment.email,
        subject: "Recordatorio de Cita",
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
              <h2 style="text-align: center; color: #333;">Recordatorio de Cita</h2>
              <p>Estimado/a ${appointment.first_name} ${appointment.last_name},</p>
              <p>Este es un recordatorio de su cita programada para mañana a las <strong>${appointment.time}</strong>.</p>
              <p>¡Esperamos verlo/a pronto!</p>
            </div>
          `,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.log(
            "Error al enviar el correo de recordatorio:",
            error
          );
        }
        console.log("Correo de recordatorio enviado: " + info.response);
      });
    }
  });
}

const sendAppointmentReminder = async (req, res) => {
  try {
    const appointmentId = req.body.appointmentId;
    const appointment = await getAppointmentById(appointmentId);

    if (!appointment) {
      res.status(404).send({ message: 'Appointment not found' });
      return;
    }

    const reminderEmail = prepareReminderEmail(appointment);

    await sendEmail(reminderEmail);

    res.status(200).send({ message: 'Appointment reminder sent successfully' });
  } catch (error) {
    console.error('Error sending appointment reminder:', error);
    res.status(500).send({ message: 'Error sending appointment reminder' });
  }
};

const sendEmail = async (req, res) => {
  const { to, subject, text } = req.body;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: to,
    subject: subject,
    text: text,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error.toString());
    res.status(500).json({ error: 'Failed to send email' });
  }
};

module.exports = {
  sendReminderEmails,
  sendAppointmentReminder,
  sendEmail
};
