const Joi = require("joi");
const DepartmentInfo = require("../department.json");

const TeamSchema = require("../schema/Team");
const UserSchema = require("../schema/User");

const TeamAPI = {
  CreateTeam: Joi.object({
    name: Joi.string().required(),
    department: Joi.any()
      .valid(...DepartmentInfo["list"])
      .required(),
  }),

  TeamUpdate: Joi.object({
    team_id: Joi.string().required(),
    name: Joi.string(),
    department: Joi.any().valid(...DepartmentInfo["list"]),
  }),

  TeamAssign: Joi.array().items(
    Joi.object().keys({
      team_id: Joi.string().required(),
      session_preGame: Joi.string(),
      name: Joi.string(),
      session_interGame: Joi.number(),
      status: Joi.any().valid("未報名", "未繳費", "已繳費"),
    })
  ),
  TeamSetStatus: Joi.object({
    team_id: Joi.string(),
    status: Joi.any().valid("未報名", "未繳費", "已繳費"),
  }),

  GetTeam: Joi.object({
    team_id: Joi.string(),
    user_id: Joi.string(),
    department: Joi.any().valid(...DepartmentInfo["list"]),
    session_preGame: Joi.string(),
    session_interGame: Joi.number(),
  }),
};

const TeamValider = {
  isUniqueTeamName: async (name) => {
    const exist = await TeamSchema.findOne({ name });
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
  isValidTeamID: async (id) => {
    try {
      const exist = await TeamSchema.findById(id);
      return exist !== undefined && exist !== null;
    } catch {
      return false;
    }
  },
};

module.exports.TeamAPI = TeamAPI;
module.exports.TeamValider = TeamValider;
