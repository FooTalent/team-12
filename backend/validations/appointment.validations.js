const Joi = require('joi');

// Esquema general para citas
const appointmentSchema = Joi.object({
  patient_id: Joi.number().integer().required(),
  dentist_id: Joi.number().integer().required(),
  reason_id: Joi.number().integer().required(),
  date: Joi.date().iso().required(),
  time: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).required(),
  state: Joi.string().valid('confirmed', 'pending', 'rescheduled', 'cancelled').required(),
  observations: Joi.string().optional(),
  assistance: Joi.boolean().required().optional(),
  anticipation_time: Joi.number().integer().min(0).max(72 * 60).optional(),
  is_active: Joi.boolean().required().optional(),
});


module.exports = {
    appointmentSchema
};