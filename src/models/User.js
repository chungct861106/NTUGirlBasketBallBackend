const exception = require("../modules/exception");
const jwt = require("jsonwebtoken");
const { UserAPI, UserValider } = require("../joi/user");
const Logger = require("../modules/logger");
const UserSchema = require("../schema/User");
const config = require("../config");
const { ResetMailEmail, CreateAccountEmail } = require("../modules/emailer");

const { CreateUser, UserLogin, UserUpdate, UserRemind, GetUserData } = UserAPI;
class User {
  constructor(token) {
    this.token = token;
  }
  static generateToken(userObj) {
    // gen token
    const iat = Math.floor(Date.now() / 1000);
    const expTime = 5 * 60 * 60;
    const payload = {
      user_id: userObj._id,
      email: userObj.email,
      active: userObj.active,
      iat: iat,
      exp: iat + expTime,
    };
    const signedToken = jwt.sign(payload, config.SECRET_KEY);
    return signedToken;
  }
  static generateVerifyToken(userObj) {
    // gen token
    const iat = Math.floor(Date.now() / 1000);
    const expTime = 60 * 60;
    const payload = {
      user_id: userObj._id,
      email: userObj.email,
      active: userObj.active,
      iat: iat,
      exp: iat + expTime,
    };
    const signedToken = jwt.sign(payload, config.SECRET_KEY);
    return signedToken;
  }
}

User.prototype.Create = async function (userObj) {
  const TAG = "[Create User]";
  const logger = new Logger();
  const validate = await CreateUser.validate(userObj);
  if (validate.error) {
    logger.error(TAG, "Invalid Parameters");
    throw exception.BadRequestError(
      "BAD_REQUEST",
      validate.error.details[0].message
    );
  }
  const { email, username } = userObj;
  const errors = [];
  if (!email.includes("solab.me.ntu.edu"))
    errors.push({
      name: "email",
      errors: ["請使用SOLab信箱"],
    });
  else if (!(await UserValider.isUniqueEmail(email))) {
    errors.push({
      name: "email",
      errors: ["信箱已註冊"],
    });
  }
  if (!(await UserValider.isUniqueName(username)))
    errors.push({
      name: "username",
      errors: ["名稱已註冊"],
    });

  if (errors.length > 0) throw exception.BadRequestError("BAD_REQUEST", errors);
  try {
    const person = new UserSchema(userObj);
    person.save();
    const emailToken = User.generateVerifyToken(person);
    await CreateAccountEmail(person, emailToken);
    return "Success";
  } catch (err) {
    logger.error(TAG, "Create User Failed");
    throw exception.ServerError("SERVER_ERROR", "Create Failed:" + err);
  }
};

User.prototype.Resend = async function (email) {
  const TAG = "[Resend Email]";
  const logger = new Logger();
  const person = await UserSchema.findOne({ email });
  if (!person) {
    logger.error(TAG, "Invalid Parameters");
    throw exception.BadRequestError("BAD_REQUEST", "信箱不存在");
  }
  try {
    const emailToken = User.generateVerifyToken(person);
    await CreateAccountEmail(person, emailToken);
  } catch (err) {
    logger.error(TAG, "Resend Email Failed");
    throw exception.ServerError("SERVER_ERROR", "Resend Email:" + err);
  }
};

User.prototype.Login = async function (email, password) {
  const TAG = "[User Login]";
  const logger = new Logger();
  const validate = await UserLogin.validate({ email, password });
  if (validate.error) {
    logger.error(TAG, "Invalid Parameters");
    throw exception.BadRequestError(
      "BAD_REQUEST",
      validate.error.details[0].message
    );
  }
  const userObj = await UserSchema.findOne({ email });
  console.log(userObj);
  if (!userObj) {
    logger.error(TAG, "Invalid Parameters");
    throw exception.BadRequestError("BAD_REQUEST", "信箱不存在");
  }

  if (userObj.password !== password) {
    logger.error(TAG, "Invalid Parameters");
    throw exception.BadRequestError("BAD_REQUEST", "密碼錯誤");
  }
  if (!userObj.active) {
    logger.error(TAG, "Invalid Parameters");
    throw exception.BadRequestError("BAD_REQUEST", "信箱未驗證");
  }
  try {
    const response = {
      username: userObj.username,
      email: userObj.email,
      user_token: User.generateToken(userObj),
    };
    return response;
  } catch (err) {
    logger.error(TAG, "Login Failed");
    throw exception.ServerError("SERVER_ERROR", "Login Failed:" + err);
  }
};

User.prototype.Update = async function (updateObj) {
  const TAG = "[User Active]";
  const logger = new Logger();

  const validate = await UserUpdate.validate(updateObj);
  if (validate.error) {
    logger.error(TAG, "Invalid Parameters");
    throw exception.BadRequestError(
      "BAD_REQUEST",
      validate.error.details[0].message
    );
  }
  const id = this.token.user_id;

  if (!(await UserValider.isValidUserID(id))) {
    logger.error(TAG, "Invalid Parameters");
    throw exception.BadRequestError("BAD_REQUEST", "Invalid user ID");
  }

  const { username } = updateObj;
  const errors = [];
  if (await UserValider.isUniqueName(username))
    errors.push({
      name: "username",
      errors: ["名稱已註冊"],
    });

  if (errors.length > 0) throw exception.BadRequestError("BAD_REQUEST", errors);

  try {
    return UserSchema.findByIdAndUpdate(id, updateObj, { new: true });
  } catch (err) {
    logger.error(TAG, "Update Failed");
    throw exception.ServerError("SERVER_ERROR", "Update Failed:" + err);
  }
};

User.prototype.GetData = async function () {
  const TAG = "[Get User]";
  const logger = new Logger();
  try {
    return await UserSchema.find(
      { _id: { $ne: this.token.user_id } },
      "-password"
    );
  } catch (err) {
    logger.error(TAG, "Get User Failed");
    throw exception.ServerError("SERVER_ERROR", "Get User Failed:" + err);
  }
};

User.prototype.Remind = async function (email) {
  const TAG = "[User Remind]";
  const logger = new Logger();
  const validate = await UserRemind.validate(email);
  if (validate.error) {
    logger.error(TAG, "Invalid Parameters");
    throw exception.BadRequestError(
      "BAD_REQUEST",
      validate.error.details[0].message
    );
  }
  if (await UserValider.isUniqueEmail(email)) {
    logger.error(TAG, "Invalid Parameters");
    throw exception.BadRequestError("BAD_REQUEST", "信箱未註冊");
  }
  try {
    const User = await UserSchema.findOne({ email });
    await ResetMailEmail(User);
    return "Remind Email Success";
  } catch (err) {
    logger.error(TAG, "Send Email Failed");
    throw exception.ServerError("SERVER_ERROR", "Send Email Failed:" + err);
  }
};
User.prototype.Active = async function () {
  const id = this.token.user_id;

  if (!(await UserValider.isValidUserID(id))) {
    logger.error(TAG, "Invalid Parameters");
    throw exception.BadRequestError("BAD_REQUEST", "Invalid user ID");
  }
  try {
    await UserSchema.findByIdAndUpdate(id, { active: true });
    return "Success";
  } catch (err) {
    throw exception.PermissionError("Token inValid: " + err);
  }
};
User.prototype.CheckToken = async function (token) {
  try {
    return jwt.verify(token, config.SECRET_KEY);
  } catch (err) {
    throw exception.PermissionError("Token NOT Valid: " + err);
  }
};

module.exports = User;
