const exception = require("../modules/exception");
const Logger = require("../modules/logger");
const TimeSchema = require("../schema/Time");
const TeamSchema = require("../schema/Team");
const UserSchema = require("../schema/User");
const config = require("../config");
const { TeamValider } = require("../joi/team");
const Team = require("../schema/Team");

class Time {
  constructor(token) {
    this.token = token;
  }
}

Time.prototype.Appoint = async function ({ timeNumber, teamID, userID }) {
  const TAG = "[Time Create]";
  const logger = new Logger();
  if (teamID && !(await TeamValider.isValidTeamID(teamID))) {
    logger.error(TAG, "Invalid Parameters");
    throw exception.BadRequestError("BAD_REQUEST", "Invalid TeamID");
  } else if (userID && !(await TeamValider.isValidUserID(userID))) {
    logger.error(TAG, "Invalid Parameters");
    throw exception.BadRequestError("BAD_REQUEST", "Invalid UserID");
  }
  if (teamID) {
    const Appointments = await TimeSchema.findOne({ team_id: teamID });
    if (Appointments) {
      if (Appointments.time.includes(timeNumber))
        Appointments.time = Appointments.time.filter(
          (item) => item !== timeNumber
        );
      else Appointments.time.push(timeNumber);
      return Appointments.save();
    }
    const newAppointments = await new TimeSchema({
      team_id: teamID,
      time: [timeNumber],
    });
    return newAppointments.save();
  } else if (userID) {
    const Appointments = await TimeSchema.findOne({ user_id: userID });
    if (Appointments) {
      if (Appointments.time.includes(timeNumber))
        Appointments.time = Appointments.time.filter(
          (item) => item !== timeNumber
        );
      else Appointments.time.push(timeNumber);
      return Appointments.save();
    }
    const newAppointments = await new TimeSchema({
      user_id: userID,
      time: [timeNumber],
    });
    return newAppointments.save();
  }
};

Time.prototype.GetTime = async function (type) {
  const TAG = "[Time Data]";
  const logger = new Logger();
  if (config.ADMIN_LEVEL[this.token.admin] < 2) {
    logger.error(
      TAG,
      `Adiminister (${this.token.admin}) has no access to ${TAG}.`
    );
    throw exception.PermissionError("Permission Deny", "have no access");
  }
  if (type === "team") {
    const data = await TimeSchema.find({ team_id: { $ne: null } });
    return Promise.all(
      data.map(async (time) => {
        const team = await TeamSchema.findById(time.team_id);
        return {
          team_id: team._id,
          name: team.name,
          time: time ? time.time : null,
        };
      })
    );
  }
  return await TimeSchema.find({ user_id: { $ne: null } });
};

Time.prototype.GetTimeById = async function ({ user_id, team_id }) {
  const TAG = "[Time Data By ID]";
  const logger = new Logger();
  if (team_id) {
    if (!(await TeamValider.isValidTeamID(team_id))) {
      logger.error(TAG, `Invalid Team ID.`);
      throw exception.BadRequestError("BAD_REQUEST", "Invalid Team ID");
    }
    const team = await TeamSchema.findById(team_id);
    const data = await TimeSchema.findOne({ team_id });
    return { id: team._id, name: team.name, time: data ? data.time : [] };
  }
  if (!(await TeamValider.isValidUserID(team_id))) {
    logger.error(TAG, `Invalid User ID.`);
    throw exception.BadRequestError("BAD_REQUEST", "Invalid User ID");
  }
  const user = await UserSchema.findById(user_id);
  const data = await TimeSchema.findOne({ user_id });
  return { id: user._id, name: user.name, time: data.time };
};

module.exports = Time;
