const mongoose = require("mongoose");
const moment = require("moment-timezone");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  id: {
    type: mongoose.Types.ObjectId,
  },
  account: {
    type: String,
    required: [true, "Account is required."],
  },
  password: {
    type: String,
    required: [true, "Password is required."],
  },
  email: {
    type: String,
    required: [true, "Email is required."],
  },
  admin: {
    type: String,
    required: [true, "Adiminister Type is required."],
  },
  department: {
    type: String,
    required: [true, "Department is required."],
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
