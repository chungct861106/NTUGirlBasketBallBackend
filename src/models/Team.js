const exception = require("../modules/exception");
const { TeamAPI, TeamValider } = require("../joi/Team");
const Logger = require("../modules/logger");
const TeamSchema = require("../schema/Team");
const UserSchema = require("../schema/User");
const config = require("../config");

class Team {
  constructor(token) {
    this.token = token;
  }
}

Team.prototype.Create = async function (TeamObj) {
  const TAG = "[Create Team]";
  const logger = new Logger();

  const validate = await TeamAPI.CreateTeam.validate(TeamObj);
  if (validate.error) {
    logger.error(TAG, "Invalid Parameters");
    throw exception.BadRequestError(
      "BAD_REQUEST",
      validate.error.details[0].message
    );
  }
  const { name } = TeamObj;
  if (!(await TeamValider.isUniqueTeamName(name))) {
    logger.error(TAG, "Invalid Parameters");
    throw exception.BadRequestError("BAD_REQUEST", "Team Name already exist");
  }

  TeamObj.user_id = this.token.user_id;
  try {
    const Team = new TeamSchema(TeamObj);
    return Team.save();
  } catch (err) {
    logger.error(TAG, "Create Team Failed");
    throw exception.ServerError("SERVER_ERROR", "Create Team Failed:" + err);
  }
};

Team.prototype.Update = async function (TeamObj) {
  const TAG = "[Update Team]";
  const logger = new Logger();

  const validate = await TeamAPI.TeamUpdate.validate(TeamObj);
  if (validate.error) {
    logger.error(TAG, "Invalid Parameters");
    throw exception.BadRequestError(
      "BAD_REQUEST",
      validate.error.details[0].message
    );
  }
  const { team_id } = TeamObj;

  const team = await TeamSchema.findById(team_id);

  if (!team) {
    logger.error(TAG, "Invalid Parameters");
    throw exception.BadRequestError("BAD_REQUEST", "Invalid Team ID");
  } else if (!team.user_id.equals(this.token.user_id)) {
    logger.error(TAG, `User (${team.user_id}) has no access to ${TAG}.`);
    throw exception.PermissionError("Permission Deny", "have no access");
  }
  try {
    return await TeamSchema.findByIdAndUpdate(team_id, TeamObj, { new: true });
  } catch (err) {
    if (err.keyValue) {
      err.keyValue.message = "Duplicated value";
      logger.error(TAG, "Invalid Parameters");
      throw exception.BadRequestError("BAD_REQUEST", err.keyValue);
    }
    logger.error(TAG, "Update Team Failed");
    throw exception.ServerError("SERVER_ERROR", err);
  }
};

Team.prototype.Assign = async function ({ TeamObj }) {
  const TAG = "[Assign Team]";
  const logger = new Logger();
  if (config.ADMIN_LEVEL[this.token.admin] < 2) {
    logger.error(
      TAG,
      `Adiminister (${this.token.adim}) has no access to ${TAG}.`
    );
    throw exception.PermissionError("Permission Deny", "have no access");
  }

  const validate = await TeamAPI.TeamAssign.validate(TeamObj);
  if (validate.error) {
    logger.error(TAG, "Invalid Parameters");
    throw exception.BadRequestError(
      "BAD_REQUEST",
      validate.error.details[0].message
    );
  }

  try {
    const mapResult = TeamObj.map(async (aTeam) => {
      const { team_id } = aTeam;
      const team = await TeamSchema.findById(team_id);

      if (!team) {
        logger.error(TAG, "Invalid Parameters");
        throw exception.BadRequestError("BAD_REQUEST", "Invalid Team ID");
      }
      try {
        const updateSuccess = await TeamSchema.findByIdAndUpdate(
          team_id,
          aTeam,
          {
            new: true,
          }
        );
      } catch (err) {
        logger.error(TAG, "Update Team Failed");
        throw exception.ServerError("SERVER_ERROR", err);
      }
    });
  } catch (err) {
    logger.error(TAG, "Update Teams Failed");
    throw exception.ServerError("SERVER_ERROR", err);
  }

  return;
};

Team.prototype.Delete = async function (TeamID) {
  const TAG = "[Delete Team]";
  const logger = new Logger();
  if (!(await TeamValider.isValidTeamID(TeamID))) {
    logger.error(TAG, "Invalid Parameters");
    throw exception.BadRequestError("BAD_REQUEST", "Invalid Team ID");
  }
  const team = await TeamSchema.findById(TeamID);
  if (
    config.ADMIN_LEVEL[this.token.admin] < 2 &&
    !team.user_id.equals(this.token.user_id)
  ) {
    logger.error(
      TAG,
      `Adiminister (${this.token.admin}) has no access to ${TAG}.`
    );
    throw exception.PermissionError("Permission Deny", "have no access");
  }

  try {
    await TeamSchema.findByIdAndDelete(TeamID);
    return "Success";
  } catch (err) {
    logger.error(TAG, "Delete Team Failed");
    throw exception.ServerError("SERVER_ERROR", "Delete Team Failed:" + err);
  }
};

Team.prototype.GetData = async function (ReqInfo) {
  const TAG = "[GetData Team]";
  const logger = new Logger();
  const validate = await TeamAPI.GetTeam.validate(ReqInfo);
  if (validate.error) {
    logger.error(TAG, "Invalid Parameters");
    throw exception.BadRequestError(
      "BAD_REQUEST",
      validate.error.details[0].message
    );
  }
  if (
    "team_id" in ReqInfo &&
    (await TeamValider.isValidTeamID(ReqInfo["team_id"]))
  )
    return await TeamSchema.findById(ReqInfo["team_id"]);
  const data = await TeamSchema.find(ReqInfo);
  return Promise.all(
    data.map(async (team) => {
      team.user_id = await UserSchema.findById(team.user_id);
      return team;
    })
  );
};

Team.prototype.SetStatus = async function (TeamObj) {
  const TAG = "[Status Team]";
  const logger = new Logger();
  if (config.ADMIN_LEVEL[this.token.admin] < 2) {
    logger.error(
      TAG,
      `Adiminister (${this.token.adim}) has no access to ${TAG}.`
    );
    throw exception.PermissionError("Permission Deny", "have no access");
  }

  const validate = await TeamAPI.TeamSetStatus.validate(TeamObj);
  if (validate.error) {
    logger.error(TAG, "Invalid Parameters");
    throw exception.BadRequestError(
      "BAD_REQUEST",
      validate.error.details[0].message
    );
  }

  const { team_id } = TeamObj;
  const team = await TeamSchema.findById(team_id);

  if (!team) {
    logger.error(TAG, "Invalid Parameters");
    throw exception.BadRequestError("BAD_REQUEST", "Invalid Team ID");
  }
  try {
    return await TeamSchema.findByIdAndUpdate(team_id, TeamObj, {
      new: true,
    });
  } catch (err) {
    logger.error(TAG, "Update Team Failed");
    throw exception.ServerError("SERVER_ERROR", err);
  }
};

module.exports = Team;
