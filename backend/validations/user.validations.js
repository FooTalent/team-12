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
    active: Joi.boolean().required(),
    clinic_id: Joi.number().integer().required()
  });
  
module.exports = {
    userSchema
};
