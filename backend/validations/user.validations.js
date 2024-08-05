const Joi = require('joi');

// Definir el esquema de validación para el usuario
const userSchema = Joi.object({
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    birth_date: Joi.date().iso().required(),
    dni: Joi.string().required(),
    email: Joi.string().email().required(),
    phone_number: Joi.string().required(),
    password: Joi.string().min(8).required(),
    role_id: Joi.number().integer().required(),
    active: Joi.required(),
    clinic_id: Joi.number().integer().required(),
    image: Joi.string().allow(null, '').optional(),
  });
  
  // Definir el esquema de validación para el usuario
const userPatchSchema = Joi.object({
  first_name: Joi.string(),
  last_name: Joi.string(),
  birth_date: Joi.date().iso(),
  dni: Joi.string(),
  email: Joi.string().email(),
  phone_number: Joi.string(),
  password: Joi.string().min(8),
  role_id: Joi.number().integer(),
  active: Joi.optional(),
  clinic_id: Joi.number().integer(),
  image: Joi.string().allow(null, '').optional(),
});

module.exports = {
    userSchema,
    userPatchSchema
};
