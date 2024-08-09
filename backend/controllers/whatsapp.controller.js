const axios = require("axios");
const pool = require("../config/db");

const token = process.env.WHATSAPP_API_TOKEN; // Reemplaza con tu token de acceso
const phoneNumberId = process.env.WHATSAPP_BUSINESS_PHONE_NUMBER;
const verifyToken = process.env.VERIFY_TOKEN;
const apiUrl = `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`;

//  Enviar mensaje Whatsapp
const sendMessage = async (req, res) => {
  console.log("ENTRO");
  const {
    patient_name,
    phoneNumber,
    clinicName,
    appointmentDate,
    appointmentTime,
    dentistName,
    appointmentId,
  } = req.body;

  console.log(req.body);
  const data = {
    messaging_product: "whatsapp",
    to: phoneNumber,
    type: "template",
    template: {
      name: "recordatorio_turno",
      language: {
        code: "es_AR",
      },
      components: [
        {
          type: "body",
          parameters: [
            { type: "text", text: patient_name }, // {{1}}
            { type: "text", text: clinicName }, // {{2}}
            { type: "text", text: appointmentDate }, // {{3}}
            { type: "text", text: appointmentTime }, // {{4}}
            { type: "text", text: dentistName }, // {{5}}
          ],
        },
      ],
    },
  };

  try {
    const response = await axios.post(apiUrl, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    console.log("Mensaje enviado con éxito:", response.data);

    // Registrar el envío del mensaje en la base de datos
    await recordMessageSent(appointmentId);

    res.status(200).json(response.data);
  } catch (error) {
    console.error(
      "Error sending message:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ error: "Failed to send message" });
  }
};

// Función para registrar el mensaje enviado en la base de datos
const recordMessageSent = async (appointmentId) => {
  const query = `
          INSERT INTO reminders (appointment_id)
          VALUES (?)
        `;
  await pool.execute(query, [appointmentId]);
};

// Manejar la respuesta de los recordatorios
const receiveMessage = async (req, res) => {
  const body = req.body;
  console.log(body);

  if (body.object === "whatsapp_business_account") {
    try {
      for (const entry of body.entry) {
        for (const change of entry.changes) {
          const value = change.value;
          const messages = value.messages;

          if (messages) {
            for (const message of messages) {
              if (message.type === "text") {
                const from = message.from; // Número de teléfono que envió el mensaje
                const msgBody = message.text.body; // Texto del mensaje

                console.log(`Received message from ${from}: ${msgBody}`);
                console.log(message);

                // Determinar la respuesta del paciente
                let response;
                switch (msgBody) {
                  case "1": // Confirmar
                    response = "confirmed";
                    break;
                  case "2": // Cancelar
                    response = "cancelled";
                    break;
                  case "3": // Reprogramar
                    response = "rescheduled";
                    break;
                  default:
                    console.log(`Unrecognized response: ${msgBody}`);
                    continue; // Si la respuesta no es válida, continuar con el siguiente mensaje
                }

                // Buscar el paciente por el número de teléfono
                const patient = await getPatientByPhoneNumber(from);
                if (!patient) {
                  console.log(`No patient found with phone number ${from}`);
                  continue;
                }

                // Obtener el último recordatorio del paciente
                const reminder = await getLastReminderForPatient(patient.id);
                if (!reminder) {
                  console.log(`No reminder found for patient ${patient.id}`);
                  continue;
                }

                // Actualizar el recordatorio con la respuesta
                await updateReminderResponse(reminder.id, response);

                // Actualizar el estado del turno
                await updateAppointmentStatus(
                  reminder.appointment_id,
                  response
                );

                // Aquí puedes responder al usuario si es necesario
                // const response = await axios.post(
                //   `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`,
                //   {
                //     messaging_product: "whatsapp",
                //     to: message.from,
                //     text: { body: `Tu respuesta '${msgBody}' ha sido recibida.` },
                //     context: {
                //       message_id: message.id,
                //     },
                //   },
                //   {
                //     headers: {
                //       Authorization: `Bearer ${token}`,
                //       'Content-Type': 'application/json',
                //     },
                //   }
                // );
              }
            }
          }
        }
      }

      res.sendStatus(200);
    } catch (error) {
      console.error("Error processing messages:", error);
      res.sendStatus(500);
    }
  } else {
    res.sendStatus(404);
  }
};

// Función para actualizar el estado del turno en la base de datos
const updateAppointmentStatus = async (appointmentId, response) => {
  let state;
  switch (response) {
    case "confirmed":
      state = "confirmed";
      break;
    case "cancelled":
      state = "cancelled";
      break;
    case "rescheduled":
      state = "rescheduled";
      break;
    default:
      console.log(`Unrecognized response: ${response}`);
      return;
  }
  const query = `
    UPDATE appointments
    SET state = ?
    WHERE id = ?
  `;
  await pool.execute(query, [state, appointmentId]);
};

// Función para buscar el paciente por número de teléfono
const getPatientByPhoneNumber = async (phoneNumber) => {
  const query = `
      SELECT id
      FROM patients
      WHERE phone_number = ?
    `;
  const [rows] = await pool.execute(query, [phoneNumber]);
  return rows[0]; // Devuelve el primer resultado
};

// Función para obtener el último recordatorio del paciente
const getLastReminderForPatient = async (patientId) => {
  const query = `
      SELECT id
      FROM reminders
      WHERE appointment_id IN (
        SELECT id
        FROM appointments
        WHERE patient_id = ?
      )
      ORDER BY sent_at DESC
      LIMIT 1
    `;
  const [rows] = await pool.execute(query, [patientId]);
  return rows[0]; // Devuelve el primer resultado
};

// Función para actualizar la respuesta del recordatorio en la base de datos
const updateReminderResponse = async (reminderId, response) => {
  const query = `
      UPDATE reminders
      SET response = ?, response_received_at = NOW()
      WHERE id = ?
    `;
  await pool.execute(query, [response, reminderId]);
};

// Ruta para la verificación del webhook
const verifyWebhook = (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token) {
    if (mode === "subscribe" && token === verifyToken) {
      console.log("Webhook verified");
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  } else {
    res.sendStatus(403);
  }
};

module.exports = {
  sendMessage,
  verifyWebhook,
  receiveMessage,
};
