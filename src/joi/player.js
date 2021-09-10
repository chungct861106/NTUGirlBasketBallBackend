const Joi = require("joi");
const DepartmentInfo = require("../department.json");

const PlayerSchema = require("../schema/Player");
const UserSchema = require("../schema/User");

const PlayerAPI = {
  CreatePlayer: Joi.object({
    team_id: Joi.string().required(),
    name: Joi.string().required(),
    studentID: Joi.string().required(),
    grade: Joi.number().required(),
    number: Joi.number(),
    photo: Joi.string(),
  }),

  PlayerUpdate: Joi.object({
    player_id: Joi.string().required(),
    name: Joi.string(),
    studentID: Joi.string(),
    grade: Joi.number(),
    photo: Joi.string(),
    number: Joi.number(),
  }),

  GetPlayer: Joi.object({
    player_id: Joi.string(),
    team_id: Joi.string(),
    name: Joi.string(),
    studentID: Joi.string(),
    grade: Joi.number(),
    number: Joi.number(),
  }),
};

const PlayerValider = {
  isValidUserID: async (id) => {
    try {
      const exist = await UserSchema.findById(id);
      return exist !== undefined && exist !== null;
    } catch {
      return false;
    }
  },
  isValidPlayerID: async (id) => {
    try {
      const exist = await PlayerSchema.findById(id);
      return exist !== undefined && exist !== null;
    } catch {
      return false;
    }
  },
};

module.exports.PlayerAPI = PlayerAPI;
module.exports.PlayerValider = PlayerValider;
