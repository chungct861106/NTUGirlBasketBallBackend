const config = {};

config.SECRET_KEY = process.env.SECRET_KEY;

config.AdministerEmail = {
  user: "shuosolab@gmail.com",
  pass: process.env.SECRET_KEY,
};

module.exports = config;
