const Joi = require("joi");
const TestSchema = require("../schema/Test");

const types = ["student", "employee", "boss", "CEO"];
const TestAPI = {
  CreateTest: Joi.object({
    name: Joi.string().required(),
    number: Joi.number().required(),
    type: Joi.any().valid(...types),
    url: Joi.string(),
  }),

  TestUpdate: Joi.object({
    test_id: Joi.string().required(),
    name: Joi.string(),
    number: Joi.number(),
    type: Joi.any().valid(...types),
    url: Joi.string(),
  }),

  GetTest: Joi.object({
    test_id: Joi.string(),
    name: Joi.string(),
    number: Joi.number(),
    type: Joi.any().valid(...types),
    url: Joi.string(),
  }),
};

const TestValider = {
  isUniqueTestName: async (name) => {
    const exist = await TestSchema.findOne({ name });
    return exist === undefined || exist === null;
  },
  isValidTestID: async (id) => {
    try {
      const exist = await TestSchema.findById(id);
      return exist !== undefined && exist !== null;
    } catch {
      return false;
    }
  },
};

module.exports.TestAPI = TestAPI;
module.exports.TestValider = TestValider;
