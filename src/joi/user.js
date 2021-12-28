const Joi = require("joi");
const UserSchema = require("../schema/User");

const UserAPI = {
  CreateUser: Joi.object({
    email: Joi.string().required().email(),
    username: Joi.string().required(),
    password: Joi.string()
      .required()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
    passwordconfirm: Joi.ref("password"),
  }),

  UserUpdate: Joi.object({
    username: Joi.string().required(),
  }),

  UserLogin: Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string()
      .required()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
  }),
  GetUserData: Joi.object({
    user_id: Joi.string(),
  }),

  UserRemind: Joi.string().required().email(),
};

const UserValider = {
  isUniqueEmail: async (email) => {
    const exist = await UserSchema.findOne({ email });
    return exist === undefined || exist === null;
  },
  isUniqueName: async (username) => {
    const exist = await UserSchema.findOne({ username });
    return exist === undefined || exist === null;
  },
  isValidUserID: async (id) => {
    try {
      const exist = await UserSchema.findById(id);
      return exist !== undefined && exist !== null;
    } catch {
      return false;
    }
  },
};

module.exports.UserAPI = UserAPI;
module.exports.UserValider = UserValider;
