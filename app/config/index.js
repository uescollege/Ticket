const dotenv = require("dotenv");
dotenv.config({
  silent: process.env.NODE_ENV === "production",
});

module.exports = {
  SECRET: process.env.SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1d',
};
