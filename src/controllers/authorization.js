const _ = require("underscore");
const jwt = require("jsonwebtoken");
const config = require("../config");
const Logger = require("../modules/logger");
const exception = require("../modules/exception");
const response = require("../modules/response");
const tool = require("../modules/tool");

const whiteList = [
  { url: "/user/login", method: "PUT" },
  { url: "/user/remind", method: "PUT" },
  { url: "/user/resend", method: "PUT" },
  { url: "/user/create", method: "POST" },
  { url: "/user/checkToken", method: "GET" },
];

function doAuthAction(req, resp, next) {
  const logger = new Logger();
  const TAG = "[DoAuthAction]";

  const url = req.baseUrl;
  let matches = _.where(whiteList, { url: url, method: req.method });
  if (matches.length > 0 || req.method === "OPTIONS") {
    next();
    return;
  }
  let token = req.get("Authorization");
  try {
    req.headers.token = jwt.verify(token, config.SECRET_KEY);
    const expTime = req.headers.token.exp;
    const nowTime = tool.getUnixTimestamp(Date.now());
    if (nowTime > expTime) {
      logger.error(
        TAG,
        `This token has been expired. exp:${expTime}, now:${nowTime}`
      );
      return response.fail(
        resp,
        exception.PermissionError("INVALID_TOKEN", "invalid token")
      );
    }
    next();
  } catch (err) {
    logger.error(TAG, `Unexpected exception occurred because ${err}.`);
    return response.fail(
      resp,
      exception.PermissionError("INVALID_TOKEN", "invalid token")
    );
  }
}

module.exports.doAuthAction = doAuthAction;
