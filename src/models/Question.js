const exception = require("../modules/exception");
const { QuestionAPI, QuestionValider } = require("../joi/question");
const Logger = require("../modules/logger");
const QuestionSchema = require("../schema/Question");
const UserSchma = require("../schema/User");
const RateSchema = require("../schema/Rate");
class Question {
  constructor(token) {
    this.token = token;
  }
}

Question.prototype.Create = async function (QuestionObj) {
  const TAG = "[Create Question]";
  const logger = new Logger();

  const validate = await QuestionAPI.CreateQuestion.validate(QuestionObj);
  if (validate.error) {
    logger.error(TAG, "Invalid Parameters");
    throw exception.BadRequestError(
      "BAD_REQUEST",
      validate.error.details[0].message
    );
  }
  QuestionObj.create_user_id = this.token.user_id;
  try {
    const Question = new QuestionSchema(QuestionObj);
    return Question.save();
  } catch (err) {
    logger.error(TAG, "Create Question Failed");
    throw exception.ServerError(
      "SERVER_ERROR",
      "Create Question Failed:" + err
    );
  }
};

Question.prototype.Update = async function (QuestionObj) {
  const TAG = "[Update Question]";
  const logger = new Logger();

  const validate = await QuestionAPI.QuestionUpdate.validate(QuestionObj);
  if (validate.error) {
    logger.error(TAG, "Invalid Parameters");
    throw exception.BadRequestError(
      "BAD_REQUEST",
      validate.error.details[0].message
    );
  }
  const { question_id } = QuestionObj;
  const question = await QuestionValider.isValidQuestionID(question_id);
  if (!question) {
    logger.error(TAG, "Invalid Parameters");
    throw exception.BadRequestError("BAD_REQUEST", "Invalid Question ID");
  } else if (!question.create_user_id.equals(this.token.user_id)) {
    logger.error(TAG, "Invalid Parameters");
    throw exception.PermissionError("PERMISSION_DENY", "Can not change others");
  } else if (question.user_id.equals(this.token.user_id)) {
    logger.error(TAG, "Invalid Parameters");
    throw exception.PermissionError(
      "PERMISSION_DENY",
      "Can not change yourself"
    );
  }
  try {
    await QuestionSchema.findByIdAndUpdate(question_id, QuestionObj, {
      new: true,
      select: "-create_user_id",
    });
    return "Success";
  } catch (err) {
    logger.error(TAG, "Update Question Failed");
    throw exception.ServerError("SERVER_ERROR", err);
  }
};

Question.prototype.GetData = async function (ReqInfo) {
  const TAG = "[GetData Question]";
  const logger = new Logger();
  const validate = await QuestionAPI.GetQuestion.validate(ReqInfo);
  if (validate.error) {
    logger.error(TAG, "Invalid Parameters");
    throw exception.BadRequestError(
      "BAD_REQUEST",
      validate.error.details[0].message
    );
  }
  if (ReqInfo.user_id && ReqInfo.user_id === this.token.user_id) {
    logger.error(TAG, "Invalid Parameters");
    throw exception.PermissionError(
      "PERMISSION_DENY",
      "Can not look for yourself"
    );
  }

  if (ReqInfo.question_id) {
    const question = await QuestionValider.isValidQuestionID(
      ReqInfo.question_id
    );
    if (!question) {
      logger.error(TAG, "Invalid Parameters");
      throw exception.BadRequestError("BAD_REQUEST", "Invalid Question ID");
    }
    if (question.user_id.equals(this.token.user_id)) {
      logger.error(TAG, "Invalid Parameters");
      throw exception.PermissionError(
        "PERMISSION_DENY",
        "Can not look for your question"
      );
    }
    return await QuestionSchema.findById(
      ReqInfo.question_id,
      "-create_user_id"
    );
  }
  const questions = await QuestionSchema.find(
    { create_user_id: this.token.user_id },
    "-create_user_id"
  );
  return await Promise.all(
    questions.map(async (question) => {
      const user = await UserSchma.findById(question.user_id, ["username"]);
      question.user_id = user;
      return question;
    })
  );
};

Question.prototype.GetAllData = async function () {
  const TAG = "[GetALLData Question]";
  const logger = new Logger();

  const questions = await QuestionSchema.find(
    { user_id: { $ne: this.token.user_id } },
    "-create_user_id"
  );
  try {
    return await Promise.all(
      questions.map(async (question) => {
        const user = await UserSchma.findById(question.user_id, ["username"]);
        const rates = await RateSchema.find({ question_id: question._id });
        let rate = 0;
        let avarage = 0;
        rates.forEach((r) => {
          if (r.user_id.equals(this.token.user_id)) rate = r.rate;
          avarage += r.rate;
        });
        if (rate.length) avarage = avarage / rates.length;

        const { _id, title, type, option1, option2, create_time } = question;
        const { username } = user;
        return {
          _id,
          title,
          type,
          option1,
          option2,
          username,
          rate,
          avarage,
          create_time,
        };
      })
    );
  } catch (err) {
    logger.error(TAG, "Delete Question Failed");
    throw exception.ServerError(
      "SERVER_ERROR",
      "GetALLQuestion Question Failed:" + err
    );
  }
};

Question.prototype.Delete = async function (QuestionID) {
  const TAG = "[Delete Question]";
  const logger = new Logger();
  if (!QuestionID) {
    logger.error(TAG, "Invalid Parameters");
    throw exception.BadRequestError("BAD_REQUEST", "Question ID is required");
  }
  const question = await QuestionValider.isValidQuestionID(QuestionID);
  if (!question) {
    logger.error(TAG, "Invalid Parameters");
    throw exception.BadRequestError("BAD_REQUEST", "Invalid Question ID");
  }
  if (!question.create_user_id.equals(this.token.user_id)) {
    logger.error(TAG, "Invalid Parameters");
    throw exception.PermissionError(
      "PERMISSION_DENY",
      "Can not access this question"
    );
  }

  try {
    await QuestionSchema.findByIdAndDelete(QuestionID);
    await RateSchema.deleteMany({ question_id: QuestionID });
    return "Success";
  } catch (err) {
    logger.error(TAG, "Delete Question Failed");
    throw exception.ServerError(
      "SERVER_ERROR",
      "Delete Question Failed:" + err
    );
  }
};

module.exports = Question;
