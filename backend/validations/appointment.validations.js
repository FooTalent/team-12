const Joi = require('joi');

// Esquema general para citas
const appointmentSchema = Joi.object({
  patient_id: Joi.number().integer().optional(),
  dentist_id: Joi.number().integer().optional(),
  reason_id: Joi.number().integer().optional(),
  date: Joi.date().iso().optional(),
  time: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).optional(),
  state: Joi.string().valid('scheduled', 'completed', 'cancelled').optional(),
  observations: Joi.string().optional()
});

module.exports = {
    appointmentSchema
};