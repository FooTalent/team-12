const Joi = require('joi');

const clinicInfoSchema = Joi.object({
  name: Joi.string().min(1).max(255).required(),
  phone_number: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).required(), // Ejemplo para números de teléfono internacionales
  address: Joi.string().min(1).max(255).required(),
  email: Joi.string().email().required(),
  opening_hours: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).required(), // Formato HH:mm
  closing_hours: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).required(), // Formato HH:mm
});

module.exports = clinicInfoSchema;
