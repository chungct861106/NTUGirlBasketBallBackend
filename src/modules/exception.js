const httpStatus = require("http-status-codes");

class WebBaseError extends Error {
  constructor(statusCode, code, message, data) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.data = data;
  }
}

class SqlError extends WebBaseError {
  constructor(code, message) {
    super(httpStatus.BAD_REQUEST, code, message); // 400
  }
}

class BadRequestError extends WebBaseError {
  constructor(message, data) {
    super(httpStatus.BAD_REQUEST, 400, message, data); // 400
  }
}

class AuthError extends WebBaseError {
  constructor(code, message) {
    super(httpStatus.UNAUTHORIZED, code, message); // 401
  }
}

class PermissionError extends WebBaseError {
  constructor(code, message) {
    super(httpStatus.UNAUTHORIZED, code, message); // 401
  }
}

class ForbiddenError extends WebBaseError {
  constructor(code, message) {
    super(httpStatus.FORBIDDEN, code, message); // 403
  }
}

class ServerError extends WebBaseError {
  constructor(code, message) {
    super(httpStatus.INTERNAL_SERVER_ERROR, code, message); // 500
  }
}

const exception = {
  isWebError: function (err) {
    if (err instanceof WebBaseError) {
      return true;
    }
    return false;
  },

  SqlError: function (message) {
    return new SqlError(500, message);
  },

  BadRequestError: function (message, data) {
    return new BadRequestError(message, data);
  },

  AuthError: function (message) {
    return new AuthError(401, message);
  },

  PermissionError: function (message) {
    return new PermissionError(401, message);
  },

  ForbiddenError: function (code, message) {
    return new ForbiddenError(code, message);
  },

  ServerError: function (code, message) {
    return new ServerError(code, message);
  },
};

module.exports = exception;
