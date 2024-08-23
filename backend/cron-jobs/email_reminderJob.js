const cron = require("node-cron");
const { sendEmailReminder } = require("../controllers/email.controller");
const moment = require("moment");
const pool = require("../config/db");

async function sendReminders() {
    try {
        const now = new Date();
        const reminderTimes = [12, 24, 48, 72]; // Horas de anticipación

        for (const hours of reminderTimes) {
            const reminderTime = new Date(now.getTime() + hours * 60 * 60 * 1000);
            const reminderDateString = moment(reminderTime).format("YYYY-MM-DD");

            // Consulta las citas para el recordatorio actual
            const query = `
                SELECT a.id, a.patient_id, a.date, a.time, p.email, p.first_name AS patient_name, u.first_name AS dentist_name 
                FROM appointments a
                JOIN patients p ON a.patient_id = p.id
                JOIN users u ON a.dentist_id = u.id 
                WHERE a.date = ?
            `;
            const [appointments] = await pool.query(query, [reminderDateString]);

            for (const appointment of appointments) {
                // Verifica si ya se ha enviado un recordatorio para esta cita
                const [reminderRecord] = await pool.query(`
                    SELECT id FROM reminders WHERE appointment_id = ?
                `, [appointment.id]);

                if (reminderRecord.length === 0) {
                    // Envía el recordatorio por correo electrónico
                    await sendEmailReminder(appointment);

                    // Registra el recordatorio enviado
                    await pool.query(`
                        INSERT INTO reminders (appointment_id) VALUES (?)
                    `, [appointment.id]);
                }
            }
        }
    } catch (error) {
        console.error("Error sending reminders:", error);
    }
}


const recordMessageSent = async (appointmentId) => {
    const query = "INSERT INTO reminders (appointment_id) VALUES (?)";
    await pool.execute(query, [appointmentId]);
  };

cron.schedule("*/30 * * * * *", () => {
    console.log("Running reminder job...");
    sendReminders();
});
