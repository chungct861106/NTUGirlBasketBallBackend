# NTU Girl BasketBall Backend

###### tags: `Girl Basketball`

### Introduction

It's design for National Taiwan University's basketball contest website. This repository is for the website's backend service, including login/log out, account, matches and teams information's create, update, delete and query services.

### Design Tools

- Database: [mongodb]
- NodeJs:
  - [express]: Router for request
  - [mongoose]: Mongodb's database interactive module
  - [nodemailer]: Email service
  - [joi]: Request validation
  - [babel]: Module automation
  - [nodemon]: Update automation
  - [jsonwebtoken]: Keys and Authorization's generation and verification
- Backend Style: Restful API

### Directory Structure

```
.
├── bin
│   └── www
├── history.log
├── package-lock.json
├── package.json
├── src
│   ├── access.log
│   ├── app.js
│   ├── config.js
│   ├── controllers
│   │   ├── authorization.js
│   │   ├── index.js
│   │   ├── match.js
│   │   ├── player.js
│   │   ├── post.js
│   │   ├── team.js
│   │   └── user.js
│   ├── department.json
│   ├── joi
│   │   ├── match.js
│   │   ├── player.js
│   │   ├── post.js
│   │   ├── team.js
│   │   └── user.js
│   ├── models
│   │   ├── Match.js
│   │   ├── Player.js
│   │   ├── Post.js
│   │   ├── Team.js
│   │   └── User.js
│   ├── modules
│   │   ├── database.js
│   │   ├── emailer.js
│   │   ├── exception.js
│   │   ├── hook.js
│   │   ├── logger.js
│   │   ├── response.js
│   │   └── tool.js
│   ├── schema
│   │   ├── Match.js
│   │   ├── Player.js
│   │   ├── Post.js
│   │   ├── Team.js
│   │   └── User.js
│   └── views
│       ├── error.jade
│       ├── index.jade
│       └── layout.jade
└── yarn.lock
```

- contorllers
  Handle request and route to models
- joi
  Validations for each API request parameters
- models
  Handle API logic and interact with database
- schema
  Database table structure design.
- views
  Invalid API request view

### Authorization

```=javascript
const whiteList = [
  { url: "/users/login", method: "PUT" },
  { url: "/users/remind", method: "PUT" },
  { url: "/users/create", method: "POST" },
  { url: "/users/checkToken", method: "GET" },
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
    req.header.token = jwt.verify(token, config.SECRET_KEY);
    next();
  } catch (err) {
    logger.error(TAG, `Unexpected exception occurred because ${err}.`);
    return response.fail(
      resp,
      exception.PermissionError("INVALID_TOKEN", "invalid token")
    );
  }
}
```

- white list
  It's designed to compromize some APIs that can be access without sign in.
- doAuthorize
  Using jsonwebtoken to verify user's token, if it's valided, then turn the token back to user's infomation object and stored it in request header.

### Create new API

- Step 1: Schema
  Create new table (if already existed table then pass this step)

./src/schema/Test.js

```=nodejs
const mongoose = require("mongoose");
const moment = require("moment-timezone");
const Schema = mongoose.Schema;

const TestSchema = new Schema({
  id: {
    type: mongoose.Types.ObjectId,
  },
  name: {
    type: String,
    unique: true,
    require: [true, "Name is required"],
  },
  number: {
    type: Number,
    default: 0,
  },
  create_time: {
    type: Date,
    default: moment.tz(Date.now(), "Asia/Taipei"),
  },
});

const Test = mongoose.model("Test", TestSchema);

module.exports = Test;
```

- Step 2: Joi
  Create a file for validation of request parameters.

./src/joi/test.js

```=nodejs
const Joi = require("joi");
const TestSchema = require("../schema/Team");

const types = ["student", "employee", "boss", "CEO"];
const TestAPI = {
  CreateTest: Joi.object({
    name: Joi.string().required(),
    number: Joi.number().required(),
    type: Joi.any().valid(...types),
    url: Joi.string(),
  }),

  TestUpdate: Joi.object({
    test_id: Joi.string().required(),
    name: Joi.string(),
    number: Joi.number(),
    type: Joi.any().valid(...types),
    url: Joi.string(),
  }),

  GetTest: Joi.object({
    test_id: Joi.string(),
    name: Joi.string(),
    number: Joi.number(),
    type: Joi.any().valid(...types),
    url: Joi.string(),
  }),
};

const TestValider = {
  isUniqueTestName: async (name) => {
    const exist = await TestSchema.findOne({ name });
    return exist === undefined || exist === null;
  },
  isValidTestID: async (id) => {
    try {
      const exist = await TestSchema.findById(id);
      return exist !== undefined && exist !== null;
    } catch {
      return false;
    }
  },
};

module.exports.TestAPI = TestAPI;
module.exports.TestValider = TestValider;

```

- Step 3: Model
  Create the api main logic

./src/models/Test.js

```=nodejs
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
      return await TestSchema.findByIdAndUpdate(Test_id, TestObj, {
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
    "test_id" in ReqInfo &&
    (await TestValider.isValidTestID(ReqInfo["test_id"]))
  )
    return await TestSchema.findById(ReqInfo["test_id"]);
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
```

- Step 4: Controller
  Create new router of new API

./src/contrllers/test.js

```=nodejs
const express = require("express");
const response = require("../modules/response");
const Test = require("../models/Test");

const router = express.Router();

router.post("/create", async (req, res) => {
  const TestObj = req.body;
  const { token } = req.header;
  try {
    const result = await new Test(token).Create(TestObj);
    return response.succ(res, result);
  } catch (err) {
    return response.fail(res, err);
  }
});

router.post("/update", async (req, res) => {
  const TestObj = req.body;
  const { token } = req.header;
  try {
    const result = await new Test(token).Update(TestObj);
    return response.succ(res, result);
  } catch (err) {
    return response.fail(res, err);
  }
});

router.get("/data", async (req, res) => {
  const { token } = req.header;
  const ReqInfo = req.query;
  try {
    const result = await new Test(token).GetData(ReqInfo);
    return response.succ(res, result);
  } catch (err) {
    return response.fail(res, err);
  }
});

router.delete("/delete", async (req, res) => {
  const { token } = req.header;
  const teamID = req.body.test_id;
  try {
    const result = await new Test(token).Delete(testID);
    return response.succ(res, result);
  } catch (err) {
    return response.fail(res, err);
  }
});
module.exports = router;

```

Add the new API structure to index.js

./src/controllers/index.js

```=nodejs
const express = require("express");
const router = express.Router();
const aurthor = require("./authorization");
router.use("*", aurthor.doAuthAction);
router.use("/users", require("./user"));
router.use("/posts", require("./post"));
router.use("/teams", require("./team"));
router.use("/matches", require("./match"));
router.use("/players", require("./player"));
router.use("/tests", require("./test")); // add this line
module.exports = router;

```

Now You can use any request test to test your new API. EX: [Postman], [Thunder]

[mongodb]: https://www.mongodb.com/
[express]: https://expressjs.com/zh-tw/

[mongoose]: [express]
[nodemailer]: https://nodemailer.com/about/
[joi]: https://www.npmjs.com/package/joi
[babel]: https://babeljs.io/
[nodemon]:https://www.npmjs.com/package/nodemon
[jsonwebtoken]: https://www.npmjs.com/package/jsonwebtoken
[Postman]: https://www.postman.com/
[Thunder]: https://marketplace.visualstudio.com/items?itemName=rangav.vscode-thunder-client
