const Joi = require('joi');

const contactSchema = Joi.object({
  first_name: Joi.string().min(1).max(255).required(),
  last_name: Joi.string().min(1).max(255).required(),
  email: Joi.string().email().required(),
  phone_number: Joi.string().min(7).max(15).required(),
});

module.exports = contactSchema;
