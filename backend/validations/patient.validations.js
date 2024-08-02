const Joi = require('joi');

const patientSchema = Joi.object({
  first_name: Joi.string().min(1).max(255).required(),
  last_name: Joi.string().min(1).max(255).required(),
  birth_date: Joi.date().iso().required(), 
  dni: Joi.string().alphanum().min(1).max(20).required(),
  phone_number: Joi.string().required(),
  alternative_phone_number: Joi.string().optional(), 
  email: Joi.string().email().required(),
});

module.exports = patientSchema;
