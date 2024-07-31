const express = require('express');
const router = express.Router();
const whatsappController = require('../controllers/whatsapp.controller');

/**
 * @swagger
 * /whatsapp/send-message-whatsapp:
 *   post:
 *     summary: Enviar un mensaje de WhatsApp
 *     tags: [WhatsApp]
 *     description: Envía un mensaje de recordatorio de cita a un número de WhatsApp específico.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phoneNumber:
 *                 type: string
 *                 description: Número de teléfono del destinatario.
 *               clinicName:
 *                 type: string
 *                 description: Nombre de la clínica.
 *               appointmentDate:
 *                 type: string
 *                 format: date
 *                 description: Fecha de la cita.
 *               appointmentTime:
 *                 type: string
 *                 description: Hora de la cita.
 *               dentistName:
 *                 type: string
 *                 description: Nombre del dentista.
 *               appointmentId:
 *                 type: integer
 *                 description: ID de la cita.
 *     responses:
 *       200:
 *         description: Mensaje enviado con éxito.
 *       500:
 *         description: Error al enviar el mensaje.
 */
router.post('/send-message-whatsapp', whatsappController.sendMessage);
router.get('/webhook', whatsappController.verifyWebhook);
router.post('/webhook', whatsappController.receiveMessage);

module.exports = router;
