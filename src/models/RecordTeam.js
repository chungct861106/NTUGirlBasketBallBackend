const exception = require("../modules/exception");
const { RecordTeamAPI } = require("../joi/recordTeam");
const Logger = require("../modules/logger");
const RecordTeamSchema = require("../schema/RecordTeam");

class RecordTeam {
  constructor(token) {
    this.token = token;
  }
}

RecordTeam.prototype.Create = async function (TeamObj) {
  const TAG = "[Create RecordTeam]";
  const logger = new Logger();

  const validate = await RecordTeamAPI.CreateRecordTeam.validate(TeamObj);
  if (validate.error) {
    logger.error(TAG, "Invalid Parameters");
    throw exception.BadRequestError(
      "BAD_REQUEST",
      validate.error.details[0].message
    );
  }
  try {
    const RecordTeam = new RecordTeamSchema(TeamObj);
    return RecordTeam.save();
  } catch (err) {
    logger.error(TAG, "Create RecordTeam Failed");
    throw exception.ServerError(
      "SERVER_ERROR",
      "Create RecordTeam Failed:" + err
    );
  }
};

RecordTeam.prototype.Delete = async function (RecordTeam_id) {
  const TAG = "[Delete Match]";
  const logger = new Logger();

  try {
    await RecordTeamSchema.findByIdAndDelete(RecordTeam_id);
    return "Success";
  } catch (err) {
    logger.error(TAG, "Delete Match Failed");
    throw exception.ServerError("SERVER_ERROR", "Delete Match Failed:" + err);
  }
};

RecordTeam.prototype.GetData = async function (ReqInfo) {
  const TAG = "[GetData RecordTeam]";
  const logger = new Logger();
  const validate = await RecordTeamAPI.GetRecordTeam.validate(ReqInfo);
  if (validate.error) {
    logger.error(TAG, "Invalid Parameters");
    throw exception.BadRequestError(
      "BAD_REQUEST",
      validate.error.details[0].message
    );
  }

  const data = await RecordTeamSchema.findById(ReqInfo["recordTeam_id"]);
  return Promise.all(
    data.map(async (element) => {
      element.team_id = await TeamSchema.findById(element.team_id);
      return element;
    })
  );
};

module.exports = RecordTeam;
