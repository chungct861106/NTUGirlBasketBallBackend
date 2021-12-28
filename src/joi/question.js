const Joi = require("joi");
const QuestionSchema = require("../schema/Question");

const types = ["student", "employee", "boss", "CEO"];
const QuestionAPI = {
  CreateQuestion: Joi.object({
    title: Joi.string().required(),
    user_id: Joi.string().required(),
    type: Joi.any().valid(...["QA", "OP"]),
    option1: Joi.string(),
    option2: Joi.string(),
  }),

  QuestionUpdate: Joi.object({
    question_id: Joi.string().required(),
    title: Joi.string().required(),
    type: Joi.any().valid(...["QA", "OP"]),
    option1: Joi.string(),
    option2: Joi.string(),
  }),

  GetQuestion: Joi.object({
    question_id: Joi.string(),
    user_id: Joi.string(),
    type: Joi.any().valid(...["QA", "OP"]),
  }),
};

const QuestionValider = {
  isValidQuestionID: async (id) => {
    try {
      const exist = await QuestionSchema.findById(id);
      return exist ? exist : false;
    } catch {
      return false;
    }
  },
};

module.exports.QuestionAPI = QuestionAPI;
module.exports.QuestionValider = QuestionValider;
