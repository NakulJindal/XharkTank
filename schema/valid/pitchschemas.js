const Joi = require('joi');

module.exports.pitchSchema = Joi.object({
    entrepreneur: Joi.string().required(),
    pitchTitle: Joi.string().required().min(0),
    pitchIdea: Joi.string().required(),
    askAmount: Joi.number().required(),
    equity: Joi.number().required(),
    offers: Joi.array()
});