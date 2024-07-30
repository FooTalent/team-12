const Joi = require('joi');

const patientSchema = Joi.object({
  first_name: Joi.string().min(1).max(255).required(),
  last_name: Joi.string().min(1).max(255).required(),
  birth_date: Joi.date().iso().required(), // Formato ISO para fechas
  dni: Joi.string().alphanum().min(1).max(20).required(),
  phone_number: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).required(), // Ejemplo para números de teléfono internacionales
  alternative_phone_number: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).optional(),
  email: Joi.string().email().required(),
});

module.exports = patientSchema;
