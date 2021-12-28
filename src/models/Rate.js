const exception = require("../modules/exception");
const { RateAPI } = require("../joi/rate");
const Logger = require("../modules/logger");
const RateSchema = require("../schema/Rate");
const { QuestionValider } = require("../joi/question");
class Rate {
  constructor(token) {
    this.token = token;
  }
}
Rate.prototype.GiveRate = async function (RateObj) {
  const TAG = "[Create Rate]";
  const logger = new Logger();
  const validate = await RateAPI.GiveRate.validate(RateObj);
  if (validate.error) {
    logger.error(TAG, "Invalid Parameters");
    throw exception.BadRequestError(
      "BAD_REQUEST",
      validate.error.details[0].message
    );
  }
  const { question_id, rate } = RateObj;
  if (!(await QuestionValider.isValidQuestionID(question_id))) {
    logger.error(TAG, "Invalid Parameters");
    throw exception.BadRequestError("BAD_REQUEST", "Invalid Question ID");
  }
  let rating = await RateSchema.findOne({
    user_id: this.token.user_id,
    question_id: question_id,
  });

  try {
    if (rating) {
      rating.rate = rate;
      rating.save();
      return "Success";
    }
    const Rate = await new RateSchema({
      ...RateObj,
      user_id: this.token.user_id,
    });
    Rate.save();
    return "Success";
  } catch (err) {
    logger.error(TAG, "Create Rate Failed");
    throw exception.ServerError("SERVER_ERROR", "Create Rate Failed:" + err);
  }
};

module.exports = Rate;
