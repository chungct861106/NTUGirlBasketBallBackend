const nodemailer = require("nodemailer");
const config = require("../config");
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: config.AdministerEmail,
});

const ResetMailEmail = async (userInfo) => {
  const { email, password } = userInfo;
  var mailOptions = {
    from: config.AdministerEmail.user,
    to: email,
    subject: "[說說 Lab] 北七嗎？",
    text: `Password: ${password}`,
  };

  await transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

const CreateAccountEmail = async (userInfo, emailtoken) => {
  const { email } = userInfo;
  var mailOptions = {
    from: config.AdministerEmail.user,
    to: email,
    subject: "[說說Lab] 說說帳號已創建",
    text: `歡應加入說說Lab，點選下方連結啟用說說帳號:\n https://shousolab-game.herokuapp.com/verify/${emailtoken}`,
  };

  await transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

module.exports.ResetMailEmail = ResetMailEmail;
module.exports.CreateAccountEmail = CreateAccountEmail;
