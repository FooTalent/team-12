const cron = require('node-cron');
const { sendMessage } = require('../controllers/whatsapp.controller'); 
const db = require('../config/db'); 

// Función para enviar recordatorios
async function sendReminders() {
  try {
    const now = new Date();
    const reminderTimes = [24, 48, 72]; // Horas de anticipación

    for (const hours of reminderTimes) {
      const reminderTime = new Date(now.getTime() + hours * 60 * 60 * 1000);
      const reminderDateString = reminderTime.toISOString().slice(0, 19).replace('T', ' ');        
      // Consulta para obtener turnos que coincidan con la hora de recordatorio
      const [appointments] = await db.query(`
        SELECT a.id AS turno_id, a.patient_id, a.date, a.time, rc.id AS reminder_config_id, p.phone_number, p.first_name AS patient_name
        FROM appointments a
        JOIN reminder_configurations rc ON a.patient_id = rc.patient_id
        JOIN patients p ON a.patient_id = p.id
        WHERE rc.is_active = 1
          AND rc.anticipation_time = ?
          AND a.date = ?
      `, [hours, reminderDateString]);
      for (const appointment of appointments) {
        // Prepara los datos para enviar el mensaje
        const messageData = {
          body: {
            phoneNumber: appointment.phone_number,
            clinicName: 'Clinica San Roberto',
            appointmentDate: appointment.date,
            appointmentTime: appointment.time,
            appointmentId: appointment.turno_id,
          }
        };
        console.log(messageData);
        // Llama a la función sendMessage
        await sendMessage(messageData, {
          status: (code) => ({
            json: (data) => console.log(`Status: ${code}, Data: ${JSON.stringify(data)}`),
          }),
        });

        console.log(`Reminder sent for turno_id: ${appointment.turno_id}`);
      }
    }
  } catch (error) {
    console.error('Error sending reminders:', error);
  }
}

// Configura la tarea cron para ejecutarse cada 15 minutos
cron.schedule('*/15 * * * *', () => {
  console.log('Running reminder job...');
  sendReminders();
});
