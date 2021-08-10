const nodemailer = require("nodemailer");
const config = require("../config");
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: config.AdministerEmail,
});

const ResetMailEmail = async (userInfo) => {
  const { account, password, email } = userInfo;
  var mailOptions = {
    from: config.AdministerEmail.user,
    to: email,
    subject: "[NTU Girl Basketball Web Team] Account Information",
    text: `Your Account Informations are as followed:
    Acconut: ${account}
    Password: ${password}
    Email: ${email}
For more Informations or problems please sent email to ${config.AdministerEmail.user}
`,
  };

  await transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

const CreateAccountEmail = async (userInfo) => {
  const { account, admin, email } = userInfo;
  var mailOptions = {
    from: config.AdministerEmail.user,
    to: email,
    subject: "[NTU Girl Basketball Web Team] Account Created",
    text: `Your Account (${account}) has been created as an identity of "${admin}".
Your account will be aurthorized by web teams. There will be an email to inform when your account is active. 
For more Informations or problems please sent email to ${config.AdministerEmail.user}
`,
  };

  await transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

const ActiveAccountEmail = async (userInfo) => {
  const { account, admin, email } = userInfo;
  var mailOptions = {
    from: config.AdministerEmail.user,
    to: email,
    subject: "[NTU Girl Basketball Web Team] Account Actived",
    text: `Your Account (${account}) has been actived by NTU web team as an ${admin}. Enjoy your games!!
For more Informations or problems please sent email to ${config.AdministerEmail.user}
`,
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
module.exports.ActiveAccountEmail = ActiveAccountEmail;
