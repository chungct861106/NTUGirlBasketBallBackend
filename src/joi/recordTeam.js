const Joi = require("joi");

const RecordTeamAPI = {
  CreateRecordTeam: Joi.object({
    match_id: Joi.string().required(),
    team_id: Joi.string().required(),
    score1: Joi.number().required(),
    score2: Joi.number().required(),
    score3: Joi.number().required(),
    score4: Joi.number().required(),
    foul1: Joi.number().required(),
    foul2: Joi.number().required(),
    foul3: Joi.number().required(),
    foul4: Joi.number().required(),
    stopWatch1: Joi.boolean().required(),
    stopWatch2: Joi.boolean().required(),
    stopWatch3: Joi.boolean().required(),
    stopWatch4: Joi.boolean().required(),
    stopWatch5: Joi.boolean().required(),
  }),
  GetRecordTeam: Joi.object({
    recordTeam_id: Joi.string(),
    match_id: Joi.string(),
    team_id: Joi.string(),
  }),
  RecordTeamUpdate: Joi.object({
    recordTeam_id: Joi.string().required(),
    score1: Joi.number().allow(null),
    score2: Joi.number().allow(null),
    score3: Joi.number().allow(null),
    score4: Joi.number().allow(null),
    foul1: Joi.number().allow(null),
    foul2: Joi.number().allow(null),
    foul3: Joi.number().allow(null),
    foul4: Joi.number().allow(null),
    stopWatch1: Joi.boolean().allow(null),
    stopWatch2: Joi.boolean().allow(null),
    stopWatch3: Joi.boolean().allow(null),
    stopWatch4: Joi.boolean().allow(null),
    stopWatch5: Joi.boolean().allow(null),
  }),
};

module.exports.RecordTeamAPI = RecordTeamAPI;
