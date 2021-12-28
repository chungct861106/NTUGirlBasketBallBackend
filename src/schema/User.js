const mongoose = require("mongoose");
const moment = require("moment-timezone");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  id: {
    type: mongoose.Types.ObjectId,
  },

  password: {
    type: String,
    required: [true, "Password is required."],
  },
  email: {
    type: String,
    required: [true, "Email is required."],
  },
  username: {
    type: String,
    required: [true, "Username is required."],
  },

  active: {
    type: Boolean,
    default: false,
  },
  create_time: {
    type: Date,
    default: moment.tz(Date.now(), "Asia/Taipei"),
  },
});

const User = mongoose.model("user", UserSchema);

module.exports = User;
