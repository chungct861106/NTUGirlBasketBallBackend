const exception = require("../modules/exception");
const { TestAPI, TestValider } = require("../joi/Test");
const Logger = require("../modules/logger");
const TestSchema = require("../schema/Test");

class Test {
  constructor(token) {
    this.token = token;
  }
}

Test.prototype.Create = async function (TestObj) {
  const TAG = "[Create Test]";
  const logger = new Logger();

  const validate = await TestAPI.CreateTest.validate(TestObj);
  if (validate.error) {
    logger.error(TAG, "Invalid Parameters");
    throw exception.BadRequestError(
      "BAD_REQUEST",
      validate.error.details[0].message
    );
  }
  const { name } = TestObj;
  if (!(await TestValider.isUniqueTestName(name))) {
    logger.error(TAG, "Invalid Parameters");
    throw exception.BadRequestError("BAD_REQUEST", "Test Name already exist");
  }
  try {
    const Test = new TestSchema(TestObj);
    return Test.save();
  } catch (err) {
    logger.error(TAG, "Create Test Failed");
    throw exception.ServerError("SERVER_ERROR", "Create Test Failed:" + err);
  }
};

Test.prototype.Update = async function (TestObj) {
  const TAG = "[Update Test]";
  const logger = new Logger();

  const validate = await TestAPI.TestUpdate.validate(TestObj);
  if (validate.error) {
    logger.error(TAG, "Invalid Parameters");
    throw exception.BadRequestError(
      "BAD_REQUEST",
      validate.error.details[0].message
    );
  }
  const { test_id } = TestObj;
  if (!(await TestValider.isValidTestID(test_id)))
    try {
      return await TestSchema.findByIdAndUpdate(test_id, TestObj, {
        new: true,
      });
    } catch (err) {
      logger.error(TAG, "Update Test Failed");
      throw exception.ServerError("SERVER_ERROR", err);
    }
};

Test.prototype.GetData = async function (ReqInfo) {
  const TAG = "[GetData Test]";
  const logger = new Logger();
  const validate = await TestAPI.GetTest.validate(ReqInfo);
  if (validate.error) {
    logger.error(TAG, "Invalid Parameters");
    throw exception.BadRequestError(
      "BAD_REQUEST",
      validate.error.details[0].message
    );
  }
  if (
    "Test_id" in ReqInfo &&
    (await TestValider.isValidTestID(ReqInfo["Test_id"]))
  )
    return await TestSchema.findById(ReqInfo["Test_id"]);
  return await TestSchema.find(ReqInfo);
};

Test.prototype.Delete = async function (TestID) {
  const TAG = "[Delete Test]";
  const logger = new Logger();
  if (!(await TestValider.isValidTestID(TestID))) {
    logger.error(TAG, "Invalid Parameters");
    throw exception.BadRequestError("BAD_REQUEST", "Invalid Test ID");
  }

  try {
    await TestSchema.findByIdAndDelete(TestID);
    return "Success";
  } catch (err) {
    logger.error(TAG, "Delete Test Failed");
    throw exception.ServerError("SERVER_ERROR", "Delete Test Failed:" + err);
  }
};

module.exports = Test;
