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
    team_id: Joi.string(),
  }),
};

module.exports.RecordTeamAPI = RecordTeamAPI;
