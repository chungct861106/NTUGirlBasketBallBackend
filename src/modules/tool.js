const logger = require("./logger");
const _ = require("underscore");

function isNull() {
  if (!arguments || arguments.length == 0) {
    return true;
  }

  for (let i = 0; i < arguments.length; i++) {
    if (
      _.isNull(arguments[i]) ||
      _.isUndefined(arguments[i]) ||
      arguments[i].length == 0 ||
      (_.isObject(arguments[i]) && _.isEmpty(arguments[i]))
    ) {
      return true;
    }
  }
  return false;
}

function jsonNull(jsonObject) {
  for (let key in jsonObject) {
    if (typeof jsonObject[key] == "undefined") {
      new logger().error(key + " " + jsonObject[key]);
      return true;
    }
  }
  return false;
}

const getUnixTimestamp = (timestamp) => {
  return timestamp.toString().length > 10
    ? Math.floor(timestamp / 1000)
    : timestamp;
};

function getIp(req) {
  let ip = "";
  if (!req) {
    return ip;
  }

  if (req.headers["Cdn-Src-Ip"]) {
    ip = req.headers["Cdn-Src-Ip"];
  } else if (req.headers["x-forwarded-for"]) {
    ip = req.headers["x-forwarded-for"].split(",")[0];
  } else if (req.connection && req.connection.remoteAddress) {
    ip = req.connection.remoteAddress;
  } else {
    ip = req.ip;
  }

  if (typeof ip !== "string") {
    logger.warning("[GetIp]", `Invalid IP Address ${ip}`);
    ip = "";
  }

  return ip.trim();
}

function toJSONSafeString(val) {
  if (typeof val !== "string") {
    return val;
  }

  return val.replace(/[\t\n\r]/g, (match) => {
    switch (match) {
      case "\t":
        return "\\t";
      case "\n":
        return "\\n";
      case "\r":
        return "\\r";
      default:
        return match;
    }
  });
}

function countPage(totalCount, pageSize) {
  if (isNull(totalCount, pageSize) || !_.isNumber(totalCount, pageSize)) {
    throw Error;
  }
  return Math.ceil(totalCount / pageSize);
}

function isNumber() {
  for (let i = 0; i < arguments.length; i++) {
    if (typeof arguments[i] != "number") {
      // logger.error(arguments[i] + ' is not number');
      return false;
    }
  }
  return true;
}

function isInteger() {
  for (let i = 0; i < arguments.length; i++) {
    if (!isNumber(arguments[i]) || arguments[i] % 1 != 0) {
      //logger.error(arguments[i] + ' is not integer');
      return false;
    }
  }
  return true;
}

function isPositiveInteger() {
  for (let i = 0; i < arguments.length; i++) {
    if (!isInteger(arguments[i]) || arguments[i] < 0) {
      return false;
    }
  }
  return true;
}

function isDate(target) {
  let date = Date.parse(target);
  if (isNaN(date)) return false;
  else return true;
}

module.exports.isNull = isNull;
module.exports.jsonNull = jsonNull;
module.exports.getUnixTimestamp = getUnixTimestamp;
module.exports.getIp = getIp;
module.exports.toJSONSafeString = toJSONSafeString;

module.exports.countPage = countPage;
module.exports.isNumber = isNumber;
module.exports.isInteger = isInteger;
module.exports.isPositiveInteger = isPositiveInteger;
module.exports.isDate = isDate;
