const Joi = require("joi");
const DepartmentInfo = require("../department.json");

const UserSchema = require("../schema/User");

const UserAPI = {
  CreateUser: Joi.object({
    account: Joi.string().alphanum().min(3).max(20).required(),

    password: Joi.string()
      .required()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),

    passwordconfirm: Joi.ref("password"),

    email: Joi.string()
      .required()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net", "tw"] },
      }),

    admin: Joi.any().valid("administer", "team", "recorder").required(),
    department: Joi.any()
      .valid(...DepartmentInfo["list"])
      .required(),
  }),

  UserUpdate: Joi.object({
    account: Joi.string().alphanum().min(3).max(20),

    email: Joi.string().email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net", "tw"] },
    }),

    department: Joi.any().valid(...DepartmentInfo["list"]),
    token: Joi.object(),
  }),

  UserLogin: Joi.object({
    account: Joi.string().alphanum().min(3).max(20).required(),
    password: Joi.string()
      .required()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
  }),
  GetUserData: Joi.object({
    user_id: Joi.string(),
    account: Joi.string().alphanum(),
    email: Joi.string().email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net", "tw"] },
    }),

    admin: Joi.any().valid("administer", "team", "recorder"),
    department: Joi.any().valid(...DepartmentInfo["list"]),
  }),
  UserActive: Joi.object({
    id: Joi.string().required(),
  }),
  UserRemind: Joi.string().email().required(),
};

const UserValider = {
  isUniqueAccount: async (account) => {
    const exist = await UserSchema.findOne({ account });
    return exist === undefined || exist === null;
  },
  isUniqueEmail: async (email) => {
    const exist = await UserSchema.findOne({ email });
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
