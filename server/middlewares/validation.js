const Joi = require('joi');

module.exports = {
  itemSchema: Joi.object({
    title: Joi.string().min(3).max(100).required(),
    description: Joi.string().max(500).allow('')
  }),
  
  userSchema: Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required()
  })
};