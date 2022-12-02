const Joi = require('joi');

module.exports.offerSchema = Joi.object({
    investor: Joi.string().required(),
    amount: Joi.number().required(),
    equity: Joi.number().required(),
    comment: Joi.string().required()
});