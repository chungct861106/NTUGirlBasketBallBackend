const Joi = require("joi");

const RecordPlayerAPI = {
  CreateRecordPlayer: Joi.object({
    match_id: Joi.string().required(),
    team_id: Joi.string().required(),
    player_id: Joi.string().required(),
    steal: Joi.number().required(),
    assist: Joi.number().required(),
    block: Joi.number().required(),
    plus2: Joi.number().required(),
    plus3: Joi.number().required(),
    bankShot: Joi.number().required(),
  }),
  GetRecordTeam: Joi.object({
    recordPlayer_id: Joi.string(),
    match_id: Joi.string(),
    team_id: Joi.string(),
    player_id: Joi.string(),
  }),
  RecordPlayerUpdate: Joi.object({
    recordPlayer_id: Joi.string().required(),
    foul: Joi.number().allow(null),
    steal: Joi.number().allow(null),
    assist: Joi.number().allow(null),
    block: Joi.number().allow(null),
    plus2: Joi.number().allow(null),
    plus3: Joi.number().allow(null),
    bankShot: Joi.number().allow(null),
  }),
};

module.exports.RecordPlayerAPI = RecordPlayerAPI;
