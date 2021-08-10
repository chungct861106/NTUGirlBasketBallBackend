const Joi = require("joi");

const MatchSchema = require("../schema/Match");
const UserSchema = require("../schema/User");

const MatchAPI = {
  CreateMatch: Joi.object({
    home: Joi.string().required(),
    away: Joi.string().required(),
    stage: Joi.string(),
    stage_Session: Joi.any().valid("interGame", "preGame"),
  }),

  MatchUpdate: Joi.object({
    match_id: Joi.string().required(),
    stage: Joi.any().valid("interGame", "preGame").allow(null),
    stage_session: Joi.string().allow(null),
    startDate: Joi.date().allow(null),
    field: Joi.number().max(2).min(0).allow(null),
    recorder: Joi.string().allow(null),
    winner: Joi.string().allow(null),
  }),

  GetMatch: Joi.object({
    match_id: Joi.string(),
    home: Joi.string(),
    away: Joi.string(),
    stage: Joi.any().valid("interGame", "preGame"),
    stage_Session: Joi.string(),
    startDate: Joi.date(),
    field: Joi.number().max(2).min(0),
    recorder: Joi.string(),
    winner: Joi.string(),
  }),
};

const MatchValider = {
  isValidUserID: async (id) => {
    try {
      const exist = await UserSchema.findById(id);
      return exist !== undefined && exist !== null;
    } catch {
      return false;
    }
  },
  isValidMatchID: async (id) => {
    try {
      const exist = await MatchSchema.findById(id);
      return exist !== undefined && exist !== null;
    } catch {
      return false;
    }
  },
};

module.exports.MatchAPI = MatchAPI;
module.exports.MatchValider = MatchValider;
