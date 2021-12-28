const Joi = require("joi");

const RateAPI = {
  GiveRate: Joi.object({
    question_id: Joi.string().required(),
    rate: Joi.number().required(),
  }),
};

module.exports.RateAPI = RateAPI;
