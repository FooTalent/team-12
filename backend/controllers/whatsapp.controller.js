const axios = require('axios');

const token = process.env.WHATSAPP_API_TOKEN; // Reemplaza con tu token de acceso
const phoneNumberId = process.env.WHATSAPP_BUSINESS_PHONE_NUMBER; 
const verifyToken = process.env.VERIFY_TOKEN; 

const sendMessage = async (req, res) => {
    const { to, appointmentDate, appointmentTime, dentist } = req.body;
    console.log(req.body);
    try {
        const response = await axios.post(
            `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`,
            {
                messaging_product: 'whatsapp',
                to: to,
                type: 'template',
                template: {
                    name: 'recordatorio_de_turno',
                    language: {
                        code: 'es_AR'
                    },
                    components: [
                        {
                            type: 'body',
                            parameters: [
                                {
                                    type: 'text',
                                    text: appointmentDate || '' // Asegúrate de que este valor no sea undefined
                                },
                                {
                                    type: 'text',
                                    text: appointmentTime || '' // Asegúrate de que este valor no sea undefined
                                },                                
                                {
                                    type: 'text',
                                    text: dentist || '' // Asegúrate de que este valor no sea undefined
                                }
                            ]
                        }
                    ]
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error sending message:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to send message' });
    }
};

// Ruta para la verificación del webhook
const verifyWebhook = (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token) {
        if (mode === 'subscribe' && token === verifyToken) {
            console.log('Webhook verified');
            res.status(200).send(challenge);
        } else {
            res.sendStatus(403);
        }
    } else {
        res.sendStatus(403);
    }
};

// Ruta para recibir mensajes
const receiveMessage = async (req, res) => {
    const body = req.body;

    if (body.object === 'whatsapp_business_account') {
        try {
            body.entry.forEach(async (entry) => {
                const changes = entry.changes;
                changes.forEach(async (change) => {
                    const value = change.value;
                    const messages = value.messages;
                    if (messages) {
                        messages.forEach(async (message) => {
                            if (message.type === 'text') {
                                const from = message.from; // Número de teléfono que envió el mensaje
                                const msgBody = message.text.body; // Texto del mensaje

                                console.log(`Received message from ${from}: ${msgBody}`);
                                console.log(message);
                                // Aquí puedes manejar el mensaje recibido y responder si es necesario

                                 /* const response = await axios.post(
                                    `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`,
                                    {
                                        messaging_product: "whatsapp",
                                        to: message.from,
                                        text: { body: "Echo: " + message.text.body },
                                        context: {
                                          message_id: message.id, // shows the message as a reply to the original user message
                                        },
                                      },
                                    {
                                        headers: {
                                            Authorization: `Bearer ${token}`,
                                            'Content-Type': 'application/json',
                                        },
                                    }
                                );  */
                                /* const response = await axios({
                                    method: "POST",
                                    url: `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`,
                                    headers: {
                                        Authorization: `Bearer ${verifyToken}`,
                                    },
                                    data: {
                                        messaging_product: "whatsapp",
                                        to: message.from,
                                        text: { body: "Echo: " + message.text.body },
                                        context: {
                                            message_id: message.id, // muestra el mensaje como respuesta al mensaje original del usuario
                                        },
                                    },
                                }); */
                            }
                        });
                    }
                });
            });

            res.sendStatus(200);
        } catch (error) {
            console.error('Error processing messages:', error);
            res.sendStatus(500);
        }
    } else {
        res.sendStatus(404);
    }
};


module.exports = {
    sendMessage,
    verifyWebhook,
    receiveMessage
};
