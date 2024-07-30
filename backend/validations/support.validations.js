const Joi = require('joi');

const supportRequestSchema = Joi.object({
  first_name: Joi.string().min(1).max(100).required(),
  last_name: Joi.string().min(1).max(100).required(),
  email: Joi.string().email().required(),
  issue_detail: Joi.string().min(1).max(1000).required(),
});

module.exports = {
  supportRequestSchema,
};
