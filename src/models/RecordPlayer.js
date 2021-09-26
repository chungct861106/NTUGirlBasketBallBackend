const exception = require("../modules/exception");
const { RecordPlayerAPI } = require("../joi/recordPlayer");
const Logger = require("../modules/logger");
const RecordPlayerSchema = require("../schema/RecordPlayer");

class RecordPlayer {
  constructor(token) {
    this.token = token;
  }
}

RecordPlayer.prototype.Create = async function (TeamObj) {
  const TAG = "[Create RecordPlayer]";
  const logger = new Logger();

  const validate = await RecordPlayerAPI.CreateRecordPlayer.validate(TeamObj);
  if (validate.error) {
    logger.error(TAG, "Invalid Parameters");
    throw exception.BadRequestError(
      "BAD_REQUEST",
      validate.error.details[0].message
    );
  }
  try {
    const RecordPlayer = new RecordPlayerSchema(TeamObj);
    return RecordPlayer.save();
  } catch (err) {
    logger.error(TAG, "Create RecordPlayer Failed");
    throw exception.ServerError(
      "SERVER_ERROR",
      "Create RecordPlayer Failed:" + err
    );
  }
};

RecordPlayer.prototype.Delete = async function (RecordPlayer_id) {
  const TAG = "[Delete RecordPlayer]";
  const logger = new Logger();

  try {
    await RecordPlayerSchema.findByIdAndDelete(RecordPlayer_id);
    return "Success";
  } catch (err) {
    logger.error(TAG, "Delete RecordPlayer Failed");
    throw exception.ServerError(
      "SERVER_ERROR",
      "Delete RecordPlayer Failed:" + err
    );
  }
};
module.exports = RecordPlayer;
