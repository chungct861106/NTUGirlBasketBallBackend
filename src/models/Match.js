const exception = require("../modules/exception");
const { MatchAPI, MatchValider } = require("../joi/Match");
const { TeamValider } = require("../joi/team");
const Logger = require("../modules/logger");
const MatchSchema = require("../schema/Match");
const TeamSchema = require("../schema/Team");
const UserSchema = require("../schema/User");
const config = require("../config");

class Match {
  constructor(token) {
    this.token = token;
  }
}

Match.prototype.Create = async function (MatchObj) {
  const TAG = "[Create Match]";
  const logger = new Logger();
  if (config.ADMIN_LEVEL[this.token.admin] < 2) {
    logger.error(
      TAG,
      `Adiminister (${this.token.adim}) has no access to ${TAG}.`
    );
    throw exception.PermissionError("Permission Deny", "have no access");
  }

  const validate = await MatchAPI.CreateMatch.validate(MatchObj);
  if (validate.error) {
    logger.error(TAG, "Invalid Parameters");
    throw exception.BadRequestError(
      "BAD_REQUEST",
      validate.error.details[0].message
    );
  }
  const { home, away } = MatchObj;
  // if (!(home === "none" || (await TeamValider.isValidTeamID(home)))) {
  //   logger.error(TAG, "Invalid Parameters");
  //   throw exception.BadRequestError("BAD_REQUEST", "Invalid Home Team ID");
  // } else
  if (!(await TeamValider.isValidTeamID(away))) {
    logger.error(TAG, "Invalid Parameters");
    throw exception.BadRequestError("BAD_REQUEST", "Invalid Away Team ID");
  }

  try {
    const Match = new MatchSchema(MatchObj);
    return Match.save();
  } catch (err) {
    logger.error(TAG, "Create Match Failed");
    throw exception.ServerError("SERVER_ERROR", "Create Match Failed:" + err);
  }
};

Match.prototype.Update = async function (MatchObj) {
  const TAG = "[Update Match]";
  const logger = new Logger();
  if (
    config.ADMIN_LEVEL[this.token.admin] < 2 &&
    this.token.admin !== "recorder"
  ) {
    logger.error(
      TAG,
      `Adiminister (${this.token.admin}) has no access to ${TAG}.`
    );
    throw exception.PermissionError("Permission Deny", "have no access");
  }

  const validate = await MatchAPI.MatchUpdate.validate(MatchObj);
  if (validate.error) {
    logger.error(TAG, "Invalid Parameters");
    throw exception.BadRequestError(
      "BAD_REQUEST",
      validate.error.details[0].message
    );
  }
  const { match_id } = MatchObj;

  const Match = await MatchSchema.findById(match_id);

  if (!Match) {
    logger.error(TAG, "Invalid Parameters");
    throw exception.BadRequestError("BAD_REQUEST", "Invalid Match ID");
  }
  try {
    const newMatch = await MatchSchema.findByIdAndUpdate(match_id, MatchObj, {
      new: true,
    });
    newMatch.home = await TeamSchema.findById(newMatch.home);
    newMatch.away = await TeamSchema.findById(newMatch.away);
    newMatch.recorder = await UserSchema.findById(newMatch.recorder);
    return newMatch;
  } catch (err) {
    logger.error(TAG, "Update Match Failed");
    throw exception.ServerError("SERVER_ERROR", err);
  }
};

Match.prototype.Delete = async function (MatchID) {
  const TAG = "[Delete Match]";
  const logger = new Logger();
  if (config.ADMIN_LEVEL[this.token.admin] < 2) {
    logger.error(
      TAG,
      `Adiminister (${this.token.adim}) has no access to ${TAG}.`
    );
    throw exception.PermissionError("Permission Deny", "have no access");
  }

  if (!(await MatchValider.isValidMatchID(MatchID))) {
    logger.error(TAG, "Invalid Parameters");
    throw exception.BadRequestError("BAD_REQUEST", "Invalid Match ID");
  }

  try {
    await MatchSchema.findByIdAndDelete(MatchID);
    return "Success";
  } catch (err) {
    logger.error(TAG, "Delete Match Failed");
    throw exception.ServerError("SERVER_ERROR", "Delete Match Failed:" + err);
  }
};

Match.prototype.GetData = async function (ReqInfo) {
  const TAG = "[GetData Match]";
  const logger = new Logger();
  const validate = await MatchAPI.GetMatch.validate(ReqInfo);
  if (validate.error) {
    logger.error(TAG, "Invalid Parameters");
    throw exception.BadRequestError(
      "BAD_REQUEST",
      validate.error.details[0].message
    );
  }
  if (
    "match_id" in ReqInfo &&
    (await MatchValider.isValidMatchID(ReqInfo["match_id"]))
  ) {
    const Match = await MatchSchema.findById(ReqInfo["match_id"]);
    Match.home = await TeamSchema.findById(Match.home);
    Match.away = await TeamSchema.findById(Match.away);
    return Match;
  }
  const data = await MatchSchema.find(ReqInfo);
  return Promise.all(
    data.map(async (element) => {
      element.home = await TeamSchema.findById(element.home);
      element.away = await TeamSchema.findById(element.away);
      return element;
    })
  );
};

module.exports = Match;
