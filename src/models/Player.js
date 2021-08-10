const exception = require("../modules/exception");
const { PlayerAPI, PlayerValider } = require("../joi/Player");
const { TeamValider } = require("../joi/Team");
const Logger = require("../modules/logger");
const PlayerSchema = require("../schema/Player");
const TeamSchema = require("../schema/Team");

class Player {
  constructor(token) {
    this.token = token;
  }
}

Player.prototype.Create = async function (PlayerObj) {
  const TAG = "[Create Player]";
  const logger = new Logger();
  if (this.token.admin !== "team") {
    logger.error(
      TAG,
      `Adiminister (${this.token.adim}) has no access to ${TAG}.`
    );
    throw exception.PermissionError("Permission Deny", "have no access");
  }
  const validate = await PlayerAPI.CreatePlayer.validate(PlayerObj);
  if (validate.error) {
    logger.error(TAG, "Invalid Parameters");
    throw exception.BadRequestError(
      "BAD_REQUEST",
      validate.error.details[0].message
    );
  }
  const { team_id } = PlayerObj;

  if (!(await TeamValider.isValidTeamID(team_id))) {
    logger.error(TAG, `Invalid Team ID.`);
    throw exception.BadRequestError("BAD_REQUEST", "Invalid Team ID");
  }
  const team = await TeamSchema.findById(team_id);
  if (!team.user_id.equals(this.token.user_id)) {
    logger.error(
      TAG,
      `Adiminister (${this.token.adim}) has no access to ${TAG}.`
    );
    throw exception.PermissionError("Permission Deny", "have no access");
  }

  try {
    const Player = new PlayerSchema(PlayerObj);
    return Player.save();
  } catch (err) {
    logger.error(TAG, "Create Player Failed");
    throw exception.ServerError("SERVER_ERROR", "Create Player Failed:" + err);
  }
};

Player.prototype.Update = async function (PlayerObj) {
  const TAG = "[Update Player]";
  const logger = new Logger();
  if (this.token.admin !== "team") {
    logger.error(
      TAG,
      `Adiminister (${this.token.adim}) has no access to ${TAG}.`
    );
    throw exception.PermissionError("Permission Deny", "have no access");
  }
  const validate = await PlayerAPI.PlayerUpdate.validate(PlayerObj);
  if (validate.error) {
    logger.error(TAG, "Invalid Parameters");
    throw exception.BadRequestError(
      "BAD_REQUEST",
      validate.error.details[0].message
    );
  }
  const { player_id } = PlayerObj;

  if (!(await PlayerValider.isValidPlayerID(player_id))) {
    logger.error(TAG, `Invalid Player ID.`);
    throw exception.BadRequestError("BAD_REQUEST", "Invalid Player ID");
  }

  const Player = await PlayerSchema.findById(player_id);
  const team = await TeamSchema.findById(Player.team_id);
  if (!team.user_id.equals(this.token.user_id)) {
    logger.error(
      TAG,
      `Adiminister (${this.token.adim}) has no access to ${TAG}.`
    );
    throw exception.PermissionError("Permission Deny", "have no access");
  }

  try {
    return await PlayerSchema.findByIdAndUpdate(player_id, PlayerObj, {
      new: true,
    });
  } catch (err) {
    logger.error(TAG, "Update Player Failed");
    throw exception.ServerError("SERVER_ERROR", err);
  }
};

Player.prototype.Delete = async function (PlayerID) {
  const TAG = "[Delete Player]";
  const logger = new Logger();
  if (!PlayerValider.isValidPlayerID(PlayerID)) {
    logger.error(TAG, `Invalid Player ID.`);
    throw exception.BadRequestError("BAD_REQUEST", "Invalid Player ID");
  }

  const Player = await PlayerSchema.findById(PlayerID);
  const team = await TeamSchema.findById(Player.team_id);
  if (!team.user_id.equals(this.token.user_id)) {
    logger.error(
      TAG,
      `Adiminister (${this.token.adim}) has no access to ${TAG}.`
    );
    throw exception.PermissionError("Permission Deny", "have no access");
  }

  try {
    await PlayerSchema.findByIdAndDelete(PlayerID);
    return "Success";
  } catch (err) {
    logger.error(TAG, "Delete Player Failed");
    throw exception.ServerError("SERVER_ERROR", "Delete Player Failed:" + err);
  }
};

Player.prototype.GetData = async function (ReqInfo) {
  const TAG = "[GetData Player]";
  const logger = new Logger();
  const validate = await PlayerAPI.GetPlayer.validate(ReqInfo);
  if (validate.error) {
    logger.error(TAG, "Invalid Parameters");
    throw exception.BadRequestError(
      "BAD_REQUEST",
      validate.error.details[0].message
    );
  }
  if (
    "player_id" in ReqInfo &&
    (await PlayerValider.isValidPlayerID(ReqInfo["player_id"]))
  )
    return await PlayerSchema.findById(ReqInfo["player_id"]);
  return await PlayerSchema.find(ReqInfo);
};

module.exports = Player;
