const cron = require("node-cron");
const { sendMessage } = require("../controllers/whatsapp.controller");
const db = require("../config/db");
const moment = require("moment");

// Función para enviar recordatorios
async function sendReminders() {
  try {
    const now = new Date();
    const reminderTimes = [12, 24, 48, 72]; // Horas de anticipación
    console.log("------------------------------------------");
    for (const hours of reminderTimes) {
      // Calcula la fecha y hora del recordatorio en función de la anticipación
      const reminderTime = new Date(now.getTime() + hours * 60 * 60 * 1000);
      const reminderDateString = moment(reminderTime).format("YYYY-MM-DD"); // Fecha en formato YYYY-MM-DD
      const reminderTimeString = moment(reminderTime).format("HH"); // Hora en formato HH:MM

      /* console.log(`Reminder Time: ${reminderTime}`);
      console.log(`Reminder Date String: ${reminderDateString}`);
      console.log(`Reminder Time String: ${reminderTimeString}`);
      console.log(`Anticipation Time: ${hours}`); */

      // Consulta para obtener turnos que coincidan con la hora de recordatorio
      const query = `
        SELECT a.id AS turno_id, a.patient_id, a.date, a.time, rc.id AS reminder_config_id, p.phone_number, p.first_name AS patient_name, u.first_name  AS dentist_name 
        FROM appointments a
        JOIN reminder_configurations rc ON a.id = rc.appointment_id
        JOIN patients p ON a.patient_id = p.id
        JOIN users u ON a.dentist_id = u.id 
        WHERE rc.is_active = 1
          AND rc.anticipation_time = ?
          AND a.date = ?
      `;
      const params = [hours, reminderDateString, `${reminderTimeString}%`];
      /* console.log(`Query: ${query}`);
      console.log(`Params: ${params}`); */

      const [appointments] = await db.query(query, params);

      console.log(
        `Found ${appointments.length} appointments for ${hours} hours before`
      );

      for (const appointment of appointments) {

        const [rows] = await db.query(
          "SELECT * FROM reminders WHERE appointment_id = ?",
          [appointment.turno_id]
        );

        if (rows.length > 0) {
          console.log("Hay un recordatorio asociado:");
        } else {
          console.log("No hay recordatorios asociados a este turno.");
          // Formatear la fecha en formato DD-MM-YYYY
        const formattedDate = moment(appointment.date).format("DD-MM-YYYY");
        const formattedTime = moment(appointment.time, "HH:mm:ss").format(
          "HH:mm"
        );

        // Prepara los datos para enviar el mensaje
        const messageData = {
          body: {
            patient_name: appointment.patient_name,
            phoneNumber: appointment.phone_number,
            clinicName: "Clinica San Roberto",
            appointmentDate: formattedDate,
            appointmentTime: formattedTime,
            dentistName: appointment.dentist_name,
            appointmentId: appointment.turno_id,
          },
        };

        // Llama a la función sendMessage
        try {
          await sendMessage(messageData, {
            status: (code) => ({
              json: (data) =>
                console.log(`Status: ${code}, Data: ${JSON.stringify(data)}`),
            }),
          });
          console.log(`Reminder sent for turno_id: ${appointment.turno_id}`);
        } catch (error) {
          console.error(
            `Error sending reminder for turno_id: ${appointment.turno_id}`,
            error
          );
        }
        }        
      }
    }
  } catch (error) {
    console.error("Error sending reminders:", error);
  }
}

// Configura la tarea cron para ejecutarse cada 15 minutos
cron.schedule("*/30 * * * * *", () => {
  console.log("Running reminder job...");
  sendReminders();
});
