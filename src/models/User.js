const exception = require("../modules/exception");
const jwt = require("jsonwebtoken");
const { UserAPI, UserValider } = require("../joi/user");
const Logger = require("../modules/logger");
const UserSchema = require("../schema/User");
const config = require("../config");
const {
  ResetMailEmail,
  CreateAccountEmail,
  ActiveAccountEmail,
} = require("../modules/emailer");

const {
  CreateUser,
  UserActive,
  UserLogin,
  UserUpdate,
  UserRemind,
  GetUserData,
} = UserAPI;
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
      account: userObj.account,
      email: userObj.email,
      admin: userObj.admin,
      active: userObj.active,
      department: userObj.department,
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
  const { account, email } = userObj;
  const errors = [];
  if (!(await UserValider.isUniqueAccount(account))) {
    errors.push({
      name: "account",
      errors: ["Account already exist."],
    });
  }
  if (!(await UserValider.isUniqueEmail(email))) {
    errors.push({
      name: "email",
      errors: ["Email already exist."],
    });
  }

  if (errors.length > 0) throw exception.BadRequestError("BAD_REQUEST", errors);
  try {
    const person = new UserSchema(userObj);
    person.save();
    await CreateAccountEmail(person);
    return "Success";
  } catch (err) {
    logger.error(TAG, "Create User Failed");
    throw exception.ServerError("SERVER_ERROR", "Create Failed:" + err);
  }
};

User.prototype.Login = async function (account, password) {
  const TAG = "[User Login]";
  const logger = new Logger();
  const validate = await UserLogin.validate({ account, password });
  if (validate.error) {
    logger.error(TAG, "Invalid Parameters");
    throw exception.BadRequestError(
      "BAD_REQUEST",
      validate.error.details[0].message
    );
  }
  const userObj = await UserSchema.findOne({ account });
  if (!userObj) {
    logger.error(TAG, "Invalid Parameters");
    throw exception.BadRequestError("BAD_REQUEST", "Account doesn't exist");
  }

  if (userObj.password !== password) {
    logger.error(TAG, "Invalid Parameters");
    throw exception.BadRequestError("BAD_REQUEST", "Password incorrect");
  }
  try {
    const response = {
      user_id: userObj._id,
      account: userObj.account,
      email: userObj.email,
      active: userObj.active,
      admin: userObj.admin,
      department: userObj.department,
      token: User.generateToken(userObj),
    };
    return response;
  } catch (err) {
    logger.error(TAG, "Login Failed");
    throw exception.ServerError("SERVER_ERROR", "Login Failed:" + err);
  }
};

User.prototype.Active = async function (userID) {
  const TAG = "[User Active]";
  const logger = new Logger();

  if (config.ADMIN_LEVEL[this.token.admin] < 2) {
    logger.error(TAG, "Permission Deny");
    throw exception.PermissionError("PERMISSIOIN_DENY", "You Have No Access");
  }

  const validate = await UserActive.validate({ id: userID });
  if (validate.error) {
    logger.error(TAG, "Invalid Parameters");
    throw exception.BadRequestError(
      "BAD_REQUEST",
      validate.error.details[0].message
    );
  }
  if (!(await UserValider.isValidUserID(userID))) {
    logger.error(TAG, "Invalid Parameters");
    throw exception.BadRequestError("BAD_REQUEST", "Invalid user ID");
  }
  try {
    const user = await UserSchema.findById(userID);
    user.active = !user.active;
    user.save();
    await ActiveAccountEmail(user);
  } catch (err) {
    logger.error(TAG, "Active Failed");
    throw exception.ServerError("SERVER_ERROR", "Acitve Failed:" + err);
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

  const user = await UserSchema.findById(id);

  if (user.account === updateObj.account) delete updateObj.account;
  if (user.email === updateObj.email) delete updateObj.email;

  const { account, email } = updateObj;
  const errors = [];

  if (account && !(await UserValider.isUniqueAccount(account))) {
    errors.push({
      name: "account",
      errors: ["Account already exist."],
    });
  }
  if (email && !(await UserValider.isUniqueEmail(email))) {
    errors.push({
      name: "email",
      errors: ["Email already exist."],
    });
  }
  if (errors.length > 0) throw exception.BadRequestError("BAD_REQUEST", errors);

  try {
    return UserSchema.findByIdAndUpdate(id, updateObj, { new: true });
  } catch (err) {
    logger.error(TAG, "Update Failed");
    throw exception.ServerError("SERVER_ERROR", "Update Failed:" + err);
  }
};

User.prototype.GetData = async function (userQuery) {
  const TAG = "[Get User]";
  const logger = new Logger();
  const validate = await GetUserData.validate(userQuery);
  if (validate.error) {
    logger.error(TAG, "Invalid Parameters");
    throw exception.BadRequestError(
      "BAD_REQUEST",
      validate.error.details[0].message
    );
  }
  if (userQuery.user_id && (await UserValider.isValidUserID(userQuery.user_id)))
    return await UserSchema.findById(userQuery.user_id, "-password");
  return await UserSchema.find(userQuery, "-password");
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
    throw exception.BadRequestError("BAD_REQUEST", "Email doesn't exist");
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

User.prototype.CheckToken = async function (token) {
  try {
    return jwt.verify(token, config.SECRET_KEY);
  } catch (err) {
    throw exception.PermissionError("Token NOT Valid: " + err);
  }
};

module.exports = User;
